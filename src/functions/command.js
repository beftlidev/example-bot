const Discord = require("discord.js");
const config = require("../../config");
const { Database } = require("./database");
const { support } = require("./button");
const { embedError, embedWarning } = require("./embed");

async function checkBlacklist(interaction) {
    const data = await Database.bot.fetch(`blacklist.${interaction.user ? interaction.user.id : interaction.author.id}`)
    if (data) {
        return {
            embed: [
                await embedError({
                    description: "You have been blacklisted for using bots. If you believe this is a mistake and would like to appeal, please contact our support server.",
                    fields: [
                        {
                            name: "❓ Why were you blacklisted?",
                            value: `${data.reason}`
                        }
                    ]
                })
            ],
            button: [
                await support({ type: "row" })
            ]
        }
    };

    return false;
}

async function checkPermissions(interaction, command) {
    const missingBasicPermissions = config.bot.basicPermissions.filter(permission =>
        !interaction.guild.members.me.permissions.has(permission)
    );

    if (missingBasicPermissions.length > 0) {
        return {
            embed: [
                await embedError({
                    description: "I don't have the basic permissions required to function properly.",
                    fields: [
                        {
                            name: "➖ Missing Basic Permissions",
                            value: missingBasicPermissions.map(perm =>
                                Object.keys(Discord.PermissionFlagsBits).find(key =>
                                    Discord.PermissionFlagsBits[key] === perm
                                )
                            ).join(", ")
                        }
                    ]
                })
            ]
        }
    };

    if (command.permissions) {
        if (!interaction.guild.members.me.permissions.has(command.permissions)) {
            return {
                embed: [
                    await embedError({
                        description: "I don't have the required permissions to execute this command.",
                        fields: [
                            {
                                name: "➕ Required Bot Permissions",
                                value: Array.isArray(command.permissions) ?
                                    command.permissions.map(perm =>
                                        Object.keys(Discord.PermissionFlagsBits).find(key =>
                                            Discord.PermissionFlagsBits[key] === perm
                                        )
                                    ).join(", ") : command.permissions
                            }
                        ]
                    })
                ]
            }
        }
    };

    return false;
}

async function checkMaintenance(command) {
    if (command.maintenance) {
        return {
            embed: [
                await embedWarning({
                    description: "This command is currently under maintenance. Please try again later. For more information, please visit our support server."
                })
            ],
            button: [
                await support({ type: "row" })
            ]
        }
    };

    return false;
}

module.exports = {
    checkBlacklist,
    checkPermissions,
    checkMaintenance
}