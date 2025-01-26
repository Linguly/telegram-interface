import { Scenes, Context } from 'telegraf';

export async function setBetweenSceneCommands(sceneName: Scenes.BaseScene<LingulyContext>) {
    sceneName.command('main_menu', (ctx: LingulyContext) => { ctx.scene.enter('mainMenu'); })
    sceneName.command('cancel', (ctx: LingulyContext) => { ctx.scene.enter('mainMenu'); })
}

interface LingulySession extends Scenes.SceneSession {
    // will be available under `ctx.session.selectedAgent`
    selectedAgent?: any;
}

export interface LingulyContext1 extends Context {
    session: LingulySession;
    scene: Scenes.SceneContextScene<LingulyContext>;
}