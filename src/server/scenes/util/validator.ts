import { z } from "zod";
import { LingulyContext } from './sceneCommon';
import { reply } from './messenger';
import I18n from '../../i18n/i18n';

const i18n = new I18n('en');

const nameSchema = z.string().min(2, i18n.t('validator.invalid_name'));
const emailSchema = z.string().email(i18n.t('validator.invalid_email'));
const passwordSchema = z.string().min(9, i18n.t('validator.invalid_password'));


export async function validate(ctx: LingulyContext, inputType: string, input: any) {
    var result = undefined;
    switch (inputType) {
        case 'name': result = nameSchema.safeParse(input); break;
        case 'email': result = emailSchema.safeParse(input); break;
        case 'password': result = passwordSchema.safeParse(input); break;
        default:
            console.error(`Invalid inputType for validation: ${inputType}`);
            return false;
    }
    if (!result.success) {
        console.error(result.error.errors[0].message);
        await reply(ctx, result.error.errors[0].message);
        return false;
    } else {
        return true
    }

}