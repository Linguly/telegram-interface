import { LingulyContext } from '../scenes/util/sceneCommon';

export type UserState = 'idle'
    | 'login_or_signup' | 'login_email' | 'login_password' | 'signup_email' | 'signup_name' | 'signup_password'
    | 'create_or_select_goal' | 'create_a_goal' | 'select_a_goal' | 'enter_context' | 'enter_level' | 'enter_period';


/* User Context setter and getter functions using the session object in LingulyContext
 * As we are using Redis for the telegram's store, all are stored in Redis behind the scene
 * and managed by Telegram's Session. More info -> https://github.com/telegraf/session?tab=readme-ov-file#redis
 * */

export async function getUserToken(ctx: LingulyContext) {
    if (!ctx.session || !ctx.session.userToken) {
        return undefined;
    }
    return ctx.session.userToken;
}

export async function setUserToken(ctx: LingulyContext, token: string) {
    if (!ctx.session) {
        ctx.session = {};
    }
    ctx.session.userToken = token;
    console.log(`User token for ${ctx.chat?.id} set successfully.`);
}


export async function getUserState(ctx: LingulyContext): Promise<UserState | undefined> {
    if (!ctx.session || !ctx.session.userState) {
        return undefined;
    }
    return ctx.session.userState;
}

export async function setUserState(ctx: LingulyContext, state: UserState) {
    if (!ctx.session) {
        ctx.session = {};
    }
    ctx.session.userState = state;
}

export async function getUserEmail(ctx: LingulyContext): Promise<string | undefined> {
    if (!ctx.session || !ctx.session.userEmail) {
        return undefined;
    }
    return ctx.session.userEmail;
}

export async function setUserEmail(ctx: LingulyContext, email: string) {
    if (!ctx.session) {
        ctx.session = {};
    }
    ctx.session.userEmail = email;
}

export async function getUserName(ctx: LingulyContext): Promise<string | undefined> {
    if (!ctx.session || !ctx.session.userName) {
        return undefined;
    }
    return ctx.session.userName;
}

export async function setUserName(ctx: LingulyContext, name: string) {
    if (!ctx.session) {
        ctx.session = {};
    }
    ctx.session.userName = name;
}