import { reply } from './util/messenger';
import { Scenes } from 'telegraf';
import I18n from '../i18n/i18n';
import { setBetweenSceneCommands, LingulyContext } from './util/sceneCommon';

const i18n = new I18n('en');

const registerMainMenu = (bot: any, mainMenu: Scenes.BaseScene<LingulyContext>) => {
    /* Set scene enter commands */
    bot.command('main_menu', async (ctx: LingulyContext) => await ctx.scene.enter('mainMenu'));
    bot.hears('mainMenu', async (ctx: LingulyContext) => await ctx.scene.enter('mainMenu'));
    setBetweenSceneCommands(mainMenu);
    /* Special commands */
    mainMenu.enter(async (ctx: LingulyContext) => { await onEntrance(ctx) });
    mainMenu.command('help', async (ctx: LingulyContext) => { await reply(ctx, i18n.t('help_message')); });
    mainMenu.on('message', async (ctx: LingulyContext) => { await parser(ctx); });
}

const onEntrance = async (ctx: LingulyContext) => {
    await reply(ctx, i18n.t('select_an_option'), mainMenuOptions);
}

const parser = async (ctx: LingulyContext) => {
    if (!ctx.text) return;
    switch (ctx.text) {
        case i18n.t('buttons.available_agents'):
            await ctx.scene.enter('agents');
            break;
        case i18n.t('buttons.login'):
            await ctx.scene.enter('login');
            break;
        default:
            await reply(ctx, i18n.t('select_an_option'), mainMenuOptions);
            break
    }
}

const mainMenuOptions = {
    reply_markup: JSON.stringify({
        keyboard: [
            [{ text: i18n.t('buttons.available_agents') }],
            [{ text: i18n.t('buttons.login') }]
        ],
        one_time_keyboard: true
    })
};

export {
    registerMainMenu
};
