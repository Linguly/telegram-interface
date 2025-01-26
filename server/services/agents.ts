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