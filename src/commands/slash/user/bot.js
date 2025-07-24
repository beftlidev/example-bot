const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
const { Cooldown } = require('../../../functions/cooldown');
const { embedError } = require('../../../functions/embed');
const { website, voteMe, support, invite } = require('../../../functions/button');
const config = require('../../../../config');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('bot')
        .setDescription('Bot Commands.')
        .addSubcommand(sub => sub
            .setName("about")
            .setDescription("You can see bot about.")
        ),
    permissions: false,
    maintenance: false,
    async run(client, interaction) {

        await interaction.deferReply()

        const subCommand = interaction.options.getSubcommand()

        const embed = new EmbedBuilder()
            .setAuthor({
                name: "About Me",
                iconURL: client.user.displayAvatarURL()
            })
            .setDescription(`Hello, I'm **${client.user.username}**! Below you will find some information about me. You can access my links using the buttons.`)
            .addFields([
                { name: `• Stats`, value: `🌍 Total Servers: **${client.guilds.cache.size}** \n🤝 Total Users: **${client.guilds.cache.reduce((a, b) => a + b.memberCount, 0).toLocaleString()}** \n⏰ Ping: **${client.ws.ping} ms** \n✨ Bot Version: **${config.bot.version}**` }
            ])
            .setColor("Blurple")
            .setFooter({ text: interaction.user.username, iconURL: interaction.user.displayAvatarURL({ extension: 'png' }) })

        const row = new ActionRowBuilder()
            .addComponents(
                await website({ type: "button" }),
                await invite({ type: "button" }),
                await voteMe({ type: "button" }),
                await support({ type: "button" })
            )

        await interaction.editReply({
            embeds: [embed],
            components: [row]
        })

    }
};