import { reply } from './util/messenger';
import { Scenes } from 'telegraf';
import I18n from '../i18n/i18n';
import { LingulyContext } from './util/sceneCommon';

const i18n = new I18n('en');

const registerStart = (bot: any, start: Scenes.BaseScene<LingulyContext>) => {
    /* Set scene enter commands */
    bot.command('start', async (ctx: LingulyContext) => await ctx.scene.enter('start'));
    bot.hears('start', async (ctx: LingulyContext) => await ctx.scene.enter('start'));
    /* Special commands */
    start.enter(async (ctx: LingulyContext) => { await onEntrance(ctx) });
    start.on('message', async (ctx: LingulyContext) => { await parser(ctx); });
}

const onEntrance = async (ctx: LingulyContext) => {
    await reply(ctx, i18n.t('welcome_message'), greetingOptions, 0);
}

const parser = async (ctx: LingulyContext) => {
    if (!ctx.text) return;
    switch (ctx.text) {
        case i18n.t('buttons.login'):
            await ctx.scene.enter('login');
            break;
        default:
            await reply(ctx, i18n.t('select_an_option'), greetingOptions);
            break
    }
}

const greetingOptions = {
    reply_markup: JSON.stringify({
        keyboard: [
            [{ text: i18n.t('buttons.login') }],
            [{ text: i18n.t('buttons.back') }]
        ],
        one_time_keyboard: true
    })
};

export {
    registerStart
};
