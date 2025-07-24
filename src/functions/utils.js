function wait(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function formatTime(number) {
    return number < 10 ? `0${number}` : `${number}`;
}

function getCurrentTime() {
    const now = new Date();
    const hours = formatTime(now.getHours());
    const minutes = formatTime(now.getMinutes());
    const seconds = formatTime(now.getSeconds());
    return `${hours}:${minutes}:${seconds}`;
}

module.exports = {
    wait,
    formatTime,
    getCurrentTime
}