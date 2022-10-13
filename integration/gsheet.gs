function onOpen() {
  var spreadsheet = SpreadsheetApp.getActive();
  var menuItems = [
    {name: 'Send SMS...', functionName: 'sendSMSFunction'}
  ];
  spreadsheet.addMenu('| Twilio ', menuItems);
}

function _sendSMS(to, body) {
  var templates_sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Templates");
  var cfg_start = SpreadsheetApp.getActiveSpreadsheet().getRangeByName("ConfigListStart");

  Logger.log("TemplateList starts at " + cfg_start.getA1Notation() + " Col:" + cfg_start.getColumn() + " Row:" + cfg_start.getRow() );
  var config_values = templates_sheet.getRange(cfg_start.getRow(), cfg_start.getColumn(), 4, 2).getValues();

  // MasterProject
  var ACCOUNT_SID = config_values[0][1];
  var PHONE_NUMBER = config_values[2][1];
  
  // MasterProject
  var USERNAME = config_values[0][1];
  var PASSWORD = config_values[1][1];
  Logger.log("Account SID: " + ACCOUNT_SID + " AUTHTOKEN: " + PASSWORD + " PHONENUMBER: " + PHONE_NUMBER );

  var messages_url = "https://api.twilio.com/2010-04-01/Accounts/" + ACCOUNT_SID + "/Messages.json";
    
  var payload = {
    "To": to,
    "Body" : body,
    "From" : PHONE_NUMBER
  };

  var options = {
    "method" : "post",
    "payload" : payload
  };

  options.headers = { 
    "Authorization" : "Basic " + Utilities.base64Encode(USERNAME + ':' + PASSWORD)
  };

  return JSON.parse(UrlFetchApp.fetch(messages_url, options));
}

function _sendAll() {
  // Contact List Sheet
  //var contacts = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("ContactList");
  var contacts = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  var cl_start = SpreadsheetApp.getActiveSpreadsheet().getRangeByName("ContactListStart");
  var vl_start = SpreadsheetApp.getActiveSpreadsheet().getRangeByName("VariablesListStart");
  
  // Template Sheet
  var templates_sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Templates");
  var tl_start = SpreadsheetApp.getActiveSpreadsheet().getRangeByName("TemplateListStart");
  
  
  Logger.log("ContactList starts at " + cl_start.getA1Notation() + " Col:" + cl_start.getColumn() + " Row:" + cl_start.getRow() );
  Logger.log("VariablesList starts at " + vl_start.getA1Notation() + " Col:" + vl_start.getColumn() + " Row:" + vl_start.getRow() );
  Logger.log("TemplateList starts at " + tl_start.getA1Notation() + " Col:" + tl_start.getColumn() + " Row:" + tl_start.getRow() );
  
  var cur_row = cl_start.getRow();
  var contact_col = cl_start.getColumn();
  var variable_first_col = vl_start.getColumn();
  var variable_last_col = vl_start.getColumn() + vl_start.getNumColumns();
  
  var header_range = contacts.getRange(cur_row - 1, 1, 1, variable_last_col);
  var range = contacts.getRange(cur_row, 1, 100, variable_last_col);
  
  var templates_values = templates_sheet.getRange(tl_start.getRow(), tl_start.getColumn(), 100, 2).getValues();
  var templates = {}
  
  // Get all the templates
  for(var t_row in templates_values ) {
    if(templates_values[t_row][0] != "") {
      templates[templates_values[t_row][0]] = templates_values[t_row][1];
    }
  }
  
  Logger.log("Templates: " + JSON.stringify(templates));
  
  var headers = header_range.getValues();
  var values = range.getValues();
  
  // Go through each row and process SMS
  for (var row in values) {
    if( values[row][contact_col - 1] != "" ) {
      
      // Set the contact number
      var contact = values[row][contact_col - 1];
      
      // Get the variables
      var variables = {};
      for( i = variable_first_col - 1; i < variable_last_col - 1; i++ ) {
        variables[headers[0][i]] = values[row][i];
      }
      Logger.log(contact + " Variables: " + JSON.stringify(variables));
      
      // set the template message
      var message = templates[variables["Template"]];
      Logger.log("Message: " + message);
      
      // replace placeholder in template
      for(var k in variables ) {
        message = message.replace("{{"+ k + "}}", variables[k]);
      }
      Logger.log("Message: " + message);
      
      // Send SMS
      var response = _sendSMS(contact, message);
      var status = response.status;
      var error = response.error_code;
      
      Logger.log(JSON.stringify(response));
      
      // Write responses
      contacts.getRange(cur_row + Number(row), 3).setValue(status);
      contacts.getRange(cur_row + Number(row), 4).setValue(Utilities.formatDate(new Date(), "GMT+10", "dd/MM/yyyy HH:mm:ss"))
      contacts.getRange(cur_row + Number(row), 5).setValue(Session.getActiveUser().getEmail());
      contacts.getRange(cur_row + Number(row), 6).setValue(response.sid);
      contacts.getRange(cur_row + Number(row), 7).setValue(error);
      
    }
  }
  
}

function sendSMSFunction() {
  var ui = SpreadsheetApp.getUi(); // Same variations.

  var result = ui.alert(
     'Please confirm',
     'Are you sure you want to continue?',
      ui.ButtonSet.YES_NO);

  // Process the user's response.
  if (result == ui.Button.YES) {
    // User clicked "Yes".
    ui.alert('Confirmation received. Sending Now...');
    _sendAll();
  } else {
    // User clicked "No" or X in the title bar.
    ui.alert('Didn\'t do antyhing. You said no');
  }
}
