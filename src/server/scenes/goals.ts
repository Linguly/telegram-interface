import { reply } from './util/messenger';
import { Scenes } from 'telegraf';
import I18n from '../i18n/i18n';
import { getGoals, selectGoal, createGoal } from '../services/goals';
import { setBetweenSceneCommands, LingulyContext } from './util/sceneCommon';
import { setSelectedGoal } from '../localDB/agent';
import { setUserState, getUserState } from '../localDB/user';

const i18n = new I18n('en');
let availableGoals: any[] = [];

const registerGoals = (bot: any, goals: Scenes.BaseScene<LingulyContext>) => {
    /* Set scene enter commands */
    bot.command('goals', async (ctx: LingulyContext) => await ctx.scene.enter('goals'));
    bot.hears('goals', async (ctx: LingulyContext) => await ctx.scene.enter('goals'));
    setBetweenSceneCommands(goals);
    /* Special commands */
    goals.enter(async (ctx: LingulyContext) => { await onEntrance(ctx) });
    goals.on('message', async (ctx: LingulyContext) => { await parser(ctx); });
}

const onEntrance = async (ctx: LingulyContext) => {
    await setUserState(ctx, 'create_or_select_goal');
    await reply(ctx, i18n.t('goals.entrance_message'), greetingOptions, 0);
}

const parser = async (ctx: LingulyContext) => {
    if (!ctx.text) return;
    const userState = await getUserState(ctx);
    switch (ctx.text) {
        case i18n.t('goals.create_a_goal'):
            await setUserState(ctx, 'create_a_goal');
            await reply(ctx, i18n.t('goals.enter_language'), getLanguageOptions());
            ctx.session.newGoal = {}; // Initialize new goal object
            break;
        case i18n.t('goals.select_a_goal'):
            await setUserState(ctx, 'select_a_goal');
            await replyWithAvailableGoals(ctx);
            break;
        case i18n.t('buttons.back'):
            await ctx.scene.enter('mainMenu');
            break;
        default:
            switch (userState) {
                case 'select_a_goal':
                    // Check if the user selected a goal
                    const selectedGoal = availableGoals.find((goal: any) => getGoalDisplayName(goal) === ctx.text);
                    if (selectedGoal) {
                        await selectGoal(ctx, selectedGoal.id);
                        await setSelectedGoal(ctx, selectedGoal);
                        await reply(ctx, i18n.t('goals.goal_selected_successfully'));
                        await ctx.scene.enter('mainMenu');
                        return;
                    }
                    await replyWithAvailableGoals(ctx);
                    break;
                case 'create_a_goal':
                    await setUserState(ctx, 'enter_level');
                    ctx.session.newGoal.language = ctx.text;
                    await reply(ctx, i18n.t('goals.enter_level'), getLevelOptions());
                    break;
                case 'enter_level':
                    await setUserState(ctx, 'enter_context');
                    ctx.session.newGoal.level = ctx.text;
                    await reply(ctx, i18n.t('goals.enter_context'), getContextOptions());
                    break;
                case 'enter_context':
                    await setUserState(ctx, 'enter_period');
                    ctx.session.newGoal.context = ctx.text;
                    await reply(ctx, i18n.t('goals.enter_period'), getPeriodOptions());
                    break;
                case 'enter_period':
                    ctx.session.newGoal.period = ctx.text;
                    await createTheGoal(ctx);
                    break;
                default:
                    await ctx.scene.enter('login');
                    break;
            }
    }
}

const createTheGoal = async (ctx: LingulyContext) => {
    const language = await ctx.session.newGoal.language || '';
    const level = await ctx.session.newGoal.level || '';
    const context = await ctx.session.newGoal.context || '';
    const period = await ctx.session.newGoal.period || '';
    const response = await createGoal(ctx, language, level, context, period);
    if (response.success) {
        await reply(ctx, i18n.t('goals.goal_created_successfully'));
        await setUserState(ctx, 'select_a_goal');
        await replyWithAvailableGoals(ctx);
    }
    else if (response.status === 401) {
        await reply(ctx, i18n.t('goals.error_unauthorized'));
        await ctx.scene.enter('login');
    }
    else {
        console.error('Error creating goal:', response);
        await reply(ctx, i18n.t('goals.error_unknown'));
        await ctx.scene.enter('mainMenu');
    }
}

