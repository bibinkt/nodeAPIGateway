/**
 * Created by bthiru on 11/17/2016.
 */

var jwt         = require('jsonwebtoken'); // used to create, sign, and verify tokens
var config      = require('./config'); // get our config file
var request     = require('request');

var login = function(req,res){

    res.setHeader('Access-Control-Allow-Origin', '*');
    console.log('hiiiiiiiiii--->'+req.payload);
    var user_id = req.id;
    var pwd     = req.body.pwd;
    req.on('data', function (data) {
        // Append data.
        console.log('data22--->'+data);
        var param = JSON.parse(data);
        console.log('id--->'+param.id);
        console.log('pwd--->'+param.id);

        user_id = param.id;
        pwd =   param.pwd;

        var options = {
            uri : 'http://localhost:8080/authenticate?id='+user_id+'&pwd='+pwd+'',
            method : 'GET'
        };
        console.log(options);
        request(options, function (error, response, body) {
            console.log("success"+response.body);
            if (!error && response.statusCode == 200 && response.body !='false' ) {
                var user = JSON.parse(response.body);
                var token = jwt.sign({ user: user.user_name, iat: Math.floor(Date.now() / 1000) - 30 }, config.secret);

                // return the information including token as JSON
                return res.json({
                    success: true,
                    message: 'token generated Successfully!',
                    token: token
                });
            }
            else {
                return res.json({
                    "success": false,
                    "message": 'token could not generated !'
                });
            }
        });
    });
    req.on('end', function (data) {
        console.log('-----'+req.body.id);
    });

}

var register = function(req,res){

    res.setHeader('Access-Control-Allow-Origin', '*');
    console.log('hiiiiiiiiii--->'+req.payload);
    var user_id = req.id;
    var pwd     = req.body.pwd;
    req.on('data', function (data) {
        // Append data.
        console.log('data22--->'+data);
        var param = JSON.parse(data);
        console.log('id--->'+param.id);
        console.log('pwd--->'+param.id);

        user_id = param.id;
        pwd =   param.pwd;

        var options = {
            uri : 'http://localhost:8080/register?id='+user_id+'&pwd='+pwd+'',
            method : 'GET'
        };
        console.log(options);
        request(options, function (error, response, body) {
            console.log("success"+response.body);
            if (!error && response.statusCode == 200 && response.body !='false' ) {
                var user = JSON.parse(response.body);
                var token = jwt.sign({ user: user.user_name, iat: Math.floor(Date.now() / 1000) - 30 }, config.secret);

                // return the information including token as JSON
                return res.json({
                    success: true,
                    message: 'token generated Successfully!',
                    token: token
                });
            }
            else {
                return res.json({
                    "success": false,
                    "message": 'token could not generated !'
                });
            }
        });
    });
    req.on('end', function (data) {
        console.log('-----'+req.body.id);
    });

}
exports.register = register;
exports.login = login;
