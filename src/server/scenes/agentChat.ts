import { reply } from './util/messenger';
import { Scenes } from 'telegraf';
import I18n from '../i18n/i18n';
import { chatWithAgent } from '../services/agents';
import { setBetweenSceneCommands, LingulyContext } from './util/sceneCommon';
import { getAgentId } from '../localDB/agent';

const i18n = new I18n('en');

const registerAgentChat = (bot: any, agentChat: Scenes.BaseScene<LingulyContext>) => {
    /* Set scene enter commands */
    bot.command('agent_chat', async (ctx: LingulyContext) => ctx.scene.enter('agentChat'));
    bot.hears('agentChat', async (ctx: LingulyContext) => ctx.scene.enter('agentChat'));
    setBetweenSceneCommands(agentChat);
    /* Special commands */
    agentChat.enter(async (ctx: LingulyContext) => { await onEntrance(ctx) });
    agentChat.command('help', async (ctx: LingulyContext) => { await reply(ctx, i18n.t('help_message')); });
    agentChat.on('message', async (ctx: LingulyContext) => { await parser(ctx); });
}

const onEntrance = async (ctx: LingulyContext) => {
    // Todo: We can later based on the Agent's chat type see if first need to call the Agent or wait for the user to start the chat
    await reply(ctx, i18n.t('chat_started'));
}

const parser = async (ctx: LingulyContext) => {
    if (!ctx.text) return;
    if (ctx.text === i18n.t('buttons.back')) {
        await ctx.scene.enter('mainMenu');
        return;
    }
    const agentId = await getAgentId(ctx);
    if (!agentId) {
        await reply(ctx, i18n.t('agents.error_no_agent_selected'));
        await ctx.scene.enter('agents');
        return;
    }
    try {
        const response = await chatWithAgent(ctx, agentId, ctx.text);
        if (response.success) {
            await reply(ctx, response.data.content);
        }
        else if (response.status === 401) {
            await reply(ctx, i18n.t('agents.error_unauthorized'));
            await ctx.scene.enter('login');
        }
        else {
            console.error('Error fetching agents:', response);
            await reply(ctx, i18n.t('agents.error_unknown'));
            await ctx.scene.enter('mainMenu');
        }
    } catch (error) {
        console.error('Error during chat with agent:', error);
        await reply(ctx, i18n.t('error_message'));
    }
}

export {
    registerAgentChat
};