const replyWithAvailableGoals = async (ctx: LingulyContext) => {
    // Call to get available goals from Linguly Core
    const response = await getGoals(ctx);
    if (response.success) {
        availableGoals = response.data;
        if (availableGoals.length === 0) {
            await reply(ctx, i18n.t('goals.no_goals_available_create_one'));
            await setUserState(ctx, 'create_a_goal');
            await reply(ctx, i18n.t('goals.enter_language'), getLanguageOptions());
            ctx.session.newGoal = {}; // Initialize new goal object
            return;
        }
        await reply(ctx, i18n.t('goals.select_an_option'), getGoalOptions(availableGoals));
    }
    else if (response.status === 401) {
        await reply(ctx, i18n.t('goals.error_unauthorized'));
        await ctx.scene.enter('login');
    }
    else {
        console.error('Error fetching goals:', response);
        await reply(ctx, i18n.t('goals.error_unknown'));
        await ctx.scene.enter('mainMenu');
    }
}

const getGoalDisplayName = (goal: any) => {
    // Construct a display name for the goal based on its attributes
    return `${goal.language}, ${goal.level}, ${goal.context}, ${goal.period}`;
}

const getGoalOptions = (availableGoals: any[]) => {
    // get the keyboard option list based on the attributes of availableGoals
    let keyboardOptions = availableGoals.map((goal: any) => {
        return [{ text: getGoalDisplayName(goal) }];
    });

    keyboardOptions.push([{ text: i18n.t('buttons.back') }]);

    return {
        reply_markup: JSON.stringify({
            keyboard: keyboardOptions,
            one_time_keyboard: true
        })
    };
};

const greetingOptions = {
    reply_markup: JSON.stringify({
        keyboard: [
            [{ text: i18n.t('goals.create_a_goal') }],
            [{ text: i18n.t('goals.select_a_goal') }],
            [{ text: i18n.t('buttons.back') }]
        ],
        one_time_keyboard: true
    })
};

const getLanguageOptions = () => {
    // This function returns the language options for the goal creation
    return {
        reply_markup: JSON.stringify({
            keyboard: languageOptions,
            one_time_keyboard: true
        })
    };
};

const getContextOptions = () => {
    // This function returns the context options for the goal creation
    return {
        reply_markup: JSON.stringify({
            keyboard: contextOptions,
            one_time_keyboard: true
        })
    };
};

const getLevelOptions = () => {
    // This function returns the level options for the goal creation
    return {
        reply_markup: JSON.stringify({
            keyboard: levelOptions,
            one_time_keyboard: true
        })
    };
};

const getPeriodOptions = () => {
    // This function returns the period options for the goal creation
    return {
        reply_markup: JSON.stringify({
            keyboard: periodOptions,
            one_time_keyboard: true
        })
    };
};

// Todo: need to be fetched from Linguly Core
const languageOptions = [
    [{ text: 'English' }, { text: 'German' }],
    [{ text: 'French' }, { text: 'Italian' }],
    [{ text: 'Hindi' }, { text: 'Portuguese' }],
    [{ text: 'Spanish' }, { text: 'Thai' }]
];

// Todo: need to be fetched from Linguly Core
const levelOptions = [
    [{ text: 'A1' }, { text: 'A2' }],
    [{ text: 'B1' }, { text: 'B2' }],
    [{ text: 'C1' }, { text: 'C2' }]
];

// Todo: need to be fetched from Linguly Core
const contextOptions = [
    [{ text: 'General' }],
    [{ text: 'Business' }],
    [{ text: 'Academic' }]
];

// Todo: need to be fetched from Linguly Core
const periodOptions = [
    [{ text: 'days' }],
    [{ text: 'weeks' }],
    [{ text: 'months' }],
    [{ text: 'years' }]
];

export {
    registerGoals
};
