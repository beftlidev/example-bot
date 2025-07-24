const Discord = require("discord.js");
const { logError } = require("../../functions/log.js");
const { embedError } = require("../../functions/embed.js");
const config = require("../../../config.js");
const { checkBlacklist, checkPermissions, checkMaintenance } = require("../../functions/command.js");

module.exports = {
  name: "interactionCreate",
  run: async (client, interaction) => {

    if (!interaction.isChatInputCommand()) return;

    const command = client.commands.slash.get(interaction.commandName)

    if (!command) return;

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

    interaction.selectedValue = (interaction.options._hoistedOptions[0]) ? interaction.options._hoistedOptions[0].value : undefined

    try {
      await command.run(client, interaction)
    } catch (e) {
      logError("[SLASH] Error executing command:", e);
    }

  }
}