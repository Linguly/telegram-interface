import { reply } from './util/messenger';
import { Scenes } from 'telegraf';
import I18n from '../i18n/i18n';
import { setBetweenSceneCommands, LingulyContext } from './util/sceneCommon';
import { setUserState, getUserState, setUserName, getUserName, setUserEmail, getUserEmail } from '../localDB/user';
import { signup } from '../services/user'

const i18n = new I18n('en');

const registerSignup = (bot: any, signup: Scenes.BaseScene<LingulyContext>) => {
    /* Set scene enter commands */
    bot.command('signup', async (ctx: LingulyContext) => await ctx.scene.enter('signup'));
    bot.hears('signup', async (ctx: LingulyContext) => await ctx.scene.enter('signup'));
    setBetweenSceneCommands(signup);
    /* Special commands */
    signup.enter(async (ctx: LingulyContext) => { await onEntrance(ctx) });
    signup.command('help', async (ctx: LingulyContext) => { await reply(ctx, i18n.t('help_message')); });
    signup.on('message', async (ctx: LingulyContext) => {
        await parser(ctx);
    });
}

const onEntrance = async (ctx: LingulyContext) => {
    await setUserState(ctx, 'signup_name');
    await reply(ctx, i18n.t('signup.entrance_message'));
}

const parser = async (ctx: LingulyContext) => {
    if (!ctx.text) return;
    const userState = await getUserState(ctx);
    switch (userState) {
        case 'signup_name':
            await setUserState(ctx, 'signup_email');
            await setUserName(ctx, ctx.text);
            await reply(ctx, i18n.t('signup.enter_email'));
            break;
        case 'signup_email':
            await setUserState(ctx, 'signup_password');
            await setUserEmail(ctx, ctx.text);
            await reply(ctx, i18n.t('signup.enter_password'));
            break;
        case 'signup_password':
            await setUserState(ctx, 'signup_name');
            await signupTheUser(ctx, ctx.text);
            break;
        default:
            await ctx.scene.enter('signup');
            break;
    }
}

const signupTheUser = async (ctx: LingulyContext, password: string) => {
    const name = await getUserName(ctx) || '';
    const email = await getUserEmail(ctx) || '';
    const response = await signup(ctx, name, email, password);

    if (response.success) {
        await reply(ctx, i18n.t('signup.successful'));
        await ctx.scene.enter('mainMenu');
    }
    else if (response.detail) {
        await reply(ctx, i18n.t('signup.error_with_detail') + response.detail);
        // Reset user state
        await ctx.scene.enter('signup');
    }
    else {
        await reply(ctx, i18n.t('signup.unknown_error'));
        // Reset user state
        await ctx.scene.enter('signup');
    }
}

export {
    registerSignup
};
