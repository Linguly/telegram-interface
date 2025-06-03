import callLingulyCoreApi from './lingulyCore';
import { getUserToken, setUserToken, setUserName, setUserEmail } from '../localDB/user';
import { LingulyContext } from '../scenes/util/sceneCommon';

export async function updateUserInfo(ctx: LingulyContext) {
    var userToken = await getUserToken(ctx);
    if (!userToken) {
        return false;
    }

    const method = 'GET';
    const url = process.env.LINGULY_CORE_BASE_URL + '/user/me';
    const body = null;

    const response = await callLingulyCoreApi(method, url, body, userToken);
    if (response.success && response.data.current_user) {
        await setUserName(ctx, response.data.current_user.name);
        await setUserEmail(ctx, response.data.current_user.email);
        return true; // User info updated successfully
    }
    return false;
}

export async function login(ctx: LingulyContext, email: string, password: string) {
    const method = 'POST';
    const url = `${process.env.LINGULY_CORE_BASE_URL}/login`;
    const body = { email, password };

    const response = await callLingulyCoreApi(method, url, body);
    if (response.success && response.data.access_token) {
        await setUserToken(ctx, response.data.access_token);
        await updateUserInfo(ctx); // Update user info after login
    }
    return response;
}

export async function signup(ctx: LingulyContext, name: string, email: string, password: string) {
    const method = 'POST';
    const url = `${process.env.LINGULY_CORE_BASE_URL}/signup`;
    const body = { email, name, password };

    const response = await callLingulyCoreApi(method, url, body);
    if (response.success && response.data.access_token) {
        await setUserToken(ctx, response.data.access_token);
        await updateUserInfo(ctx); // Update user info after login
    }
    return response;
}