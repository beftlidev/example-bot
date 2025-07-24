const { Database } = require("./database")
const ms = require('ms')

class Cooldown {

    async fetch(userId, system) {
        const data = await Database.cooldown.fetch(`${userId}.${system}`);

        if (data && data.endTime) {

            if (Date.now() > data.endTime) {
                return {
                    ended: true
                }
            } else {
                return {
                    ended: false,
                    endTimestamp: `<t:${(data.endTime / 1000).toFixed(0)}:R>`
                }
            };
        } else {
            return {
                ended: true
            }
        };

    };

    async set(userId, system, time) {

        await Database.cooldown.set(`${userId}.${system}.endTime`, Date.now() + ms(time));
        return true;

    };

};

module.exports = { Cooldown }