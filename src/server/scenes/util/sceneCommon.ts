import { Scenes, Context } from 'telegraf';
import { UserState } from '../../localDB/user';

export async function setBetweenSceneCommands(sceneName: Scenes.BaseScene<LingulyContext>) {
    sceneName.command('main_menu', (ctx: LingulyContext) => { ctx.scene.enter('mainMenu'); })
    sceneName.command('cancel', (ctx: LingulyContext) => { ctx.scene.enter('mainMenu'); })
}

interface LingulySession extends Scenes.SceneSession {
    // will be available under `ctx.session.selectedAgent`
    selectedAgent?: any;
    userState?: UserState;
    userEmail?: string;
    userName?: string;
}

export interface LingulyContext extends Context {
    session: LingulySession;
    scene: Scenes.SceneContextScene<LingulyContext>;
}


