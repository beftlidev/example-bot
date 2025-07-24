const Discord = require('discord.js')
const { Collection, ActionRowBuilder, ButtonBuilder, ButtonStyle, ActivityType, EmbedBuilder, WebhookClient } = require("discord.js");
const config = require('../../config');
const { getCurrentTime, wait } = require('../functions/utils');
const { postStats } = require('../functions/topGG');
const { logSuccess, logError, logWarning, logInfo } = require('../functions/log');

module.exports = async (client) => {
    if (!process.env.TOPGG_TOKEN) {
        logInfo('[TOP.GG] TopGG token not found in environment variables. Skipping TopGG integration.');
        return;
    }

    logInfo('[TOP.GG] Starting TopGG stats posting service...');

    let consecutiveErrors = 0;

    async function postStatsWithRetry() {
        for (let attempt = 1; attempt <= config.topGG.retryAttempts; attempt++) {
            try {
                const startTime = Date.now();
                const poster = await Promise.race([
                    postStats(client),
                    new Promise((_, reject) => 
                        setTimeout(() => reject(new Error('Timeout')), config.topGG.timeout)
                    )
                ]);
                
                const duration = Date.now() - startTime;
                
                if (poster) {
                    logSuccess(`[TOP.GG] | (${getCurrentTime()}) Successfully posted stats to TopGG (${duration}ms)`);
                    logInfo(`[TOP.GG] Stats: ${client.guilds.cache.size} guilds, ${client.users.cache.size} users`);
                    consecutiveErrors = 0;
                    return true;
                } else {
                    throw new Error('PostStats returned false');
                }
            } catch (error) {
                logError(`[TOP.GG] | (${getCurrentTime()}) Attempt ${attempt}/${config.topGG.retryAttempts} failed:`, error.message);
                
                if (attempt < config.topGG.retryAttempts) {
                    logInfo(`[TOP.GG] Retrying in ${config.topGG.retryDelay / 1000} seconds...`);
                    await wait(config.topGG.retryDelay);
                } else {
                    consecutiveErrors++;
                    logError(`[TOP.GG] | (${getCurrentTime()}) All retry attempts failed. Consecutive errors: ${consecutiveErrors}`);
                    
                    if (consecutiveErrors >= 5) {
                        logWarning('[TOP.GG] Too many consecutive errors. Increasing interval to 2 hours.');
                        return false;
                    }
                }
            }
        }
        return false;
    }

    async function topggLoop() {
        try {
            await postStatsWithRetry();
        } catch (error) {
            logError('[TOP.GG] Unexpected error in topgg loop:', error);
        }

        const interval = consecutiveErrors >= 5 ? config.topGG.interval * 2 : config.topGG.interval;
        
        setTimeout(() => {
            topggLoop();
        }, interval);
    }

    await topggLoop();

    logSuccess('[TOP.GG] TopGG service initialized successfully!');
}