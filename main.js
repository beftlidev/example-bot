require('dotenv').config();
const config = require('./config.js');
const { Client, IntentsBitField, Partials } = require("discord.js");
const bot = require('./starter/bot.js');
const { logError } = require('./src/functions/log.js');

const client = new Client({
    intents: Object.entries(IntentsBitField.Flags).filter(([K]) => ![...config.bot.disabledIntents].includes(K)).reduce((t, [, V]) => t | V, 0),
    partials: Object.values(Partials).filter(v => typeof v === 'number')
});

bot(client);

client.login(process.env.BOT_TOKEN).catch(() => {
    logError('[BOT_LOGIN] Failed to login, check the bot token.');
    process.exit(1);
});