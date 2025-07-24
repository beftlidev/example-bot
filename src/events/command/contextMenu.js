const Discord = require("discord.js");
const { logError } = require("../../functions/log");
const { checkBlacklist, checkPermissions, checkMaintenance } = require("../../functions/command");

module.exports = {
  name: "interactionCreate",
  run: async (client, interaction) => {

    if (!interaction.isMessageContextMenuCommand() && !interaction.isUserContextMenuCommand()) return;

    const command = client.commands.contextMenu.get(interaction.commandName)
    if (!command) return

    if (!interaction.guild) {
      return interaction.reply({
        embeds: [
          await embedError({
            description: "Commands can only be used in servers, not in direct messages."
          })
        ],
        flags: [Discord.MessageFlags.Ephemeral]
      }).catch(() => { });
    };

    const blacklistCheck = await checkBlacklist(interaction);
    if (blacklistCheck) {
      return interaction.reply({
        embeds: blacklistCheck.embed,
        components: blacklistCheck.button,
        flags: [Discord.MessageFlags.Ephemeral]
      }).catch(() => { });
    };

    const permissionCheck = await checkPermissions(interaction, command);
    if (permissionCheck) {
      return interaction.reply({
        embeds: permissionCheck.embed,
        flags: [Discord.MessageFlags.Ephemeral]
      }).catch(() => { });
    };

    const maintenanceCheck = await checkMaintenance(command);
    if (maintenanceCheck) {
      return interaction.reply({
        embeds: maintenanceCheck.embed,
        components: maintenanceCheck.button,
        flags: [Discord.MessageFlags.Ephemeral]
      }).catch(() => { });
    };

    try {
      await command.run(client, interaction)
    } catch (e) {
      logError("[CONTEXT_MENU] Error executing command:", e)
    }

  }
}