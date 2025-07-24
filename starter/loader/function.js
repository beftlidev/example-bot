const fs = require('fs');
const path = require('path');
const { logInfo, logWarning, logError, logSuccess } = require('../../src/functions/log.js');

function getAllFunctionFiles(dir, fileList = []) {
    const files = fs.readdirSync(dir);

    files.forEach(file => {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);

        if (stat.isDirectory()) {
            getAllFunctionFiles(filePath, fileList);
        } else if (file.endsWith('.js')) {
            fileList.push(filePath);
        }
    });

    return fileList;
}

module.exports = (client, reload = false) => {
    const functionsPath = path.join(__dirname, '../../src/functions');

    if (!fs.existsSync(functionsPath)) {
        logWarning('[FUNCTION_LOAD] Functions directory not found.');
        return;
    }

    const functionFiles = getAllFunctionFiles(functionsPath);
    let loadedFunctions = 0;

    functionFiles.forEach(filePath => {
        try {
            if (reload) {
                delete require.cache[require.resolve(filePath)];
            }

            const func = require(filePath);
            const fileName = path.basename(filePath, '.js');

            if (func) {
                loadedFunctions++;
            } else {
                logWarning(`[FUNCTION_LOAD] ${fileName}.js could not be loaded.`);
            }
        } catch (error) {
            const fileName = path.basename(filePath);
            logError(`[FUNCTION_LOAD] Error loading ${fileName}:`, error);
        }
    });

    logSuccess(`[FUNCTION_LOAD] Successfully loaded ${loadedFunctions} functions.`);
};