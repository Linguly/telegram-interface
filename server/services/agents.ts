import callLingulyCoreApi from './lingulyCore';

export async function getAgents() {
    const method = 'GET';
    const url = process.env.LINGULY_CORE_BASE_URL + '/agents';
    const body = null;

    try {
        const agents = await callLingulyCoreApi(method, url, body);
        return agents;
    } catch (error) {
        console.error('Error fetching agents:', error);
        throw error;
    }
}
export async function chatWithAgent(agentId: string, content: string) {
    const method = 'POST';
    const url = `${process.env.LINGULY_CORE_BASE_URL}/agent/${agentId}/chat`;
    const body = { content };

    try {
        const response = await callLingulyCoreApi(method, url, body);
        return response.content;
    } catch (error) {
        console.error('Error chatting with agent:', error);
        throw error;
    }
}