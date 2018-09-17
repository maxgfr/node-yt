var express = require('express');
var router = express.Router();
var ytapi = require('../src/ytapi.js');

/* GET home page. */
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
    console.log(req.query.id_channel);
    ytapi.readSecretJSON()
        .then(function (credentials) {
             //console.log(credentials);
             ytapi.authorize(credentials)
                .then(function (token) {
                  console.log('TOKEN : ',token);
                  ytapi.getChannel(credentials, req.query.id_channel,token)
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
