import redis from './redis';
import { LingulyContext } from '../scenes/util/sceneCommon';

export type UserState = 'login_or_signup' | 'login_email' | 'login_password' | 'signup_email' | 'signup_name' | 'signup_password';

export async function getUserToken(chatId: string) {
    var userToken: string | null = await redis.get(chatId);
    if (userToken) {
        return userToken;
    } else {
        return null;
    }
}

export async function setUserToken(chatId: string, token: string) {
    await redis.set(chatId, token);
    console.log(`User token for ${chatId} set successfully.`);
}

/* User Context setter and getter functions using the session object in LingulyContext
 * Later we might want to use Redis for these states as well to make the chat fellow more robust */

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