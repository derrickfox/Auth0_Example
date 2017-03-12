/*
Start start app:
1. Navigate to '/server'
2. Command line$ node index.js
3. Server should be running on localhost:3001
4. Navigate to '/'
5. Command line$ http-server
6. App should be running on localhost:8080
 */


'use strict';

var express = require('express');
var app = express();
var jwt = require('express-jwt');
var cors = require('cors');

app.use(cors());


// Setting up Middleware here...

var authCheck = jwt({
    // TODO Configure Me or I Won't Work!!
    secret: new Buffer('the secret from manage.auth0.com'),
    audience: 'the audience from manage.auth0.com'
});

// ... middleware finished here.

app.get('/api/public', function (req, res) {
    res.json({message: "Hello from a public endpoint. No Auth Needed...yay"});
});

app.get('/api/private', authCheck, function (req, res) {
    console.log(req);
    res.json({message: "Hello from a private endpoint. You need to be authenticated"});
});

app.listen(3001);
console.log('Listening on http://localhost: 3001');