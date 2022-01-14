/*
 * This snippet is intended to be used in a function.
 * https://www.twilio.com/docs/runtime/functions
 *
 * Uses the Twilio client to get a worker by personal number.
 */

// Setup - add worker attribute 'personal_number'

exports.handler = function (context, event, callback) {
  let client = context.getTwilioClient();

  console.log(`personal_number == '${event.personal_number}'`);
  client.taskrouter
    .workspaces("WSxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx")
    .workers.list({
      targetWorkersExpression: `personal_number == '${event.personal_number}'`,
      limit: 5,
    })
    .then((workers) => {
      console.log(`${JSON.stringify(workers[0])}`);
      if (workers.length > 0) {
        // only really care about getting at least one. If you have more than one worker with the same attribute (why?), you can use the first one.
        return callback(null, {
          status: "worker-found",
          agent_id: workers[0].sid,
          friendly_name: workers[0].friendlyName,
        });
      }
      return callback(null, { status: "no-worker-found" });
    });
};
