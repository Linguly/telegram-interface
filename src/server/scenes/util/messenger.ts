import { Context } from 'telegraf';

const reply = async (ctx: Context, message: string, options?: any) => {
    if (options === undefined)
        options = {};
    options.parse_mode = 'Markdown';

    /* pretend the bot is typing */
    await ctx.sendChatAction('typing');
    /* delay between replies */
    await new Promise(resolve => setTimeout(resolve, 600));
    /* send the message */
    await ctx.reply(message, options);
}

export { reply };
