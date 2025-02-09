import dotenv from 'dotenv';
dotenv.config();

import botServer from './server/index';
botServer(); /* start the bot */


//import './server/logic/redisUpdaterServer/index'; /* start the redis DB */

console.log(`Expecting Linguly Core API to be running at ${process.env.LINGULY_CORE_BASE_URL}`);