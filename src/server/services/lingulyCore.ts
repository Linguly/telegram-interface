import axios, { Method } from 'axios';
import logger from '../utils/logger';

async function callLingulyCoreApi(method: Method, url: string, body: any, token: string = ''): Promise<any> {
    var headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }
    try {
        const response = await axios({
            method: method,
            url: url,
            data: body,
            headers: headers
        });
        return { success: true, data: response.data, status: response.status };
    } catch (error) {
        logger.error(error, 'Error calling Linguly Core API:');
        if (axios.isAxiosError(error) && error.response) {
            return {
                success: false,
                detail: error.response.data?.detail,
                error: 'An error occurred while calling the Linguly Core API.',
                status: error.response.status
            };
        }
        return {
            success: false,
            error: 'An error occurred while calling the Linguly Core API.'
        };
    }
}

export default callLingulyCoreApi;