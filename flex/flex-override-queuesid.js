/**
 * This snippet is intended to be included in a flex plugin.
 * - https://www.twilio.com/docs/flex/developer/plugins 
 * - https://www.twilio.com/docs/flex/developer/voice/dialpad-click-to-dial#customize-the-outbound-call-action 
 */

 init(flex, manager) {

  flex.Actions.replaceAction("StartOutboundCall", (payload, original) => {
    let newPayload = payload

    // If queue_sid exists in the worker's attribute. Set the queue to be the worker's attribute.
    if( manager.workerClient.attributes.queue_sid ) {
      console.log('Worker has queue sid ', manager.workerClient.attributes.queue_sid);
      newPayload.queueSid = manager.workerClient.attributes.queue_sid;
    }
    
    // Manipulate newPayload
    switch(newPayload.queueSid) {
      case 'WQxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx':  // Replace with Queue SID
        newPayload.callerId = '+nnnnnnnnnnn';     // Replace with outbound Caller ID for Queue
        console.log(`Caller ID override with ${newPayload.callerId}`);
        break;
      default:
        console.log(`no queue matched ${payload.queueSid}`);
    }
    console.log('New Payload', newPayload);
    return original(newPayload);
  });

}