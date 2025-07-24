const { IntentsBitField, PermissionFlagsBits } = require("discord.js")

module.exports = {
    bot: {
        version: "0.0.1",
        owners: [
            ""
        ],
        prefix: "!",
        callMessage: "hey bot",
        disabledIntents: [
            IntentsBitField.Flags.GuildPresences,
            IntentsBitField.Flags.GuildMembers
        ],
        maxListeners: 50,
        basicPermissions: [
            PermissionFlagsBits.AttachFiles,
            PermissionFlagsBits.EmbedLinks,
            PermissionFlagsBits.ReadMessageHistory,
            PermissionFlagsBits.SendMessages,
            PermissionFlagsBits.UseExternalEmojis,
            PermissionFlagsBits.ViewChannel
        ]
    },
    topGG: {
        interval: 3600000,
        retryAttempts: 3,
        retryDelay: 30000,
        timeout: 10000
    }
}