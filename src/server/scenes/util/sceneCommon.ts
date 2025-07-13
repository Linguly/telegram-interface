import { Scenes, Context } from 'telegraf';
import { UserState } from '../../localDB/user';
import { reply } from './messenger';
import I18n from '../../i18n/i18n';

const i18n = new I18n('en');

export const removeKeyboard = {
    reply_markup: JSON.stringify({ remove_keyboard: true })
}

export async function setBetweenSceneCommands(sceneName: Scenes.BaseScene<LingulyContext>) {
    // main scenes
    sceneName.command('main_menu', async (ctx: LingulyContext) => { ctx.scene.enter('mainMenu'); })
    sceneName.command('start', async (ctx: LingulyContext) => { ctx.scene.enter('start'); })
    sceneName.command('login', async (ctx: LingulyContext) => { ctx.scene.enter('login'); })
    sceneName.command('agents', async (ctx: LingulyContext) => { ctx.scene.enter('agents'); })
    sceneName.command('goals', async (ctx: LingulyContext) => { ctx.scene.enter('goals'); })

    // general commands
    sceneName.command('cancel', async (ctx: LingulyContext) => { ctx.scene.enter('mainMenu'); })
    sceneName.command('help', async (ctx: LingulyContext) => { await reply(ctx, i18n.t('help_message')); });
}

export interface LingulySession extends Scenes.SceneSession {
    // e.g will be available under `ctx.session.selectedAgent`
    selectedAgent?: any;
    selectedGoal?: any;
    newGoal?: any;
    userState?: UserState;
    userEmail?: string;
    userName?: string;
    userToken?: string;
}

export interface LingulyContext extends Context {
    session: LingulySession;
    scene: Scenes.SceneContextScene<LingulyContext>;
}


