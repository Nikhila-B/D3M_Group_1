const express = require('express');
const bodyParser = require('body-parser');

// import our routes
const user = require('./routes/user');
const admin = require('./routes/admin');

// create app server
let app = express();

// middleware to parse request info into JSON
app.use(bodyParser.urlencoded({extended: false})); // application/x-www-form-urlencoded
app.use(bodyParser.json()); // application/json

// use our routes
app.use('/user', user);
app.use('/admin', admin);

// start listening for requests
app.listen(3000, () => {
    console.log("Listening on port 3000");
});