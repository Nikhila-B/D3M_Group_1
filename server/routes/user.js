const express = require('express');
const mssql = require('mssql');

const dbconfig = require('../dbconfig');

let router = express.Router();

mssql.connect(dbconfig).then(pool => {
    return pool.request()
        .query('SELECT * FROM Facilities')
}).then(result => {
    console.log(result);
    console.log(result.recordset[0].Name)
    
}).catch(err => console.log(err));

// example: HTTP GET
router.get('/facilities', (req, res) => {
    // get list of facilities
    let facilities = ['A', 'B'];

    // send facilities
    res.json(facilities)
});

router.get('/cadres', (req, res) => {
    let cadres = ['Doctor', 'Nurse', 'Midwife', 'LPN'];

    res.json(cadres);
})

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