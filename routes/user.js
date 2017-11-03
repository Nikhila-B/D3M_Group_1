const express = require('express');

let router = express.Router();


// example: HTTP GET
router.get('/facilities', (req, res) => {
    // get list of facilities
    let facilities = ['A', 'B'];

    // send facilities
    res.send(facilities)
});

// example: HTTP POST
router.post('/workforce', (req, res) => {

    let facilityId = req.body.facilityId;

    // make sure Id is valid
    if(Number.isInteger(facilityId)) {
        // perform calculations
        res.send({ workersNeeded: 100000000 });
    } else {
        // bad request
        res.sendStatus(400); // bad request http status code
    }
});


module.exports = router;