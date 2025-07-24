const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const { Cooldown } = require('../../../functions/cooldown');
const { embedError } = require('../../../functions/embed');

module.exports = {
    name: 'profile',
    description: 'You can see your profile.',
    aliases: [],
    permissions: false,
    maintenance: false,
    async run(client, message, args) {

        const cooldown = new Cooldown()
        const data = await cooldown.fetch(message.author.id, 'profile')

        if (!data.ended) {
            return message.reply({
                embeds: [
                    await embedError({
                        description: `You can use this command again ${data.endTimestamp}`
                    })
                ]
            })
        }

        await cooldown.set(message.author.id, 'profile', '10s')

        const user = message.mentions.users.first() || message.author;

        const discordDate = user.createdAt.getTime()
        const serverDate = message.guild.members.cache.get(user.id).joinedAt.getTime()

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
                text: message.author.username,
                iconURL: message.author.displayAvatarURL()
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

        await message.reply({
            embeds: [embed],
            components: [row]
        })

    }
};