var fs = require('fs');
var readline = require('readline');
var {google} = require('googleapis');
var OAuth2 = google.auth.OAuth2;

// If modifying these scopes, delete your previously saved credentials at ~/.credentials/google-apis-nodejs-quickstart.json
var SCOPES = ['https://www.googleapis.com/auth/youtube.force-ssl']
var TOKEN_DIR = './.credentials/';
var TOKEN_PATH = TOKEN_DIR + 'google-apis-nodejs-quickstart.json';

exports.readSecretJSON = function() {
    return new Promise(function (resolve, reject) {
        fs.readFile('client_secret.json', function processClientSecrets(err, content) {
          if (err) {
            console.log('Error loading client secret file: ' + err);
            reject(err);
          }
           resolve(JSON.parse(content));
        });
    });
};

exports.authorize = function(credentials) {
    return new Promise(function (resolve, reject) {
        var clientSecret = credentials.installed.client_secret;
        var clientId = credentials.installed.client_id;
        var redirectUrl = credentials.installed.redirect_uris[0];
        var oauth2Client = new OAuth2(clientId, clientSecret, redirectUrl);
        fs.readFile(TOKEN_PATH, function(err, token) {
          if (err) {
            console.log('Creation of a new token!');
            var authUrl = oauth2Client.generateAuthUrl({
              access_type: 'offline',
              scope: SCOPES
            });
            //console.log('Authorize this app by visiting this url: ', authUrl);
            reject(authUrl); // send URL to the User
          }
          //console.log(JSON.parse(content));
          resolve(token);
        });
    });
};

exports.confirmToken = function(client_response, credentials) {
    var clientSecret = credentials.installed.client_secret;
    var clientId = credentials.installed.client_id;
    var redirectUrl = credentials.installed.redirect_uris[0];
    var oauth2Client = new OAuth2(clientId, clientSecret, redirectUrl);
    oauth2Client.getToken(client_response, function(err, token) {
      if (err) {
        console.log('Error while trying to retrieve access token', err);
        return;
      }
      oauth2Client.credentials = token;
      storeToken(token);
    });
};

exports.getChannel = function(credentials,username,token) {
    return new Promise(function (resolve, reject) {
        var clientSecret = credentials.installed.client_secret;
        var clientId = credentials.installed.client_id;
        var redirectUrl = credentials.installed.redirect_uris[0];
        var oauth2Client = new OAuth2(clientId, clientSecret, redirectUrl);
        oauth2Client.credentials = JSON.parse(token);
        var service = google.youtube('v3');
        service.channels.list({
            auth: oauth2Client,
            part: 'snippet,contentDetails,statistics',
            forUsername: username
        }, function(err, response) {
            if (err) {
                //console.log('The API returned an error: ' + err);
                reject(err);
            }
            var channels = response.data.items;
            if (channels.length == 0) {
              //console.log('No channel found.');
              reject('No channel found.');
            } else {
              /*console.log('This channel\'s ID is %s. Its title is \'%s\', and ' +
                          'it has %s views.',
                          channels[0].id,
                          channels[0].snippet.title,
                          channels[0].statistics.viewCount);*/
              resolve(channels);
            }
        });
    });
};

exports.playlistsListByChannelId = function(credentials,requestData,token) {
    return new Promise(function (resolve, reject) {
        var clientSecret = credentials.installed.client_secret;
        var clientId = credentials.installed.client_id;
        var redirectUrl = credentials.installed.redirect_uris[0];
        var oauth2Client = new OAuth2(clientId, clientSecret, redirectUrl);
        oauth2Client.credentials = JSON.parse(token);
        var service = google.youtube('v3');
        var parameters = removeEmptyParameters(requestData['params']);
        parameters['auth'] = oauth2Client;
        service.playlists.list(parameters, function(err, response) {
          if (err) {
            //console.log('The API returned an error: ' + err);
            reject(err);
          }
          //console.log(response.data);
          resolve(response.data);
        });
    });
};


exports.uploadByChannelId = function(credentials,requestData,token) {
    return new Promise(function (resolve, reject) {
        var clientSecret = credentials.installed.client_secret;
        var clientId = credentials.installed.client_id;
        var redirectUrl = credentials.installed.redirect_uris[0];
        var oauth2Client = new OAuth2(clientId, clientSecret, redirectUrl);
        oauth2Client.credentials = JSON.parse(token);
        var service = google.youtube('v3');
        var parameters = removeEmptyParameters(requestData['params']);
        parameters['auth'] = oauth2Client;
        service.channels.list(parameters, function(err, response) {
          if (err) {
            //console.log('The API returned an error: ' + err);
            reject(err);
          }
          //console.log(response.data);
          resolve(response.data);
        });
    });
};

/**
 * Store token to disk be used in later program executions.
 *
 * @param {Object} token The token to store to disk.
 */
function storeToken(token) {
  try {
    fs.mkdirSync(TOKEN_DIR);
  } catch (err) {
    if (err.code != 'EEXIST') {
      throw err;
    }
  }
  fs.writeFile(TOKEN_PATH, JSON.stringify(token));
  console.log('Token stored to ' + TOKEN_PATH);
}

/**
 * Remove parameters that do not have values.
 *
 * @param {Object} params A list of key-value pairs representing request
 *                        parameters and their values.
 * @return {Object} The params object minus parameters with no values set.
 */
function removeEmptyParameters(params) {
  for (var p in params) {
    if (!params[p] || params[p] == 'undefined') {
      delete params[p];
    }
  }
  return params;
}
