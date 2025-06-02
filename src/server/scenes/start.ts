import { reply } from './util/messenger';
import { Scenes } from 'telegraf';
import I18n from '../i18n/i18n';
import { LingulyContext } from './util/sceneCommon';

const i18n = new I18n('en');

const registerStart = (bot: any, start: Scenes.BaseScene<LingulyContext>) => {
    /* Set scene enter commands */
    bot.command('start', (ctx: LingulyContext) => ctx.scene.enter('start'));
    bot.hears('start', (ctx: LingulyContext) => ctx.scene.enter('start'));
    /* Special commands */
    start.enter((ctx: LingulyContext) => { onEntrance(ctx) });
    start.command('help', (ctx: LingulyContext) => { reply(ctx, i18n.t('help_message')); });
    start.on('message', (ctx: LingulyContext) => { parser(ctx); });
}

const onEntrance = async (ctx: LingulyContext) => {
    reply(ctx, i18n.t('welcome_message'), greetingOptions);
}

const parser = async (ctx: LingulyContext) => {
    if (!ctx.text) return;
    switch (ctx.text) {
        case i18n.t('buttons.available_agents'):
            ctx.scene.enter('agents');
            break;
        case i18n.t('buttons.back'):
            ctx.scene.enter('mainMenu');
            break;
        default:
            reply(ctx, i18n.t('select_an_option'), greetingOptions);
            break
    }
}

const greetingOptions = {
    reply_markup: JSON.stringify({
        keyboard: [
            [{ text: i18n.t('buttons.available_agents') }],
            [{ text: i18n.t('buttons.back') }]
        ],
        one_time_keyboard: true
    })
};

export {
    registerStart
};
