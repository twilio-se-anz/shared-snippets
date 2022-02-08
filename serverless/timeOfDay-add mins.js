/**
 * This function uses the current time in the provided time zone and adds the specified number of minutes to it.
 */
exports.handler = function (context, event, callback) {
    let moment = require('moment-timezone');
    let timezone = event.timezone || 'Australia/Sydney';
    console.log("timezone: " + timezone);

    let readyTime = moment().tz(timezone).add(6, 'minutes').format('HH:mm');
    
    console.log(readyTime);
    
    callback(null, readyTime);
};