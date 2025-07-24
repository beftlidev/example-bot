const { default: chalk } = require("chalk")

const baseLog = console.log;

function logSuccess(message) {
    baseLog(chalk.green(`✅ | ${message}`))
}

function logInfo(message) {
    baseLog(chalk.blue(`ℹ️  | ${message}`))
}

function logError(message, error) {
    if (error) {
        baseLog(chalk.red(`❌ | ${message}`), error)
    } else {
        baseLog(chalk.red(`❌ | ${message}`))
    }
}

function logWarning(message) {
    baseLog(chalk.yellow(`⚠️ | ${message}`))
}

function logDebug(message) {
    baseLog(chalk.gray(`🐛 | ${message}`))
}

module.exports = {
    baseLog,
    logSuccess,
    logInfo,
    logError,
    logWarning,
    logDebug
}