import * as fs from 'fs';
import * as path from 'path';

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
            console.error(`Translation file for locale ${this.locale} not found.`);
        }
    }

    public t(key: string): string {
        const keys = key.split('.');
        let result: any = this.translations;

        for (const k of keys) {
            result = result[k];
            if (result === undefined) {
                return key;
            }
        }

        return result;
    }
}

export default I18n;