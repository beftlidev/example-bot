const Discord = require("discord.js");
const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
const config = require("../../../config");
const { embedLoading, embedWarning, embedError, embedSuccess } = require("../../functions/embed");
const emoji = require("../../functions/emoji");
const { Database } = require("../../functions/database");
const { logInfo, logSuccess } = require("../../functions/log.js");

module.exports = {
    name: "interactionCreate",
    async run(client, interaction) {

        if (!interaction.isButton()) return;

        if (interaction.customId.startsWith("developer_")) {

            await interaction.deferUpdate()

            const [, button, userId] = interaction.customId.split("_");

            if (interaction.user.id !== userId) return;

            if (button == "main") {
                const embed = new EmbedBuilder()
                    .setAuthor({
                        name: `Welcome to the Developer Dashboard, ${interaction.user.username}!`,
                        iconURL: interaction.user.displayAvatarURL()
                    })
                    .setDescription(`Eval \`-\` You can run code. \nRestart \`-\` You can reload commands and events. \nBlacklist \`-\` You can view and update the blacklist status of members.`)
                    .setColor("Blurple")
                const row = new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                            .setStyle(ButtonStyle.Secondary)
                            .setCustomId(`developer_eval_${interaction.user.id}`)
                            .setEmoji("🪄")
                            .setLabel("Eval"),
                        new ButtonBuilder()
                            .setStyle(ButtonStyle.Secondary)
                            .setCustomId(`developer_restart_${interaction.user.id}`)
                            .setEmoji(emoji.refresh.id)
                            .setLabel("Restart"),
                        new ButtonBuilder()
                            .setStyle(ButtonStyle.Secondary)
                            .setCustomId(`developer_blacklist_${interaction.user.id}`)
                            .setEmoji("🖤")
                            .setLabel("Blacklist")
                    )

                await interaction.editReply({
                    embeds: [embed],
                    components: [row]
                })
            }

            if (button == "eval") {
                await interaction.editReply({
                    embeds: [
                        await embedLoading({
                            description: `Go ahead, enter a code and see what happens.`
                        })
                    ],
                    components: []
                })

                const filter = (message) => message.author.id === interaction.user.id;
                const collector = interaction.channel.createMessageCollector({
                    filter,
                    max: 1,
                    time: 300000
                });

                collector.on('collect', async (message) => {
                    const code = message.content;

                    try {
                        await message.delete().catch(() => { });

                        let result = eval(code);

                        if (result instanceof Promise) {
                            result = await result;
                        }

                        if (typeof result !== 'string') {
                            result = require('util').inspect(result, { depth: 0 });
                        }

                        const actionRow = new ActionRowBuilder()
                            .addComponents(
                                new ButtonBuilder()
                                    .setStyle(ButtonStyle.Primary)
                                    .setCustomId(`developer_main_${interaction.user.id}`)
                                    .setEmoji(emoji.main.id)
                                    .setLabel("Go to Main"),
                                new ButtonBuilder()
                                    .setStyle(ButtonStyle.Secondary)
                                    .setCustomId(`developer_eval_${interaction.user.id}`)
                                    .setEmoji("🪄")
                                    .setLabel("Try Another Code"),
                                new ButtonBuilder()
                                    .setStyle(ButtonStyle.Secondary)
                                    .setCustomId(`developer_tryagain_${interaction.user.id}_${Buffer.from(code).toString('base64')}`)
                                    .setEmoji(emoji.refresh.id)
                                    .setLabel("Execute Again")
                            );

                        await interaction.editReply({
                            embeds: [
                                await embedSuccess({
                                    author: "Code Executed Successfully",
                                    description: `Characters: ${code.length}`,
                                    fields: [{
                                        name: 'Code',
                                        value: `\`\`\`js\n${code.slice(0, 1000)}\`\`\``
                                    }, {
                                        name: 'Result',
                                        value: `\`\`\`js\n${result.slice(0, 1000)}\`\`\``
                                    }]
                                })
                            ],
                            components: [actionRow]
                        });

                    } catch (error) {
                        const actionRow = new ActionRowBuilder()
                            .addComponents(
                                new ButtonBuilder()
                                    .setStyle(ButtonStyle.Primary)
                                    .setCustomId(`developer_main_${interaction.user.id}`)
                                    .setEmoji(emoji.main.id)
                                    .setLabel("Go to Main"),
                                new ButtonBuilder()
                                    .setStyle(ButtonStyle.Secondary)
                                    .setCustomId(`developer_eval_${interaction.user.id}`)
                                    .setEmoji("🪄")
                                    .setLabel("Try Another Code"),
                                new ButtonBuilder()
                                    .setStyle(ButtonStyle.Secondary)
                                    .setCustomId(`developer_tryagain_${interaction.user.id}_${Buffer.from(code).toString('base64')}`)
                                    .setEmoji(emoji.refresh.id)
                                    .setLabel("Execute Again")
                            );

                        await interaction.editReply({
                            embeds: [
                                await embedError({
                                    author: "Code Execution Failed",
                                    description: `Characters: ${code.length}`,
                                    fields: [{
                                        name: 'Code',
                                        value: `\`\`\`js\n${code.slice(0, 1000)}\`\`\``
                                    }, {
                                        name: 'Error',
                                        value: `\`\`\`js\n${error.message.slice(0, 1000)}\`\`\``
                                    }]
                                })
                            ],
                            components: [actionRow]
                        });
                    }
                });

                collector.on('end', async (collected, reason) => {
                    if (reason === 'time' && collected.size === 0) {
                        await interaction.editReply({
                            embeds: [
                                await embedWarning({
                                    description: "You took too long to respond. Please try again."
                                })
                            ]
                        });
                    }
                });
            }

            if (button == "tryagain") {
                // Base64'ten kodu çöz
                const encodedCode = interaction.customId.split('_')[3];
                const code = Buffer.from(encodedCode, 'base64').toString('utf-8');

                try {
                    let result = eval(code);

                    if (result instanceof Promise) {
                        result = await result;
                    }

                    if (typeof result !== 'string') {
                        result = require('util').inspect(result, { depth: 0 });
                    }

                    const actionRow = new ActionRowBuilder()
                        .addComponents(
                            new ButtonBuilder()
                                .setStyle(ButtonStyle.Primary)
                                .setCustomId(`developer_main_${interaction.user.id}`)
                                .setEmoji(emoji.main.id)
                                .setLabel("Go to Main"),
                            new ButtonBuilder()
                                .setStyle(ButtonStyle.Secondary)
                                .setCustomId(`developer_eval_${interaction.user.id}`)
                                .setEmoji("🪄")
                                .setLabel("Try Another Code"),
                            new ButtonBuilder()
                                .setStyle(ButtonStyle.Secondary)
                                .setCustomId(`developer_tryagain_${interaction.user.id}_${encodedCode}`)
                                .setEmoji(emoji.refresh.id)
                                .setLabel("Execute Again")
                        );

                    await interaction.editReply({
                        embeds: [
                            await embedSuccess({
                                author: "Code Executed Successfully (Try Again)",
                                description: `Characters: ${code.length}`,
                                fields: [{
                                    name: 'Code',
                                    value: `\`\`\`js\n${code.slice(0, 1000)}\`\`\``
                                }, {
                                    name: 'Result',
                                    value: `\`\`\`js\n${result.slice(0, 1000)}\`\`\``
                                }]
                            })
                        ],
                        components: [actionRow]
                    });

                } catch (error) {
                    const actionRow = new ActionRowBuilder()
                        .addComponents(
                            new ButtonBuilder()
                                .setStyle(ButtonStyle.Primary)
                                .setCustomId(`developer_main_${interaction.user.id}`)
                                .setEmoji(emoji.main.id)
                                .setLabel("Go to Main"),
                            new ButtonBuilder()
                                .setStyle(ButtonStyle.Secondary)
                                .setCustomId(`developer_eval_${interaction.user.id}`)
                                .setEmoji("🪄")
                                .setLabel("Try Another Code"),
                            new ButtonBuilder()
                                .setStyle(ButtonStyle.Secondary)
                                .setCustomId(`developer_tryagain_${interaction.user.id}_${encodedCode}`)
                                .setEmoji(emoji.refresh.id)
                                .setLabel("Execute Again"),
                        );

                    await interaction.editReply({
                        embeds: [
                            await embedError({
                                author: "Code Execution Failed (Try Again)",
                                description: `Characters: ${code.length}`,
                                fields: [{
                                    name: 'Code',
                                    value: `\`\`\`js\n${code.slice(0, 1000)}\`\`\``
                                }, {
                                    name: 'Error',
                                    value: `\`\`\`js\n${error.message.slice(0, 1000)}\`\`\``
                                }]
                            })
                        ],
                        components: [actionRow]
                    });
                }
            }

            if (button == "blacklist") {
                await interaction.editReply({
                    embeds: [
                        await embedLoading({
                            description: `Please enter a user ID or mention a user to manage their blacklist status.`
                        })
                    ],
                    components: []
                })

                const filter = (message) => message.author.id === interaction.user.id;
                const collector = interaction.channel.createMessageCollector({
                    filter,
                    max: 1,
                    time: 300000
                });

                collector.on('collect', async (message) => {
                    let userId;
                    const content = message.content.trim();

                    try {
                        await message.delete().catch(() => { });

                        // Check if it's a mention
                        if (content.startsWith('<@') && content.endsWith('>')) {
                            userId = content.slice(2, -1);
                            if (userId.startsWith('!')) {
                                userId = userId.slice(1);
                            }
                        } else {
                            userId = content;
                        }

                        if (!/^\d{17,19}$/.test(userId)) {
                            await interaction.editReply({
                                embeds: [
                                    await embedError({
                                        description: "Invalid user ID or mention format."
                                    })
                                ]
                            });
                            return;
                        }

                        // Try to fetch user
                        let user;
                        try {
                            user = await client.users.fetch(userId);
                        } catch (error) {
                            await interaction.editReply({
                                embeds: [
                                    await embedError({
                                        description: "User not found."
                                    })
                                ]
                            });
                            return;
                        }

                        // Check if user is blacklisted
                        const blacklistData = Database.bot.get(`blacklist.${userId}`);
                        const isBlacklisted = blacklistData !== null;

                        const actionRow = new ActionRowBuilder();

                        if (isBlacklisted) {
                            // User is blacklisted - show remove and edit reason buttons
                            actionRow.addComponents(
                                new ButtonBuilder()
                                    .setStyle(ButtonStyle.Primary)
                                    .setCustomId(`developer_main_${interaction.user.id}`)
                                    .setEmoji(emoji.main.id)
                                    .setLabel("Go to Main"),
                                new ButtonBuilder()
                                    .setStyle(ButtonStyle.Secondary)
                                    .setCustomId(`developer_removeblacklist_${interaction.user.id}_${userId}`)
                                    .setEmoji(emoji.checkmark.id)
                                    .setLabel("Remove from Blacklist"),
                                new ButtonBuilder()
                                    .setStyle(ButtonStyle.Secondary)
                                    .setCustomId(`developer_editreason_${interaction.user.id}_${userId}`)
                                    .setEmoji(emoji.pencil.id)
                                    .setLabel("Edit Reason")
                            );

                            await interaction.editReply({
                                embeds: [
                                    await embedWarning({
                                        author: "User is Blacklisted",
                                        description: `**User:** ${user.tag} ( \`${user.id}\` )\n**Reason:** ${blacklistData.reason || 'No reason provided'}\n**Date:** ${blacklistData.timestamp ? `<t:${blacklistData.timestamp}> ( <t:${blacklistData.timestamp}:R> )` : 'Unknown'}`
                                    })
                                ],
                                components: [actionRow]
                            });
                        } else {
                            // User is not blacklisted - show add button
                            actionRow.addComponents(
                                new ButtonBuilder()
                                    .setStyle(ButtonStyle.Primary)
                                    .setCustomId(`developer_main_${interaction.user.id}`)
                                    .setEmoji(emoji.main.id)
                                    .setLabel("Go to Main"),
                                new ButtonBuilder()
                                    .setStyle(ButtonStyle.Secondary)
                                    .setCustomId(`developer_addblacklist_${interaction.user.id}_${userId}`)
                                    .setEmoji(emoji.cross.id)
                                    .setLabel("Add to Blacklist")
                            );

                            await interaction.editReply({
                                embeds: [
                                    await embedSuccess({
                                        author: "User is Not Blacklisted",
                                        description: `**User:** ${user.tag} ( \`${user.id}\` )\n**Status:** Clean`
                                    })
                                ],
                                components: [actionRow]
                            });
                        }

                    } catch (error) {
                        await interaction.editReply({
                            embeds: [
                                await embedError({
                                    description: `An error occurred: ${error.message}`
                                })
                            ]
                        });
                    }
                });

                collector.on('end', async (collected, reason) => {
                    if (reason === 'time' && collected.size === 0) {
                        await interaction.editReply({
                            embeds: [
                                await embedWarning({
                                    description: "You took too long to respond. Please try again."
                                })
                            ]
                        });
                    }
                });
            }

            if (button == "addblacklist") {
                const targetUserId = interaction.customId.split('_')[3];

                await interaction.editReply({
                    embeds: [
                        await embedLoading({
                            description: `Please enter a reason for blacklisting this user.`
                        })
                    ],
                    components: []
                });

                const filter = (message) => message.author.id === interaction.user.id;
                const collector = interaction.channel.createMessageCollector({
                    filter,
                    max: 1,
                    time: 300000
                });

                collector.on('collect', async (message) => {
                    const reason = message.content.trim();

                    try {
                        await message.delete().catch(() => { });

                        const user = await client.users.fetch(targetUserId);
                        const currentDate = new Date().toLocaleString();

                        const timestamp = Math.floor(Date.now() / 1000);

                        Database.bot.set(`blacklist.${targetUserId}`, {
                            reason: reason,
                            timestamp: timestamp,
                            addedBy: interaction.user.id
                        });

                        const actionRow = new ActionRowBuilder()
                            .addComponents(
                                new ButtonBuilder()
                                    .setStyle(ButtonStyle.Primary)
                                    .setCustomId(`developer_main_${interaction.user.id}`)
                                    .setEmoji(emoji.main.id)
                                    .setLabel("Go to Main"),
                                new ButtonBuilder()
                                    .setStyle(ButtonStyle.Secondary)
                                    .setCustomId(`developer_blacklist_${interaction.user.id}`)
                                    .setEmoji("🖤")
                                    .setLabel("Blacklist Another User")
                            );

                        await interaction.editReply({
                            embeds: [
                                await embedSuccess({
                                    author: "User Added to Blacklist",
                                    description: `**User:** ${user.tag} ( \`${user.id}\` )\n**Reason:** ${reason}\n**Date:** <t:${timestamp}> ( <t:${timestamp}:R> )`
                                })
                            ],
                            components: [actionRow]
                        });

                    } catch (error) {
                        await interaction.editReply({
                            embeds: [
                                await embedError({
                                    description: `An error occurred: ${error.message}`
                                })
                            ]
                        });
                    }
                });

                collector.on('end', async (collected, reason) => {
                    if (reason === 'time' && collected.size === 0) {
                        await interaction.editReply({
                            embeds: [
                                await embedWarning({
                                    description: "You took too long to respond. Please try again."
                                })
                            ]
                        });
                    }
                });
            }

            if (button == "removeblacklist") {
                const targetUserId = interaction.customId.split('_')[3];

                try {
                    const user = await client.users.fetch(targetUserId);

                    Database.bot.delete(`blacklist.${targetUserId}`);

                    const actionRow = new ActionRowBuilder()
                        .addComponents(
                            new ButtonBuilder()
                                .setStyle(ButtonStyle.Primary)
                                .setCustomId(`developer_main_${interaction.user.id}`)
                                .setEmoji(emoji.main.id)
                                .setLabel("Go to Main"),
                            new ButtonBuilder()
                                .setStyle(ButtonStyle.Secondary)
                                .setCustomId(`developer_blacklist_${interaction.user.id}`)
                                .setEmoji("🖤")
                                .setLabel("Blacklist Another User")
                        );

                    await interaction.editReply({
                        embeds: [
                            await embedSuccess({
                                author: "User Removed from Blacklist",
                                description: `**User:** ${user.tag} ( \`${user.id}\` )\n**Status:** User has been removed from the blacklist.`
                            })
                        ],
                        components: [actionRow]
                    });

                } catch (error) {
                    await interaction.editReply({
                        embeds: [
                            await embedError({
                                description: `An error occurred: ${error.message}`
                            })
                        ]
                    });
                }
            }

            if (button == "editreason") {
                const targetUserId = interaction.customId.split('_')[3];

                await interaction.editReply({
                    embeds: [
                        await embedLoading({
                            description: `Please enter a new reason for this user's blacklist.`
                        })
                    ],
                    components: []
                });

                const filter = (message) => message.author.id === interaction.user.id;
                const collector = interaction.channel.createMessageCollector({
                    filter,
                    max: 1,
                    time: 300000
                });

                collector.on('collect', async (message) => {
                    const newReason = message.content.trim();

                    try {
                        await message.delete().catch(() => { });

                        const user = await client.users.fetch(targetUserId);
                        const blacklistData = Database.bot.get(`blacklist.${targetUserId}`);
                        const editTimestamp = Math.floor(Date.now() / 1000);

                        Database.bot.set(`blacklist.${targetUserId}`, {
                            ...blacklistData,
                            reason: newReason,
                            lastEditedTimestamp: editTimestamp,
                            editedBy: interaction.user.id
                        });

                        const actionRow = new ActionRowBuilder()
                            .addComponents(
                                new ButtonBuilder()
                                    .setStyle(ButtonStyle.Primary)
                                    .setCustomId(`developer_main_${interaction.user.id}`)
                                    .setEmoji(emoji.main.id)
                                    .setLabel("Go to Main"),
                                new ButtonBuilder()
                                    .setStyle(ButtonStyle.Secondary)
                                    .setCustomId(`developer_blacklist_${interaction.user.id}`)
                                    .setEmoji("🖤")
                                    .setLabel("Blacklist Another User")
                            );

                        await interaction.editReply({
                            embeds: [
                                await embedSuccess({
                                    author: "Blacklist Reason Updated",
                                    description: `**User:** ${user.tag} ( \`${user.id}\` )\n**New Reason:** ${newReason}\n**Updated:** <t:${editTimestamp}> ( <t:${editTimestamp}:R> )`
                                })
                            ],
                            components: [actionRow]
                        });

                    } catch (error) {
                        await interaction.editReply({
                            embeds: [
                                await embedError({
                                    description: `An error occurred: ${error.message}`
                                })
                            ]
                        });
                    }
                });

                collector.on('end', async (collected, reason) => {
                    if (reason === 'time' && collected.size === 0) {
                        await interaction.editReply({
                            embeds: [
                                await embedWarning({
                                    description: "You took too long to respond. Please try again."
                                })
                            ]
                        });
                    }
                });
            }

            if (button == "restart") {
                try {
                    await interaction.editReply({
                        embeds: [
                            await embedLoading({
                                description: "Reloading commands and events..."
                            })
                        ],
                        components: []
                    });

                    client.removeAllListeners();
                    client.commands.contextMenu.clear();
                    client.commands.prefix.clear();
                    client.commands.aliases.clear();
                    client.commands.slash.clear();

                    console.log()
                    logInfo("Restarting bot...");

                    const commandLoader = require('../../../starter/loader/command.js');
                    commandLoader(client, true);

                    const eventLoader = require('../../../starter/loader/event.js');
                    eventLoader(client, true);

                    const functionLoader = require('../../../starter/loader/function.js');
                    functionLoader(client, true);
                    logSuccess("Bot restarted successfully.");

                    const actionRow = new ActionRowBuilder()
                        .addComponents(
                            new ButtonBuilder()
                                .setStyle(ButtonStyle.Primary)
                                .setCustomId(`developer_main_${interaction.user.id}`)
                                .setEmoji(emoji.main.id)
                                .setLabel("Go to Main"),
                            new ButtonBuilder()
                                .setStyle(ButtonStyle.Secondary)
                                .setCustomId(`developer_restart_${interaction.user.id}`)
                                .setEmoji(emoji.refresh.id)
                                .setLabel("Restart Again")
                        );

                    await interaction.editReply({
                        embeds: [
                            await embedSuccess({
                                description: "Bot restarted successfully."
                            })
                        ],
                        components: [actionRow]
                    });

                } catch (error) {
                    await interaction.editReply({
                        embeds: [
                            await embedError({
                                author: "Restart Failed",
                                description: `An error occurred during restart.`,
                                fields: [
                                    {
                                        name: "Error",
                                        value: `\`\`\`js\n${error.message}\`\`\``
                                    }
                                ]
                            })
                        ],
                        components: [
                            new ActionRowBuilder()
                                .addComponents(
                                    new ButtonBuilder()
                                        .setStyle(ButtonStyle.Primary)
                                        .setCustomId(`developer_main_${interaction.user.id}`)
                                        .setEmoji(emoji.main.id)
                                        .setLabel("Go to Main")
                                )
                        ]
                    });
                }
            }

        }

    }
}