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

const sql = require('mssql');
// example: HTTP POST
router.post('/workforce', (req, res) => {

    console.log(req.body);
    /* what req.body looks like:
        { facilityId: '7',
          cadres: { '0': 40, '1': 50, '2': 35 },
          percentageAdminHours: 30 }
  */



    let workersNeeded = {};

    sql.query`SELECT Id, Ratio FROM Treatments; SELECT TreatmentId, SUM(Patients) FROM DHIS2 WHERE FacilityId = ${req.body.facilityId} GROUP BY TreatmentId;`
        .then(result => console.log(result));

    // calculate for each cadre
    Object.keys(req.body.cadres).forEach(cadreId => {

        
            let treatments = {};
            let timePerTreatment = {};
            let patientsPerTreatment = {};

            sql.query`SELECT TreatmentId, SUM(MinutesPerPatient) FROM TreatmentSteps INNER JOIN TimeOnTask ON TreatmentSteps.TaskId = TimeOnTask.Id WHERE CadreId = ${cadreId} GROUP BY TreatmentId`
                .then(result => console.log(result));


          /*  return pool.request()
                .query('SELECT Id, Ratio FROM Treatments')
                .then(result => {

                    console.log(result);
                    
                   
                }).then(result => {

                    console.log(result);

                }).then(result => {

                    console.log(result);
                }).then(() => {
                    res.json({ workersNeeded: 0 })
                });*/
        //}).then(result => console.log(result));

    });
});


module.exports = router;