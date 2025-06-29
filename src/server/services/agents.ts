import callLingulyCoreApi from './lingulyCore';
import { getUserToken } from '../localDB/user';
import { LingulyContext } from '../scenes/util/sceneCommon';

export async function getAgents(ctx: LingulyContext) {
    var userToken = await getUserToken(ctx);
    if (!userToken) {
        return { success: false, message: 'User not authenticated', status: 401 };
    }
    const method = 'GET';
    const url = process.env.LINGULY_CORE_BASE_URL + '/agents/filter?compatible_interfaces=telegram';
    const body = null;

    const response = await callLingulyCoreApi(method, url, body, userToken);
    return response;
}

export async function getAgentsFiltered(ctx: LingulyContext, categories: string[], subcategories: string[]) {
    let filterQuery = '';
    if (categories && categories.length > 0) {
        filterQuery += categories.map(cat => `&categories=${encodeURIComponent(cat)}`).join('');
    }
    if (subcategories && subcategories.length > 0) {
        filterQuery += subcategories.map(subcat => `&subcategories=${encodeURIComponent(subcat)}`).join('');
    }

    var userToken = await getUserToken(ctx);
    if (!userToken) {
        return { success: false, message: 'User not authenticated', status: 401 };
    }
    const method = 'GET';
    const url = process.env.LINGULY_CORE_BASE_URL + '/agents/filter?compatible_interfaces=telegram' + filterQuery;

    const response = await callLingulyCoreApi(method, url, null, userToken);
    return response;
}

export async function startTheAgent(ctx: LingulyContext, agentId: string) {
    var userToken = await getUserToken(ctx);
    if (!userToken) {
        return { success: false, message: 'User not authenticated', status: 401 };
    }
    const method = 'POST';
    const url = `${process.env.LINGULY_CORE_BASE_URL}/agents/${agentId}/start`;

    const response = await callLingulyCoreApi(method, url, {}, userToken);
    return response;
}

export async function chatWithAgent(ctx: LingulyContext, agentId: string, content: string) {
    var userToken = await getUserToken(ctx);
    if (!userToken) {
        return { success: false, message: 'User not authenticated', status: 401 };
    }
    const method = 'POST';
    const url = `${process.env.LINGULY_CORE_BASE_URL}/agents/${agentId}/chat`;
    const body = [{ content, role: 'user' }];

    const response = await callLingulyCoreApi(method, url, body, userToken);
    return response;
}