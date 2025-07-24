const Discord = require("discord.js");
const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
const config = require("../../../config");
const emoji = require("../../functions/emoji");

module.exports = {
    name: "messageCreate",
    async run(client, message) {

        if (message.content == config.bot.callMessage) {
            if (!config.bot.owners.includes(message.author.id)) return;
            const embed = new EmbedBuilder()
                .setAuthor({
                    name: `Welcome to the Developer Dashboard, ${message.author.username}!`,
                    iconURL: message.author.displayAvatarURL()
                })
                .setDescription(`Eval \`-\` You can run code. \nRestart \`-\` You can reload commands and events. \nBlacklist \`-\` You can view and update the blacklist status of members.`)
                .setColor("Blurple")
            const row = new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                        .setStyle(ButtonStyle.Secondary)
                        .setCustomId(`developer_eval_${message.author.id}`)
                        .setEmoji("🪄")
                        .setLabel("Eval"),
                    new ButtonBuilder()
                        .setStyle(ButtonStyle.Secondary)
                        .setCustomId(`developer_restart_${message.author.id}`)
                        .setEmoji(emoji.refresh.id)
                        .setLabel("Restart"),
                    new ButtonBuilder()
                        .setStyle(ButtonStyle.Secondary)
                        .setCustomId(`developer_blacklist_${message.author.id}`)
                        .setEmoji("🖤")
                        .setLabel("Blacklist")
                )

            await message.reply({
                embeds: [embed],
                components: [row]
            })
        }

    }
}