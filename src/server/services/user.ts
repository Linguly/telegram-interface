import callLingulyCoreApi from './lingulyCore';
import { getUserToken, setUserToken } from '../localDB/user';

export async function getUserMe(chatId: string) {
    var userToken = await getUserToken(chatId);
    if (!userToken) {
        return null;
    }

    const method = 'GET';
    const url = process.env.LINGULY_CORE_BASE_URL + '/user/me';
    const body = null;

    const userMe = await callLingulyCoreApi(method, url, body, userToken);
    return userMe;
}

export async function login(chatId: string, email: string, password: string) {
    const method = 'POST';
    const url = `${process.env.LINGULY_CORE_BASE_URL}/login`;
    const body = { email, password };

    const response = await callLingulyCoreApi(method, url, body);
    if (response.success && response.data.access_token) {
        setUserToken(chatId, response.data.access_token);
    }
    return response;
}

export async function signup(chatId: string, email: string, name: string, password: string) {
    const method = 'POST';
    const url = `${process.env.LINGULY_CORE_BASE_URL}/signup`;
    const body = { email, name, password };

    const response = await callLingulyCoreApi(method, url, body);
    if (response.success && response.data.access_token) {
        setUserToken(chatId, response.data.access_token);
    }
    return response;
}