var http        = require('http');
var bodyParser  = require('body-parser');
var express     = require('express');
var ppRouter    = require('./productServiceRouter');
var loginService   = require('./loginService');

var app         = express();

// use body parser so we can get info from POST and/or URL parameters
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use('/login',loginService.login);
app.use('/register',loginService.register);
app.use('/pp', ppRouter.router);
var port = 8000; // used to create, sign, and verify tokens
app.listen(port);

console.log("server started on port 8001");