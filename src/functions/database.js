const JsonDatabase = require('./json');

const Bot = new JsonDatabase({
    databasePath: './src/databases/bot.json'
});

const Cooldown = new JsonDatabase({
    databasePath: './src/databases/cooldown.json'
});

module.exports = {
    Database: {
        bot: Bot,
        cooldown: Cooldown
    }
};