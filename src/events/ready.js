const { logSuccess } = require("../functions/log");

module.exports = {
    name: 'ready',
    async run(client) {

        logSuccess(`${client.user.tag} is ready!`);

    }
};