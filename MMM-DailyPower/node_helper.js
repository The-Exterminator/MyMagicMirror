const NodeHelper = require("node_helper");
const https = require('https');

module.exports = NodeHelper.create({

    socketNotificationReceived: function (notification, payload) {
        if (notification === 'DAILY_POWER_LOAD_VERSE') {
            this.getDailyPowerVerse(payload.translation);
        }
    },

    getDailyPowerVerse: function (translation) {
        const date = this.createCurrentDate();
        const dailyPowerVerseApi = `https://dailypower.oemel09.de/api/v1/verses/${date}?lang=${translation}`;

        https.get(dailyPowerVerseApi, (response) => {
            let data = '';
            response.on('data', (chunk) => {
                data += chunk;
            });
            response.on('end', () => {
                console.log('DailyPower', 'new verse received');
                this.sendSocketNotification('DAILY_POWER_ON_VERSE_RECEIVED', JSON.parse(data));
            });
        }).on('error', (error) => {
            console.log("Error: " + error.message);
        });
    },

    createCurrentDate: function () {
        const currentDate = new Date();
        const day = this.prependLeadingZero(currentDate.getDate());
        const month = this.prependLeadingZero(currentDate.getMonth() + 1);
        const year = currentDate.getFullYear();

        return year + '-' + month + '-' + day;
    },

    prependLeadingZero: function (number) {
        return (number < 10) ? ('0' + number) : number;
    }
});
