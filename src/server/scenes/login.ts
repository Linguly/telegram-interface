import { reply } from './util/messenger';
import { Scenes } from 'telegraf';
import I18n from '../i18n/i18n';
import { setBetweenSceneCommands, LingulyContext } from './util/sceneCommon';
import { setUserState, getUserState, setUserEmail, getUserEmail, setUserToken } from '../localDB/user';
import { login } from '../services/user'
import { validate } from './util/validator'

const i18n = new I18n('en');

const registerLogin = (bot: any, login: Scenes.BaseScene<LingulyContext>) => {
    /* Set scene enter commands */
    bot.command('login', async (ctx: LingulyContext) => await ctx.scene.enter('login'));
    bot.hears('login', async (ctx: LingulyContext) => await ctx.scene.enter('login'));
    setBetweenSceneCommands(login);
    /* Special commands */
    login.enter(async (ctx: LingulyContext) => { await onEntrance(ctx) });
    login.command('help', async (ctx: LingulyContext) => { await reply(ctx, i18n.t('help_message')); });
    login.on('message', async (ctx: LingulyContext) => {
        await parser(ctx);
    });
}

const onEntrance = async (ctx: LingulyContext) => {
    await setUserState(ctx, 'login_or_signup');
    // Invalidate token to logout the user if they were logged in
    await setUserToken(ctx, '');
    await reply(ctx, i18n.t('login.entrance_message'), greetingOptions);
}

const parser = async (ctx: LingulyContext) => {
    if (!ctx.text) return;
    const userState = await getUserState(ctx);
    switch (ctx.text) {
        case i18n.t('login.yes_account'):
            await setUserState(ctx, 'login_email');
            await reply(ctx, i18n.t('login.enter_email'));
            break;
        case i18n.t('login.no_account'):
            await ctx.scene.enter('signup');
            break;
        case i18n.t('buttons.back'):
            await ctx.scene.enter('mainMenu');
            break;
        default:
            switch (userState) {
                case 'login_email':
                    if (await validate(ctx, 'email', ctx.text)) {
                        await setUserState(ctx, 'login_password');
                        await setUserEmail(ctx, ctx.text);
                        await reply(ctx, i18n.t('login.enter_password'));
                    }
                    break;
                case 'login_password':
                    if (await validate(ctx, 'password', ctx.text)) {
                        await setUserState(ctx, 'login_or_signup');
                        await loginTheUser(ctx, ctx.text);
                    }
                    break;
                default:
                    await ctx.scene.enter('login');
                    break;
            }
    }
}

const loginTheUser = async (ctx: LingulyContext, password: string) => {
    const email = await getUserEmail(ctx) || '';
    const response = await login(ctx, email, password);

    if (response.success) {
        await reply(ctx, i18n.t('login.successful'));
        await ctx.scene.enter('mainMenu');
    }
    else if (response.detail) {
        await reply(ctx, i18n.t('login.error_with_detail') + response.detail);
        // Reset user state
        await ctx.scene.enter('login');
    }
    else {
        await reply(ctx, i18n.t('login.error_unknown'));
        // Reset user state
        await ctx.scene.enter('login');
    }
}

const greetingOptions = {
    reply_markup: JSON.stringify({
        keyboard: [
            [{ text: i18n.t('login.yes_account') }],
            [{ text: i18n.t('login.no_account') }],
            [{ text: i18n.t('buttons.back') }]
        ],
        one_time_keyboard: true
    })
};

export {
    registerLogin
};
