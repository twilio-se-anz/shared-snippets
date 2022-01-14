/*
 * This snippet is intended to be included in a flex plugin.
 * - https://www.twilio.com/docs/flex/developer/plugins 
 * - https://www.twilio.com/docs/flex/developer/voice/dialpad-click-to-dial#customize-the-outbound-call-action 
 */

init(flex, manager) {

  flex.Actions.replaceAction("StartOutboundCall", (payload, original) => {
    let newPayload = payload
    console.log('Original Payload ', payload);
    switch(payload.queueSid) {
      case 'WQxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx':  // Replace with Queue SID
        newPayload.callerId = '+nnnnnnnnnnn';     // Replace with outbound Caller ID for Queue
        console.log(`Caller ID override with ${newPayload.callerId}`);
        break;
      default:
        console.log(`no queue matched ${payload.queueSid}`);
    }
    console.log('New Payload', newPayload);
    original(newPayload);
  });

}