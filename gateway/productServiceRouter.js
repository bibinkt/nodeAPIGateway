/**
 * Created by bthiru on 11/17/2016.
 */
var bodyParser  = require('body-parser');
var jwt         = require('jsonwebtoken'); // used to create, sign, and verify tokens
var config      = require('./config'); // get our config file
var express     = require('express');
var request     = require('request');
var rest        = require('restler');
var async       = require('async');
var apiRoutes   = express.Router();

// API ROUTES -------------------
var serviceUrls = {};
serviceUrls.pp = 'http://localhost:8080/product';
serviceUrls.inv = 'http://localhost:8080/inventory';
serviceUrls.price = 'http://localhost:8080/price';
//----------------------------------------------------------------------
// get an instance of the router for api routes
var apiRoutes = express.Router();

// route middleware to verify a token
var router = apiRoutes.use(function(req, res, next) {
console.log("hi")
    // check header or url parameters or post parameters for token
    var token = req.body.token || req.query.token || req.headers['x-access-token'];

    // decode token
    if (token) {
        console.log('token =='+token);

        // verifies secret and checks exp
        jwt.verify(token, config.secret, function(err, decoded) {
            console.log('token decode=='+decoded);
            if (err) {
                return res.status(403).send({
                    success: false,
                    message: 'Invalid token provided.'
                });
            } else {
                // if everything is good, save to request for use in other routes
                req.decoded = decoded;
                next();
            }
        });

    } else {
        // if there is no token
        // return an error
        return res.status(403).send({
            success: false,
            message: 'No token provided.'
        });

    }
});

apiRoutes.use(function(req, res, next) {

    async.parallel([
            function(callback) {
                callRestService(serviceUrls['pp'], 'pp', callback,req);
            },
            function(callback) {
                callRestService(serviceUrls['price'], 'price', callback,req);
            }
        ],
        //callback
        function (err, results) {
            res.send(results);
        }
    );
});

function callRestService(url, serviceName, callback,req) {

    url = url +'/'+ req.param('id');
    request1 = rest.get(url);
    console.log(url);
    request1.addListener('success', function(data) {
        callback(null, data);
    });
    request1.addListener('error', function(data) {
        console.log('Error fetching [' + url + ']. Body:\n' + data);
        callback(null, ' ');
    });
}

exports.router = router;
