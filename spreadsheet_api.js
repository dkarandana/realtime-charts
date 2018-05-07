const fs = require('fs');
const readline = require('readline');
//const google = require('googleapis');
const {google} = require('googleapis');
const OAuth2Client = google.auth.OAuth2;
const SCOPES = ['https://www.googleapis.com/auth/spreadsheets'];
const TOKEN_PATH = 'credentials.json';

// Load client secrets from a local file.
// fs.readFile('client_secret.json', (err, content) => {
//   if (err) return console.log('Error loading client secret file:', err);
//   // Authorize a client with credentials, then call the Google Sheets API.
//   authorize(JSON.parse(content), listInstants);
// });

var secret_json = fs.readFileSync('client_secret.json');
    
secret_json = JSON.parse(secret_json);

/**
 * Create an OAuth2 client with the given credentials, and then execute the
 * given callback function.
 * @param {Object} credentials The authorization client credentials.
 * @param {function} callback The callback to call with the authorized client.
 */
function authorize(credentials, callback,data) {
  const {client_secret, client_id, redirect_uris} = credentials.installed;
  const oAuth2Client = new OAuth2Client(client_id, client_secret, redirect_uris[0]);

  // Check if we have previously stored a token.
  fs.readFile(TOKEN_PATH, (err, token) => {
    if (err) return getNewToken(oAuth2Client, callback);
    oAuth2Client.setCredentials(JSON.parse(token));
    callback(oAuth2Client,data);
  });
}

/**
 * Get and store new token after prompting for user authorization, and then
 * execute the given callback with the authorized OAuth2 client.
 * @param {google.auth.OAuth2} oAuth2Client The OAuth2 client to get token for.
 * @param {getEventsCallback} callback The callback for the authorized client.
 */
function getNewToken(oAuth2Client, callback) {
  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES,
  });
  console.log('Authorize this app by visiting this url:', authUrl);
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  rl.question('Enter the code from that page here: ', (code) => {
    rl.close();
    oAuth2Client.getToken(code, (err, token) => {
      if (err) return callback(err);
      oAuth2Client.setCredentials(token);
      // Store the token to disk for later program executions
      fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
        if (err) console.error(err);
        console.log('Token stored to', TOKEN_PATH);
      });
      callback(oAuth2Client);
    });
  });
}

/**
 * Prints the names and majors of students in a sample spreadsheet:
 * @see https://docs.google.com/spreadsheets/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/edit
 * @param {OAuth2Client} auth The authenticated Google OAuth client.
 */


 
function listInstants(auth) {

  
  const sheets = google.sheets({version: 'v4', auth});
  sheets.spreadsheets.values.get({
    spreadsheetId: '___________',
    range: 'Instant!A2:E',
  }, (err, {data}) => {
    if (err) return console.log('The API returned an error: ' + err);
    const rows = data.values;

    if (rows && rows.length) {
      
      // Print columns A and D, which correspond to indices 0 and 3.
      rows.map((row) => {
        //console.log(`${row[0]}, ${row[4]}`);
        //time_stamp	voltage	current	fuel_volume
        console.log(`
          time_stamp : ${row[0]}
          voltage : ${row[1]}
          current : ${row[2]}
          fuel_volume : ${row[3]}
        `);
      })
    } else {
      console.log('No data found.');
    }
  });
}

function addInstantRow(auth,values){

  console.log( "data",values);

  const sheets = google.sheets({version: 'v4', auth});

  sheets.spreadsheets.values.append({
    spreadsheetId: '___________',
    range: 'Instant!A2:E',
    valueInputOption: "USER_ENTERED",
    resource: {
      values: [ values ]
    }
  }, (err, {data}) => {
    if (err) return console.log('The API returned an error: ' + err);
    const rows = data.values;

    if (rows && rows.length) {
      
      // Print columns A and D, which correspond to indices 0 and 3.
      rows.map((row) => {
        //console.log(`${row[0]}, ${row[4]}`);
        //time_stamp	voltage	current	fuel_volume
        console.log(`
          time_stamp : ${row[0]}
          voltage : ${row[1]}
          current : ${row[2]}
          fuel_volume : ${row[3]}
        `);
      })
    } else {
      console.log('No data found.');
    }
  });
}

//authorize(secret_json, listInstants)

function list(){
  authorize(secret_json, listInstants);
}

function write(data){
  console.log('write');
  authorize(secret_json, addInstantRow,data );
}

module.exports = {
  listInstants:list,
  addInstantRow:write
};