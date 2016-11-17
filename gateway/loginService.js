/**
 * Created by bthiru on 11/17/2016.
 */

var jwt         = require('jsonwebtoken'); // used to create, sign, and verify tokens
var config      = require('./config'); // get our config file
var request     = require('request');

var login = function(req,res){
    var user_id = req.param('id');
    var pwd     = req.param('pwd');
    console.log('user_id'+user_id)
    var options = {
        uri : 'http://localhost:8080/authenticate?id='+user_id+'&pwd='+pwd+'',
        method : 'GET'
    };
    request(options, function (error, response, body) {
        if (!error && response.statusCode == 200 && response.body !='false' ) {
            console.log("success"+response.body);
            var user = JSON.parse(response.body);
            var token = jwt.sign({ user: user.user_name, iat: Math.floor(Date.now() / 1000) - 30 }, config.secret);

            // return the information including token as JSON
            res.json({
                success: true,
                message: 'token generated Successfully!',
                token: token
            });
        }
        else {
            res.json({
                success: failed,
                message: 'token could not generated !'
            });
        }
    });
}

exports.login = login;
