const { REST } = require("@discordjs/rest");
const { Routes } = require("discord-api-types/v9");
const { logSuccess, logError, logInfo } = require('../../functions/log');

module.exports = {
    name: 'ready',
    async run(client) {
        try {
            const slashCommands = Array.from(client.commands.slash.values());
            const contextMenuCommands = Array.from(client.commands.contextMenu.values());
            const allCommands = [...slashCommands, ...contextMenuCommands].map(command => command.data);
            
            if (allCommands.length === 0) return;

            const rest = new REST({
                version: "10"
            }).setToken(process.env.BOT_TOKEN);

            await rest.put(
                Routes.applicationCommands(client.user.id),
                { body: allCommands }
            );
        } catch (error) {
            logError('[LOAD_COMMANDS] Error registering application commands:', error);
        }
    }
};