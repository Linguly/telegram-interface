import axios, { Method } from 'axios';

async function callLingulyCoreApi(method: Method, url: string, body: any) {
    try {
        const response = await axios({
            method: method,
            url: url,
            data: body,
            headers: {
                'Content-Type': 'application/json'
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error calling Linguly Core API:', error);
        throw error;
    }
}

export default callLingulyCoreApi;