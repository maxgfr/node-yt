var express = require('express');
var router = express.Router();
var ytapi = require('../src/ytapi.js');

router.get('/', function(req, res, next) {
    ytapi.readSecretJSON()
        .then(function (credentials) {
             //console.log(credentials);
             ytapi.authorize(credentials)
                .then(function (token) {
                  console.log('TOKEN : ',token);
                  res.render('auth');
              })
                .catch(function (authUrl) {
                 console.log('AUTH URL : ', authUrl);
                 res.render('index', { link_to_click: authUrl});
             });
         })
        .catch(function (error) {
            console.log(error);
        });
});

router.post('/confirm_token', function(req, res, next) {
    console.log(req.body);
    ytapi.readSecretJSON()
        .then(function (credentials) {
            ytapi.confirmToken(req.body.token,credentials);
            res.render('auth');
         })
        .catch(function (error) {
            console.log(error);
        });
});

router.get('/get_channel', function(req, res, next) {
    console.log(req.query.id_chaine);
    ytapi.readSecretJSON()
        .then(function (credentials) {
             //console.log(credentials);
             ytapi.authorize(credentials)
                .then(function (token) {
                  console.log('TOKEN : ',token);
                  ytapi.getChannel(credentials, req.query.id_chaine,token)
                    .then(function (result) {
                      console.log(result);
                      res.render('resultats', { rep: result});
                  })
                    .catch(function (err) {
                      console.log(err);
                  });
              })
                .catch(function (authUrl) {
                 console.log('AUTH URL : ', authUrl);
                 res.render('index', { link_to_click: authUrl});
             });
         })
        .catch(function (error) {
            console.log(error);
        });
});

router.get('/get_info', function(req, res, next) {
    console.log(req.query.id_channel);
    ytapi.readSecretJSON()
        .then(function (credentials) {
             //console.log(credentials);
             ytapi.authorize(credentials)
                .then(function (token) {
                  console.log('TOKEN : ',token);
                  ytapi.infoByChannelId(credentials, {'params': {'id': req.query.id_channel, 'maxResults': '25','part': 'snippet,contentDetails,statistics'}},token)
                    .then(function (result) {
                      console.log(result);
                      res.render('resultats', { rep: result});
                  })
                    .catch(function (err) {
                      console.log(err);
                  });
              })
                .catch(function (authUrl) {
                 console.log('AUTH URL : ', authUrl);
                 res.render('index', { link_to_click: authUrl});
             });
         })
        .catch(function (error) {
            console.log(error);
        });
});

router.get('/get_video_playlist', function(req, res, next) {
    console.log(req.query.id_playlist);
    ytapi.readSecretJSON()
        .then(function (credentials) {
             //console.log(credentials);
             ytapi.authorize(credentials)
                .then(function (token) {
                  console.log('TOKEN : ',token);
                  ytapi.videoByChannelId(credentials, {'params': {'playlistId': req.query.id_playlist, 'maxResults': '25','part': 'snippet,contentDetails,status'}},token)
                    .then(function (result) {
                      console.log(result);
                      res.render('resultats', { rep: result});
                  })
                    .catch(function (err) {
                      console.log(err);
                  });
              })
                .catch(function (authUrl) {
                 console.log('AUTH URL : ', authUrl);
                 res.render('index', { link_to_click: authUrl});
             });
         })
        .catch(function (error) {
            console.log(error);
        });
});

module.exports = router;
