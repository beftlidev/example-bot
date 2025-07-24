const fs = require('fs');
const path = require('path');
const { logInfo, logWarning, logError, logSuccess } = require('../../src/functions/log.js');

function getAllCommandFiles(dir, fileList = []) {
    const files = fs.readdirSync(dir);

    files.forEach(file => {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);

        if (stat.isDirectory()) {
            getAllCommandFiles(filePath, fileList);
        } else if (file.endsWith('.js')) {
            fileList.push(filePath);
        }
    });

    return fileList;
}

module.exports = (client, reload = false) => {
    const commandsPath = path.join(__dirname, '../../src/commands');

    if (!fs.existsSync(commandsPath)) {
        logWarning('[COMMAND_LOAD] Commands directory not found.');
        return;
    }

    const commandFolders = fs.readdirSync(commandsPath).filter(folder => {
        return fs.statSync(path.join(commandsPath, folder)).isDirectory();
    });

    let loadedCommands = 0;

    commandFolders.forEach(folder => {
        const folderPath = path.join(commandsPath, folder);
        const commandFiles = getAllCommandFiles(folderPath);

        commandFiles.forEach(filePath => {
            try {
                if (reload) {
                    delete require.cache[require.resolve(filePath)];
                }

                const command = require(filePath);
                const relativePath = path.relative(commandsPath, filePath);

                if (command && (command.name || (command.data && command.data.name))) {
                    const commandName = command.name || command.data.name;

                    client.commands[folder].set(commandName, command);

                    if (command.aliases && Array.isArray(command.aliases)) {
                        command.aliases.forEach(alias => {
                            client.commands.aliases.set(alias, commandName);
                        });
                    }

                    loadedCommands++;
                } else {
                    logWarning(`[COMMAND_LOAD] ${relativePath} is missing name property.`);
                }
            } catch (error) {
                const relativePath = path.relative(commandsPath, filePath);
                logError(`[COMMAND_LOAD] Error loading ${relativePath}:`, error);
            }
        });
    });

    logSuccess(`[COMMAND_LOAD] Successfully loaded ${loadedCommands} commands.`);
};