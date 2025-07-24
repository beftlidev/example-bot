const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, PermissionFlagsBits } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
const { Cooldown } = require('../../../functions/cooldown');
const { embedError, embedSuccess } = require('../../../functions/embed');
const ms = require('ms');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('slowmode')
        .setDescription('You can change a channel\'s slowmode.')
        .addStringOption(sub => sub
            .setName("time")
            .setDescription("Type a time. (Example: 10s, 10m, 10h)")
            .setRequired(true)
        )
        .addChannelOption(sub => sub
            .setName("channel")
            .setDescription("If you want, you can change another channel's slowmode.")
            .setRequired(false)
        )
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels),
    permissions: [PermissionFlagsBits.ManageChannels],
    maintenance: false,
    async run(client, interaction) {

        await interaction.deferReply()

        const cooldown = new Cooldown()
        const data = await cooldown.fetch(interaction.user.id, 'slowmode')

        if (!data.ended) {
            return interaction.editReply({
                embeds: [
                    await embedError({
                        description: `You can use this command again ${data.endTimestamp}`
                    })
                ]
            })
        }

        await cooldown.set(interaction.user.id, 'slowmode', '10s')

        const time = interaction.options.getString("time")
        const convertedMs = ms(time)
        const channel = interaction.options.getChannel("channel") || interaction.channel;

        if(convertedMs <= 0) {
            return interaction.editReply({
                embeds: [
                    await embedError({
                        description: "You can't set slowmode to 0 or less."
                    })
                ]
            })
        }

        await channel.setRateLimitPerUser(convertedMs).then(async() => {
            await interaction.editReply({
                embeds: [
                    await embedSuccess({
                        description: `Successfully set ${channel} slowmode to ${time}`
                    })
                ]
            })
        }).catch(async(e) => {
            await interaction.editReply({
                embeds: [
                    await embedError({
                        description: `An error occurred while setting ${channel} slowmode to ${time}!`,
                        fields: [
                            {
                                name: "Error",
                                value: e.message
                            }
                        ]
                    })
                ]
            })
        })

    }
};