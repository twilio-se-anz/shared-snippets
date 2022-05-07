/***
 * This code snippit can be used in Hubspot Workflows to send SMS. It calls Twilio API directly to send a single SMS.
 * 
 * Setup
 * 
 * - Add Secrets to Workflow
 *   - AccountSID from your Twilio Console
 *   - AuthToken from your Twilio Console
 * - Add Properties to Workflow
 *   - mobilephone from Hubspot Contact's Mobile Phone Number
 * 
 * - Edit the phoneNumber and body of the message as required. 
 */

const hubspot = require('@hubspot/api-client');
const axios = require('axios')

/**
 * Add your own template and twilio number here.
 */
// Change this to suit your needs, you can pass a template for text body. 
const twilioPhoneNumber = '+61480018956'
const template = 'Hi {{firstname}}, This is a test message'


exports.main = async (event, callback) => {

  const accountSID = process.env.AccountSID
  const authToken = process.env.AuthToken
  const phoneNumber = twilioPhoneNumber
  const toPhoneNumber = event.inputFields['mobilephone']
  const url = `https://api.twilio.com/2010-04-01/Accounts/${accountSID}/Messages.json`
  
  
  const inputFields = event.inputFields;
  
  // replace {{variables}} in the template with the input fields of the same key
  const body = template.replace(/{{([^}]+)}}/g, (match, key) => { return inputFields[key]; })
  
  // Required Parameters
  const params = new URLSearchParams()
  params.append('From', phoneNumber)
  params.append('To', toPhoneNumber)
  params.append('Body', body)

  // Required Headers
  const config = {
    headers: {
      'Authorization': 'Basic '+ Buffer.from(`${accountSID}:${authToken}`).toString('base64'), 
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  }

  const response = await axios.post(url, params, config)

  // you may want to have some error handling here. 
  console.log(response.data)
  
  callback({
    outputFields: {
      MessageSid: response.data.sid
    }
  });
}