const activeApps = ['DailyScheduler', 'Server'];
const apps = {};

activeApps.map(app => {
    apps.app = require(`./${app}`)();
})