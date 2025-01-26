import { Scenes } from 'telegraf';
import { SceneSessionData } from 'telegraf/typings/scenes';

export async function setBetweenSceneCommands(sceneName: Scenes.BaseScene<Scenes.SceneContext>) {
    sceneName.command('main_menu', (ctx) => { ctx.scene.enter('mainMenu'); })
    sceneName.command('cancel', (ctx) => { ctx.scene.enter('mainMenu'); })
}

export interface LingulySceneSession extends SceneSessionData {
    selectedAgent?: any;
}
