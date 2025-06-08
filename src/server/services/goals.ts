import callLingulyCoreApi from './lingulyCore';
import { getUserToken } from '../localDB/user';
import { LingulyContext } from '../scenes/util/sceneCommon';

export async function getGoals(ctx: LingulyContext) {
    var userToken = await getUserToken(ctx);
    if (!userToken) {
        return { success: false, message: 'User not authenticated', status: 401 };
    }
    const method = 'GET';
    const url = process.env.LINGULY_CORE_BASE_URL + '/goals';
    const body = null;

    const response = await callLingulyCoreApi(method, url, body, userToken);
    return response;
}

export async function createGoal(ctx: LingulyContext, language: string, level: string, context: string, period: string) {
    var userToken = await getUserToken(ctx);
    if (!userToken) {
        return { success: false, message: 'User not authenticated', status: 401 };
    }
    const method = 'POST';
    const url = `${process.env.LINGULY_CORE_BASE_URL}/goals`;
    const body = { language, level, context, period };

    const response = await callLingulyCoreApi(method, url, body, userToken);
    return response;
}

export async function selectGoal(ctx: LingulyContext, goalId: string) {
    var userToken = await getUserToken(ctx);
    if (!userToken) {
        return { success: false, message: 'User not authenticated', status: 401 };
    }
    const method = 'POST';
    const url = `${process.env.LINGULY_CORE_BASE_URL}/goals/${goalId}/select`;
    const body = null;

    const response = await callLingulyCoreApi(method, url, body, userToken);
    return response;
}

export async function getSelectedGoal(ctx: LingulyContext) {
    var userToken = await getUserToken(ctx);
    if (!userToken) {
        return { success: false, message: 'User not authenticated', status: 401 };
    }
    const method = 'GET';
    const url = `${process.env.LINGULY_CORE_BASE_URL}/goals/selected`;
    const body = null;

    const response = await callLingulyCoreApi(method, url, body, userToken);
    return response;
}
