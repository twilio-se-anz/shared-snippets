/**
 * This is an API endpoint that will initiate a call to a Twilio number and hold the call while playing
 * a sequence of voice statements and  DTMF digits. It shows how Twiml is produced from helper libs.
 * 
 * Enter number values below and point incoming number to this url when deployed:
 * 
 */
exports.handler = async function (context, event, callback) {

    const restClient = context.getTwilioClient();
    const response = new Twilio.twiml.VoiceResponse();

    toNumber = '+61XXXXXXX';
    fromNumber = '+61XXXXXXX';

    response.say("Initial voice statement");
    response.play({
        digits: '2ww3' // DTMF digits with two 0.5s pauses between them
    }, '');

    response.say('Last voice statement');

    try {
        await restClient.calls
            .create({
                twiml: response,
                to: toNumber,
                from: fromNumber
            });
        callback(null, response); // Log out the Twiml for troubleshooting
    } catch (error) {
        callback(error, null);
    }
};



