const express = require('express');

const dbconn = require('../dbconn');

let router = express.Router();


// example: HTTP GET /api/user/facilites
router.get('/facilities', (req, res) => {

    // get list of facilities
    let facilities = [];

    dbconn.then(pool => {
        return pool.request()
            .query('SELECT Id, Name FROM Facilities')
    }).then(result => {
        result.recordset.forEach(record => {
            facilities.push({
                id: record.Id,
                name: record.Name
            });
        });

        // send facilities
        res.json(facilities)
    });
});

router.get('/cadres', (req, res) => {
    let cadres = [
        {
            id: 1,
            name: 'Doctor'
        }, {
            id: 2,
            name: 'Nurse'
        }];

    res.json(cadres);
})

// example: HTTP POST
router.post('/workforce', (req, res) => {

    let facilityId = req.body.facilityId;

    // make sure Id is valid
    if (Number.isInteger(facilityId)) {
        // perform calculations
        res.send({ workersNeeded: 100000000 });
    } else {
        // bad request
        res.sendStatus(400); // bad request http status code
    }
});


module.exports = router;