# telegram-interface
Telegram Interface

## How to run Locally

1. Make a copy of `.env_template` and rename it to `.env`
1. Add the bot token and Linguly Core Base url you want to connect your interface to
1. `npm install`
1. `npm run build`
1. `npm start` or `npm run dev` to run in dev mode
1. Now you can start chatting with the bot you have added the bot token to the .env file

### Prepare Redis for local development

To install in ubuntu:
```bash
sudo apt-get update
sudo apt-get install redis-server
```

To run the redis server:
```bash
sudo service redis-server start
```

To test:
```bash
redis-cli ping
```

> [Reference](https://dev.to/fredabod/building-a-redis-powered-nodejs-application-a-step-by-step-guide-4jeb)


## Chat flow

To make the chat flow design easier we are using drawio.
To edit the [chatFlow.drawio](./chatFlow.drawio) file use the draw.io vscode extension or [the website](https://app.diagrams.net/).

Here is the current chat flow exported as svg:

![Chat flow](./chatFlow.svg)