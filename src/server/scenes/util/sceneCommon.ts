import { Scenes, Context } from 'telegraf';
import { UserState } from '../../localDB/user';


export const removeKeyboard = {
    reply_markup: JSON.stringify({ remove_keyboard: true })
}

export async function setBetweenSceneCommands(sceneName: Scenes.BaseScene<LingulyContext>) {
    // main scenes
    sceneName.command('main_menu', (ctx: LingulyContext) => { ctx.scene.enter('mainMenu'); })
    sceneName.command('start', (ctx: LingulyContext) => { ctx.scene.enter('start'); })
    sceneName.command('login', (ctx: LingulyContext) => { ctx.scene.enter('login'); })

    // general commands
    sceneName.command('cancel', (ctx: LingulyContext) => { ctx.scene.enter('mainMenu'); })
}

export interface LingulySession extends Scenes.SceneSession {
    // e.g will be available under `ctx.session.selectedAgent`
    selectedAgent?: any;
    userState?: UserState;
    userEmail?: string;
    userName?: string;
    userToken?: string;
}

export interface LingulyContext extends Context {
    session: LingulySession;
    scene: Scenes.SceneContextScene<LingulyContext>;
}


