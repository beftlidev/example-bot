const raw = {
  checkmark: "<:checkmark:1196518475275960330>",
  info: "<:info:1397653926987305121>",
  loading: "<a:loading:1196516175476162750>",
  cross: "<:cross:1196518471232655440>",
  warning: "<:info:1196518477469585528>",
  main: "<:home:1216013763933896804>",
  refresh: "<:refresh:1375463054984216810>",
  pencil: "<:pencil:1216074862750072893>"
};

const emoji = Object.fromEntries(
  Object.entries(raw).map(([k, v]) => [k, createEmojiObject(v)])
);

function parseEmoji(emojiString) {
    if (!emojiString || typeof emojiString !== 'string') {
        return null;
    }

    const match = emojiString.match(/<(a?):(\w+):(\d+)>/);
    if (!match) {
        return null;
    }

    const [, animated, name, id] = match;
    const isAnimated = animated === 'a';
    const extension = isAnimated ? 'gif' : 'png';
    const url = `https://cdn.discordapp.com/emojis/${id}.${extension}`;

    return {
        name,
        id,
        url,
        animated: isAnimated,
        toString: () => emojiString
    };
}

function createEmojiObject(emojiString) {
    const parsed = parseEmoji(emojiString);
    if (!parsed) {
        return {
            toString: () => emojiString,
            valueOf: () => emojiString,
            name: null,
            id: null,
            url: null,
            animated: false
        };
    }

    return {
        toString: () => emojiString,
        valueOf: () => emojiString,
        name: parsed.name,
        id: parsed.id,
        url: parsed.url,
        animated: parsed.animated
    };
}

module.exports = emoji;