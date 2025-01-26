import { Telegraf, session, Scenes } from 'telegraf';
import { registerStart } from "./scenes/start"
import { registerMainMenu } from "./scenes/mainMenu"
import { registerAgents } from "./scenes/agents"
import { registerAgentChat } from "./scenes/agentChat"

const BOT_TOKEN = process.env.BOT_TOKEN || '';
const bot = new Telegraf<Scenes.SceneContext>(BOT_TOKEN);

export default async () => {
    try {
        const start = new Scenes.BaseScene<Scenes.SceneContext>('start');
        const mainMenu = new Scenes.BaseScene<Scenes.SceneContext>('mainMenu');
        const agents = new Scenes.BaseScene<Scenes.SceneContext>('agents');
        const agentChat = new Scenes.BaseScene<Scenes.SceneContext>('agentChat');
        //const login = new Scenes.BaseScene<Scenes.SceneContext>('login');

        const stage = new Scenes.Stage<Scenes.SceneContext>([start, mainMenu, agents, agentChat], { default: 'start' });

        bot.use(session());
        bot.use(stage.middleware());

        registerStart(bot, start);
        registerMainMenu(bot, mainMenu);
        registerAgents(bot, agents);
        registerAgentChat(bot, agentChat);

        console.log(`Launching the bot! :)`);
        await bot.launch();
        console.log(`Bot stopped! :|`);
    } catch (err) {
        console.error(err);
    }
}