import { reply } from './util/messenger';
import { Scenes } from 'telegraf';
import I18n from '../i18n/i18n';
import { LingulyContext } from './util/sceneCommon';
import { setUserState, getUserState, setUserEmail, getUserEmail } from '../localDB/user';
import { login } from '../services/user'

const i18n = new I18n('en');

const registerLogin = (bot: any, login: Scenes.BaseScene<LingulyContext>) => {
    /* Set scene enter commands */
    bot.command('login', (ctx: LingulyContext) => ctx.scene.enter('login'));
    bot.hears('login', (ctx: LingulyContext) => ctx.scene.enter('login'));
    /* Special commands */
    login.enter((ctx: LingulyContext) => { onEntrance(ctx) });
    login.command('help', (ctx: LingulyContext) => { reply(ctx, i18n.t('help_message')); });
    login.on('message', (ctx: LingulyContext) => { parser(ctx); });
}

const onEntrance = async (ctx: LingulyContext) => {
    reply(ctx, i18n.t('login.entrance_message'), greetingOptions);
    setUserState(ctx, 'login_or_signup');
}

const parser = async (ctx: LingulyContext) => {
    if (!ctx.text) return;
    const userState = await getUserState(ctx);
    switch (ctx.text) {
        case i18n.t('login.yes_account'):
            reply(ctx, i18n.t('login.enter_email'));
            setUserState(ctx, 'login_email');
            break;
        case i18n.t('login.no_account'):
            ctx.scene.enter('mainMenu');
            break;
        default:
            switch (userState) {
                case 'login_email':
                    reply(ctx, i18n.t('login.enter_password'));
                    setUserEmail(ctx, ctx.text);
                    setUserState(ctx, 'login_password');
                    break;
                case 'login_password':
                    await loginTheUser(ctx, ctx.text);
                    break;
                default:
                    ctx.scene.enter('login');
                    break
            }
    }
}

const loginTheUser = async (ctx: LingulyContext, password: string) => {
    const email = await getUserEmail(ctx) || '';
    const response = await login(String(ctx.chat?.id), email, password)
    if (response.success) {
        reply(ctx, i18n.t('login.successful_login'));
        ctx.scene.enter('mainMenu');
    }
    else if (response.detail) {
        reply(ctx, i18n.t('login.error_with_detail') + response.detail);
        // Reset user state and email after login attempt
        ctx.scene.enter('login')
    }
    else {
        reply(ctx, i18n.t('login.unknown_error'));
        // Reset user state and email after login attempt
        ctx.scene.enter('login')
    }
}

const greetingOptions = {
    reply_markup: JSON.stringify({
        keyboard: [
            [{ text: i18n.t('login.yes_account') }],
            [{ text: i18n.t('login.no_account') }]
        ],
        one_time_keyboard: true
    })
};

export {
    registerLogin
};
