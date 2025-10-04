import dotenv from 'dotenv';
import logger from './server/utils/logger';

dotenv.config();

import botServer from './server/index';
botServer(); /* start the bot */

logger.info(`Expecting Linguly Core API to be running at ${process.env.LINGULY_CORE_BASE_URL}`);