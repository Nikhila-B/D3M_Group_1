const express = require('express');

const dbconn = require('../dbconn');

let router = express.Router();


// example: HTTP GET /api/user/facilites
router.get('/facilities', (req, res) => {
    // get list of facilities
    dbconn.then(pool => {
        return pool.request()
            .query('SELECT Id, Name FROM Facilities')
    }).then(result => {
        let facilities = [];

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
    // get list of cadres
    dbconn.then(pool => {
        return pool.request()
            .query('SELECT Id, [Job Cadre] FROM Cadre')
    }).then(result => {
        let cadres = [];

        result.recordset.forEach(record => {
            cadres.push({
                id: record.Id,
                name: record['Job Cadre']
            });
        });

        // send facilities
        res.json(cadres)
    });
});

// example: HTTP POST
router.post('/workforce', (req, res) => {

    console.log(req.body);
    /* what req.body looks like:
        { facilityId: '7',
          cadres: { '0': 40, '1': 50, '2': 35 },
          percentageAdminHours: 30 }
  */

    // right now just calculate for AIDS, so get tasks and treatments for that
    dbconn.then(pool => {
        return pool.request()
            .query('SELECT * FROM Treatments')
            .then(result => {
                console.log(result);

                return pool.request()
                    .query('SELECT * FROM TreatmentSteps');
            }).then(result => {
                console.log(result);
            });
    });
    // get time for each task

    // calcualte

    let workersNeeded = 0;

    // get number of the workers at that facility to compare
    // SELECT COUNT(Id) FROM iHRIS WHERE FacilityId='2'

    res.json({ workersNeeded: workersNeeded })

});


module.exports = router;