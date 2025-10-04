import * as fs from 'fs';
import * as path from 'path';
import logger from '../utils/logger';

class I18n {
    private translations: { [key: string]: string } = {};

    constructor(private locale: string) {
        this.loadTranslations();
    }

    private loadTranslations() {
        const filePath = path.join(__dirname, `${this.locale}.json`);
        if (fs.existsSync(filePath)) {
            const data = fs.readFileSync(filePath, 'utf8');
            this.translations = JSON.parse(data);
        } else {
            logger.error(`Translation file for locale ${this.locale} not found.`);
        }
    }

    private addParamsToText(text: string, params: any): string {
        if (!params || typeof params !== 'object') {
            return text;
        }

        return text.replace(/{{(.*?)}}/g, (match, key) => {
            const trimmedKey = key.trim();
            return params.hasOwnProperty(trimmedKey) ? params[trimmedKey] : match;
        });
    }

    public t(key: string, params?: any): string {
        const keys = key.split('.');
        let result: any = this.translations;

        for (const k of keys) {
            result = result[k];
            if (result === undefined) {
                return key;
            }
        }

        return this.addParamsToText(result, params);
    }
}

export default I18n;