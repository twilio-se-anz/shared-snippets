/**
 * This fuction is a snippet for Twilio Serverless Function to call Segement Source API. This
 * 
 * context environment variable Required
 * - ANALYTICS_WRITE_KEY : Segment Source Write Key
 * 
 * event environment variable Required
 * - phone : Phone number to send SMS to
 */

const twilio_version = require('twilio/package.json').version;

const Analytics = require('analytics-node');
const {v5: uuidv5, v4: uuidv4} = require('uuid');

exports.handler = async function(context, event, callback) {

  console.log(`Entered ${context.PATH} node version ${process.version} twilio version ${twilio_version}`);

  const analytics = new Analytics(context.ANALYTICS_WRITE_KEY);

  const userUuid = uuidv4();

  new Promise((resolve, reject) => { 
    analytics.track({
      anonymousId : userUuid,
      event : 'booth-game',
      properties : {
        boothId: 1,
        boothName: 'Trains',
        phone: event.phone,
        command: 'dummy',
        data: {
          fullCommand: 'dummy full',
        }
      }
    }, (err) => {
      if( !err) { resolve(); }
      else { reject(err); }
    });
  }).then(() => {
    callback(null, {status: 'done'});
  }).catch((err) => {
    callback(null, {status: 'err'});
  })
  
};