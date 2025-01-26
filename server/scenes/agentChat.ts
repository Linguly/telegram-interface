import { reply } from './util/messenger';
import { Scenes } from 'telegraf';
import I18n from '../i18n/i18n';
import { chatWithAgent } from '../services/agents';
import { setBetweenSceneCommands } from './util/sceneCommon';

const i18n = new I18n('en');

const registerAgentChat = (bot: any, agentChat: Scenes.BaseScene<Scenes.SceneContext>) => {
    /* Set scene enter commands */
    bot.command('agent_chat', (ctx: Scenes.SceneContext) => ctx.scene.enter('agentChat'));
    bot.hears('agentChat', (ctx: Scenes.SceneContext) => ctx.scene.enter('agentChat'));
    setBetweenSceneCommands(agentChat);
    /* Special commands */
    agentChat.enter((ctx: Scenes.SceneContext) => { onEntrance(ctx) });
    agentChat.command('help', (ctx: Scenes.SceneContext) => { reply(ctx, i18n.t('help_message')); });
    agentChat.on('message', (ctx: Scenes.SceneContext) => { parser(ctx); });
}

const onEntrance = async (ctx: Scenes.SceneContext) => {
    // Todo: We can later based on the Agent's chat type see if first need to call the Agent or wait for the user to start the chat
    reply(ctx, i18n.t('chat_started'));
}

const parser = async (ctx: Scenes.SceneContext) => {
    if (!ctx.text) return;
    if (ctx.text === i18n.t('buttons.back')) {
        ctx.scene.enter('mainMenu');
        return;
    }

    //const agentId = ctx.session.selectedAgent.id;
    const agentId = "1_dictionary";
    try {
        const response = await chatWithAgent(agentId, ctx.text);
        reply(ctx, response);
    } catch (error) {
        console.error('Error during chat with agent:', error);
        reply(ctx, i18n.t('error_message'));
    }
}

export {
    registerAgentChat
};
