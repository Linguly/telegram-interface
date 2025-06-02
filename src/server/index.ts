import { Telegraf, session, Scenes } from 'telegraf';
import { LingulyContext } from './scenes/util/sceneCommon';
import { registerStart } from "./scenes/start";
import { registerMainMenu } from "./scenes/mainMenu";
import { registerAgents } from "./scenes/agents";
import { registerAgentChat } from "./scenes/agentChat";
import { registerLogin } from "./scenes/login";

const BOT_TOKEN = process.env.BOT_TOKEN || '';
const bot = new Telegraf<LingulyContext>(BOT_TOKEN);

export default async () => {
    try {
        const start = new Scenes.BaseScene<LingulyContext>('start');
        const mainMenu = new Scenes.BaseScene<LingulyContext>('mainMenu');
        const agents = new Scenes.BaseScene<LingulyContext>('agents');
        const agentChat = new Scenes.BaseScene<LingulyContext>('agentChat');
        const login = new Scenes.BaseScene<LingulyContext>('login');

        const stage = new Scenes.Stage<LingulyContext>([start, mainMenu, agents, agentChat, login], { default: 'login' });

        bot.use(session());
        bot.use(stage.middleware());

        registerStart(bot, start);
        registerMainMenu(bot, mainMenu);
        registerAgents(bot, agents);
        registerAgentChat(bot, agentChat);
        registerLogin(bot, login);

        console.log(`Launching the bot! :)`);
        await bot.launch();
    } catch (err) {
        console.error(err);
        console.log(`Bot stopped! :|`);
    }
}