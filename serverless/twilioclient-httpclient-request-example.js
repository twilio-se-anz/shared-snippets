/******
 * This is an example of how to use the Twilio HTTP Client to make a request to the Twilio API.
 * Underlying library is axios.
 * https://github.com/twilio/twilio-node/blob/main/lib/base/RequestClient.js
 * */

const twilio_version = require('twilio/package.json').version;

exports.handler = async function(context, event, callback) {

  console.log(`Entered ${context.PATH} node version ${process.version} twilio version ${twilio_version}`);

  const client = context.getTwilioClient();

  const messageCreateUrl = `https://api.twilio.com/2010-04-01/Accounts/${context.ACCOUNT_SID}/Messages.json`;

  // Start Code Here
  const params = {
    'To': event.From,
    'From': event.To,
    'Body': 'Test Message',
  }

  const response = await client.httpClient.request({
    method: 'POST',
    uri: messageCreateUrl,
    data: params,
    username: context.ACCOUNT_SID,
    password: context.AUTH_TOKEN,
    headers: {"Content-Type":"application/x-www-form-urlencoded"},
  })

  callback(null, response);
};