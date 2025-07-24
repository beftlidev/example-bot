const { EmbedBuilder } = require("discord.js")
const emoji = require("./emoji")

async function embedSuccess(data = { author, description, fields }) {
    const { author = "Okay!", description = "", fields = null } = data;

    const embed = new EmbedBuilder()
        .setAuthor({
            name: author,
            iconURL: emoji.checkmark.url
        })
        .setDescription(`> ${description}`)
        .setColor("Green")

        if(fields) embed.setFields(fields);

        return embed;

}

async function embedInfo(data = { author, description, fields }) {
    const { author = "Just so you know.", description = "", fields = null } = data;

    const embed = new EmbedBuilder()
        .setAuthor({
            name: author,
            iconURL: emoji.info.url
        })
        .setDescription(`> ${description}`)
        .setColor("#006CE7")

        if(fields) embed.setFields(fields);

        return embed;

}


async function embedLoading(data = { author, description, fields }) {
    const { author = "Wait...", description = "", fields = null } = data;

    const embed = new EmbedBuilder()
        .setAuthor({
            name: author,
            iconURL: emoji.loading.url
        })
        .setDescription(`> ${description}`)
        .setColor("Blurple")

        if(fields) embed.setFields(fields);

        return embed;

}

async function embedError(data = { author, description, fields }) {
    const { author = "Opss.", description = "", fields = null } = data;

    const embed = new EmbedBuilder()
        .setAuthor({
            name: author,
            iconURL: emoji.cross.url
        })
        .setDescription(`> ${description}`)
        .setColor("Red")

        if(fields) embed.setFields(fields);

        return embed;

}

async function embedWarning(data = { author, description, fields }) {
    const { author = "Hey, one second.", description = "", fields = null } = data;

    const embed = new EmbedBuilder()
        .setAuthor({
            name: author,
            iconURL: emoji.warning.url
        })
        .setDescription(`> ${description}`)
        .setColor("Orange")

        if(fields) embed.setFields(fields);

        return embed;

}

module.exports = {
    embedSuccess,
    embedInfo,
    embedLoading,
    embedError,
    embedWarning
}