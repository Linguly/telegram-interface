import { Telegraf, session, Scenes } from 'telegraf';
import { registerStart } from "./scenes/start"
import { registerAgents } from "./scenes/agents"
import { registerMainMenu } from "./scenes/mainMenu"

const BOT_TOKEN = process.env.BOT_TOKEN || '';
const bot = new Telegraf<Scenes.SceneContext>(BOT_TOKEN);

export default async () => {
    try {
        const start = new Scenes.BaseScene<Scenes.SceneContext>('start');
        const mainMenu = new Scenes.BaseScene<Scenes.SceneContext>('mainMenu');
        const agents = new Scenes.BaseScene<Scenes.SceneContext>('agents');
        //const agentChat = new Scenes.BaseScene<Scenes.SceneContext>('agentChat');
        //const login = new Scenes.BaseScene<Scenes.SceneContext>('login');

        const stage = new Scenes.Stage<Scenes.SceneContext>([start, agents, mainMenu], { default: 'start' });

        bot.use(session());
        bot.use(stage.middleware());

        registerStart(bot, start);
        registerAgents(bot, agents);
        registerMainMenu(bot, mainMenu);

        console.log(`Launching the bot! :)`);
        await bot.launch();
        console.log(`Bot stopped! :|`);
    } catch (err) {
        console.error(err);
    }
}