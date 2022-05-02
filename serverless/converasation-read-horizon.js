/**
 * This fuction is a snippet for Twilio Serverless Function to consolidate some conversations API to gather
 * some read horizon information about the conversations.
 * 
 * context environment variable Required
 * - SERVICE_SID : Conversation Service SID
 * 
 * event environment variable Required
 * - user_id : User Identity for the UserConversations
 * 
 * Output
  {
    "number_of_conversations": 1,
    "data": {
      "CHaf75ac4eac0541d18c0731fd2ccfffff": {
        "friendlyName": "Whatsapp Channel",
        "unreadMessagesCount": 0,
        "lastReadMessageIndex": 0,
        "lastMessage": "dan: hi"
      }
    }
  }
 */


const twilio_version = require('twilio/package.json').version;

exports.handler = async function(context, event, callback) {

  console.log(`Entered ${context.PATH} node version ${process.version} twilio version ${twilio_version}`);

  const client = context.getTwilioClient();

  const userId = event.user_id || 'userid' // user's identity
  const chatSid = context.SERVICE_SID // conversation service id

  const userConversations = await client.conversations.services(chatSid).users(userId)
                      .userConversations
                      .list();

  console.log(JSON.stringify(userConversations, null, 2));

  let conversation_read_horizon = {}

  await Promise.all(userConversations.map(async conversation => {
    console.log(`[${conversation.conversationSid}] unread message: ${conversation.unreadMessagesCount}`);
    console.log(`[${conversation.conversationSid}] last read message Index: ${conversation.lastReadMessageIndex}`);
    const lastMessages = await client.conversations.services(chatSid).conversations(conversation.conversationSid).messages.list({order: 'desc', limit: 5});
    console.log(`[${conversation.conversationSid}] last message: ${lastMessages[0].body}`);
    conversation_read_horizon[conversation.conversationSid] = {
      friendlyName: conversation.friendlyName,
      unreadMessagesCount: conversation.unreadMessagesCount || 0,
      lastReadMessageIndex: conversation.lastReadMessageIndex || 0,
      lastMessage: lastMessages[0].body
    }
  }))

  callback(null, {number_of_conversations: userConversations.length, data: conversation_read_horizon});
};