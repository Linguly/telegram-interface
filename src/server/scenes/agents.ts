import { reply } from './util/messenger';
import { Scenes } from 'telegraf';
import I18n from '../i18n/i18n';
import { getAgents } from '../services/agents';
import { getSelectedGoal } from '../services/goals';
import { setBetweenSceneCommands, LingulyContext } from './util/sceneCommon';
import { setSelectedAgent, setSelectedGoal } from '../localDB/agent';

const i18n = new I18n('en');
let availableAgents: any[] = [];

const registerAgents = (bot: any, agents: Scenes.BaseScene<LingulyContext>) => {
    /* Set scene enter commands */
    bot.command('agents', async (ctx: LingulyContext) => await ctx.scene.enter('agents'));
    bot.hears('agents', async (ctx: LingulyContext) => await ctx.scene.enter('agents'));
    setBetweenSceneCommands(agents);
    /* Special commands */
    agents.enter(async (ctx: LingulyContext) => { await onEntrance(ctx) });
    agents.command('help', async (ctx: LingulyContext) => { await reply(ctx, i18n.t('help_message')); });
    agents.on('message', async (ctx: LingulyContext) => { await parser(ctx); });
}

const onEntrance = async (ctx: LingulyContext) => {
    await replyWithAvailableAgents(ctx);
}

const parser = async (ctx: LingulyContext) => {
    if (!ctx.text) return;
    // Check if the user selected an agent
    const agent = availableAgents.find((agent: any) => agent.display_name === ctx.text);
    if (agent) {
        await setSelectedAgent(ctx, agent);
        await ctx.scene.enter('agentChat');
        return;
    }

    switch (ctx.text) {
        case i18n.t('buttons.back'):
            await ctx.scene.enter('mainMenu');
            break;
        default:
            await replyWithAvailableAgents(ctx);
            break
    }
}

const replyWithAvailableAgents = async (ctx: LingulyContext) => {
    const selectedGoal = await checkAndUpdateSelectedGoal(ctx);
    if (selectedGoal) {
        // Call to get available agents from Linguly Core
        const response = await getAgents(ctx);
        if (response.success) {
            availableAgents = response.data;
            if (availableAgents.length > 0) {
                await reply(ctx, i18n.t('agents.select_an_option', selectedGoal), getAgentOptions(availableAgents));
            }
            else {
                await reply(ctx, i18n.t('agents.no_available_agent', selectedGoal), getAgentOptions(availableAgents));
            }
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
    }
}

const checkAndUpdateSelectedGoal = async (ctx: LingulyContext) => {
    // Check if the user has a selected goal calling the API
    const response = await getSelectedGoal(ctx);
    if (response.success) {
        const selectedGoal = response.data;
        await setSelectedGoal(ctx, selectedGoal);
        return selectedGoal;
    }
    else if (response.status === 401) {
        await reply(ctx, i18n.t('agents.error_unauthorized'));
        await ctx.scene.enter('login');
        return null;
    }
    else if (response.status === 404) {
        await reply(ctx, i18n.t('agents.error_no_goal_selected'));
        await ctx.scene.enter('goals');
        return null;
    }
    else {
        console.error('Error fetching selected goal:', response);
        await reply(ctx, i18n.t('agents.error_unknown'));
        await ctx.scene.enter('mainMenu');
        return null;
    }
}

const getAgentOptions = (availableAgents: any[]) => {

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
