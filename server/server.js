const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

// import our routes
const user = require('./routes/user');
const admin = require('./routes/admin');

// create app server
let app = express();

// middleware to parse request info into JSON
app.use(bodyParser.urlencoded({ extended: false })); // application/x-www-form-urlencoded
app.use(bodyParser.json()); // application/json

// serve static files in public folder
app.use(express.static(path.join(__dirname, "../", "public")));

// use our routes
app.use('/api/user', user);
app.use('/api/admin', admin);

// instead of 404, redirect to index page
app.use('*', (req, res) => {
    res.redirect('/');
})

// start listening for requests
app.listen(3000, () => {
    console.log("Listening on port 3000");
});
