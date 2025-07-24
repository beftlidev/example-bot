const Discord = require("discord.js");
const config = require("../../../config");
const { logError } = require("../../functions/log");
const { checkBlacklist, checkPermissions, checkMaintenance } = require("../../functions/command");
const { embedError } = require("../../functions/embed");

module.exports = {
    name: "messageCreate",
    async run(client, message) {

        if (message.author.bot) return;
        if (!message.content.startsWith(config.bot.prefix)) return;

        const command = message.content.toLocaleLowerCase().split(" ")[0].slice(config.bot.prefix.length);

        if (!command) return;

        if (!message.guild) {
            return message.reply({
                embeds: [
                    await embedError({
                        description: "Commands can only be used in servers, not in direct messages."
                    })
                ]
            }).catch(() => { });
        };

        const blacklistCheck = await checkBlacklist(message);
        if (blacklistCheck) {
            return message.author.send({
                embeds: blacklistCheck.embed,
                components: blacklistCheck.button
            }).catch(() => { });
        };

        const permissionCheck = await checkPermissions(message, command);
        if (permissionCheck) {
            return message.reply({
                embeds: permissionCheck.embed
            }).catch(() => { });
        };

        const maintenanceCheck = await checkMaintenance(command);
        if (maintenanceCheck) {
            return message.reply({
                embeds: maintenanceCheck.embed,
                components: maintenanceCheck.button
            }).catch(() => { });
        };

        try {
            let cmd;
            let params = message.content.split(" ").slice(1);
            if (client.commands.prefix.has(command)) {
                cmd = client.commands.prefix.get(command);
            } else if (client.commands.aliases.has(command)) {
                cmd = client.commands.aliases.get(command);
            }
            if (cmd) {
                cmd.run(client, message, params);
            }
        } catch (e) {
            logError("[PREFIX] Error executing command:", e);
        }

    }
}