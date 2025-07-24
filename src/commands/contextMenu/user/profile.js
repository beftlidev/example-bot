const { ApplicationCommandType, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, MessageFlags } = require("discord.js")
const { ContextMenuCommandBuilder } = require("@discordjs/builders");
const { Cooldown } = require('../../../functions/cooldown');
const { embedError } = require('../../../functions/embed');

module.exports = {
    data: new ContextMenuCommandBuilder()
        .setName("Profile")
        .setType(ApplicationCommandType.User),
    permissions: false,
    maintenance: false,
    async run(client, interaction) {

        await interaction.deferReply({
            flags: [MessageFlags.Ephemeral]
        })

        const cooldown = new Cooldown()
        const data = await cooldown.fetch(interaction.user.id, 'profile')

        if (!data.ended) {
            return interaction.editReply({
                embeds: [
                    await embedError({
                        description: `You can use this command again ${data.endTimestamp}`
                    })
                ]
            })
        }

        await cooldown.set(interaction.user.id, 'profile', '10s')

        const user = interaction.targetUser;

        const discordDate = user.createdAt.getTime()
        const serverDate = interaction.guild.members.cache.get(user.id).joinedAt.getTime()

        const embed = new EmbedBuilder()
            .setAuthor({
                name: `${user.username}'s profile`
            })
            .setThumbnail(user.displayAvatarURL())
            .setFields([
                { name: "Date of Discord account opening", value: `<t:${(discordDate - (discordDate % 1000)) / 1000}> ( <t:${(discordDate - (discordDate % 1000)) / 1000}:R> )` },
                { name: "Date of joining the server", value: `<t:${(serverDate - (serverDate % 1000)) / 1000}> ( <t:${(serverDate - (serverDate % 1000)) / 1000}:R> )` }
            ])
            .setColor("Blurple")
            .setFooter({
                text: interaction.user.username,
                iconURL: interaction.user.displayAvatarURL()
            })

        const row = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setStyle(ButtonStyle.Link)
                    .setLabel("Avatar")
                    .setURL(`${user.displayAvatarURL()}`)
            )

        const banner = await user.fetch({ force: true }).then(async (uss) => {
            return uss.banner
        })

        if (banner) {
            const extension = banner.startsWith("a_") ? ".gif" : ".png";
            embed.setImage(`https://cdn.discordapp.com/banners/${user.id}/${banner}${extension}?size=4096`)
            row.addComponents(new ButtonBuilder().setStyle(ButtonStyle.Link).setLabel("Banner").setURL(`https://cdn.discordapp.com/banners/${user.id}/${banner}${extension}?size=4096`))
        }

        await interaction.editReply({
            embeds: [embed],
            components: [row]
        })

    }
};