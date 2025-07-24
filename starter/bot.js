const { Collection } = require("discord.js");
const fs = require('fs');
const config = require('../config.js');

module.exports = async (client) => {

    client.commands = {
        contextMenu: new Collection(),
        prefix: new Collection(),
        aliases: new Collection(),
        slash: new Collection()
    };

    client.setMaxListeners(config.bot.maxListeners);

    const loaderFiles = fs.readdirSync('./starter/loader').filter(file => file.endsWith('.js'));
    loaderFiles.forEach(file => require(`./loader/${file}`)(client, false));

    const helperFiles = fs.readdirSync('./src/helpers').filter(file => file.endsWith('.js'));
    helperFiles.forEach(file => require(`../src/helpers/${file}`)(client, false));

};