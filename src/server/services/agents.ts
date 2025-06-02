import callLingulyCoreApi from './lingulyCore';

export async function getAgents() {
    const method = 'GET';
    const url = process.env.LINGULY_CORE_BASE_URL + '/agents';
    const body = null;

    const response = await callLingulyCoreApi(method, url, body);
    return response.data;
}
export async function chatWithAgent(agentId: string, content: string) {
    const method = 'POST';
    const url = `${process.env.LINGULY_CORE_BASE_URL}/agent/${agentId}/chat`;
    const body = { content };

    const response = await callLingulyCoreApi(method, url, body);
    return response.data.content;
}