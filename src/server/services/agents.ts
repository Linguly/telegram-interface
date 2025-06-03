import callLingulyCoreApi from './lingulyCore';
import { getUserToken } from '../localDB/user';
import { LingulyContext } from '../scenes/util/sceneCommon';

export async function getAgents(ctx: LingulyContext) {
    var userToken = await getUserToken(ctx);
    if (!userToken) {
        return { success: false, message: 'User not authenticated', status: 401 };
    }
    const method = 'GET';
    const url = process.env.LINGULY_CORE_BASE_URL + '/agents';
    const body = null;

    const response = await callLingulyCoreApi(method, url, body, userToken);
    return response;
}

export async function chatWithAgent(ctx: LingulyContext, agentId: string, content: string) {
    var userToken = await getUserToken(ctx);
    if (!userToken) {
        return { success: false, message: 'User not authenticated', status: 401 };
    }
    const method = 'POST';
    const url = `${process.env.LINGULY_CORE_BASE_URL}/agent/${agentId}/chat`;
    const body = { content };

    const response = await callLingulyCoreApi(method, url, body, userToken);
    return response;
}