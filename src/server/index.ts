import { Telegraf, session, Scenes } from 'telegraf';
import { Redis } from "@telegraf/session/redis";
import { LingulyContext, LingulySession } from './scenes/util/sceneCommon';
import { registerStart } from "./scenes/start";
import { registerMainMenu } from "./scenes/mainMenu";
import { registerAgents } from "./scenes/agents";
import { registerAgentChat } from "./scenes/agentChat";
import { registerLogin } from "./scenes/login";
import { registerSignup } from "./scenes/signup";

const BOT_TOKEN = process.env.BOT_TOKEN || '';
const bot = new Telegraf<LingulyContext>(BOT_TOKEN);

export default async () => {
    try {
        const start = new Scenes.BaseScene<LingulyContext>('start');
        const mainMenu = new Scenes.BaseScene<LingulyContext>('mainMenu');
        const agents = new Scenes.BaseScene<LingulyContext>('agents');
        const agentChat = new Scenes.BaseScene<LingulyContext>('agentChat');
        const login = new Scenes.BaseScene<LingulyContext>('login');
        const signup = new Scenes.BaseScene<LingulyContext>('signup');

        const stage = new Scenes.Stage<LingulyContext>([start, mainMenu, agents, agentChat, login, signup], { default: 'start' });

        const store = Redis<LingulySession>({
            url: process.env.REDIS_CONNECTION_URL,
            config: {
                password: process.env.REDIS_PASSWORD || '',
            }
        });
        bot.use(session({ store })); // Now session is using Redis for storage
        bot.use(stage.middleware());

        registerStart(bot, start);
        registerMainMenu(bot, mainMenu);
        registerAgents(bot, agents);
        registerAgentChat(bot, agentChat);
        registerLogin(bot, login);
        registerSignup(bot, signup);

        console.log(`Launching the bot...`);
        await bot.launch(() => {
            console.log(`🤖 Bot is up and running! :)`);
        });

    } catch (err) {
        console.error(err);
        console.log(`Bot stopped! :|`);
    }
}