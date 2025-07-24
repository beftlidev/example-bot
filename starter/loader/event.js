const fs = require('fs');
const path = require('path');
const { logInfo, logWarning, logError, logSuccess } = require('../../src/functions/log.js');

function getAllEventFiles(dir, fileList = []) {
    const files = fs.readdirSync(dir);

    files.forEach(file => {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);

        if (stat.isDirectory()) {
            getAllEventFiles(filePath, fileList);
        } else if (file.endsWith('.js')) {
            fileList.push(filePath);
        }
    });

    return fileList;
}

module.exports = (client, reload = false) => {
    const eventsPath = path.join(__dirname, '../../src/events');

    if (!fs.existsSync(eventsPath)) {
        logWarning('[EVENT_LOAD] Events directory not found.');
        return;
    }

    const eventFiles = getAllEventFiles(eventsPath);
    let loadedEvents = 0;

    eventFiles.forEach(filePath => {
        try {
            if (reload) {
                delete require.cache[require.resolve(filePath)];
            }

            const event = require(filePath);
            const fileName = path.basename(filePath);

            if (event && event.name) {
                client.on(event.name, (...data) => event.run(client, ...data));

                loadedEvents++;
            } else {
                logWarning(`[EVENT_LOAD] ${fileName} is missing name property.`);
            }
        } catch (error) {
            const fileName = path.basename(filePath);
            logError(`[EVENT_LOAD] Error loading ${fileName}:`, error);
        }
    });

    logSuccess(`[EVENT_LOAD] Successfully loaded ${loadedEvents} events.`);
};