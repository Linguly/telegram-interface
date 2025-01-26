import { reply } from './util/messenger';
import { Scenes } from 'telegraf';
import I18n from '../i18n/i18n';
import { getAgents } from '../services/agents';
import { setBetweenSceneCommands, LingulyContext } from './util/sceneCommon';

const i18n = new I18n('en');
let availableAgents: any[];

const registerAgents = (bot: any, agents: Scenes.BaseScene<LingulyContext>) => {
    /* Set scene enter commands */
    bot.command('agents', (ctx: LingulyContext) => ctx.scene.enter('agents'));
    bot.hears('agents', (ctx: LingulyContext) => ctx.scene.enter('agents'));
    setBetweenSceneCommands(agents);
    /* Special commands */
    agents.enter((ctx: LingulyContext) => { onEntrance(ctx) });
    agents.command('help', (ctx: LingulyContext) => { reply(ctx, i18n.t('help_message')); });
    agents.on('message', (ctx: LingulyContext) => { parser(ctx); });
}

const onEntrance = async (ctx: LingulyContext) => {

    reply(ctx, i18n.t('welcome_message'), await getAgentOptions());
}

const parser = async (ctx: LingulyContext) => {
    if (!ctx.text) return;
    // Check if the user selected an agent
    const agent = availableAgents.find((agent: any) => agent.display_name === ctx.text);
    if (agent) {
        ctx.session.selectedAgent = agent;
        ctx.scene.enter('agentChat');
        return;
    }

    switch (ctx.text) {
        case i18n.t('buttons.back'):
            ctx.scene.enter('mainMenu');
            break;
        default:
            reply(ctx, i18n.t('select_an_option'), await getAgentOptions());
            break
    }
}

const getAgentOptions = async () => {
    // Call to get available agents from Linguly Core
    availableAgents = await getAgents();
    // get the keyboard option list based on display_name in availableAgents
    let keyboardOptions = availableAgents.map((agent: any) => {
        return [{ text: agent.display_name }];
    });

    keyboardOptions.push([{ text: i18n.t('buttons.back') }]);

    return {
        reply_markup: JSON.stringify({
            keyboard: keyboardOptions,
            one_time_keyboard: true
        })
    };
};

export {
    registerAgents
};
