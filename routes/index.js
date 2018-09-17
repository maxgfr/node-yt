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
    ytapi.confirmToken(req.body.)
});
module.exports = router;
