const express = require('express');
const sql = require('mssql');

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


router.post('/workforce', (req, res) => {

    /* what req.body looks like:
        { facilityId: '7',
          cadres: { '0': 40, '1': 50, '2': 35 },
          percentageAdminHours: 30 }
    */

    let treatmentsQuery = `SELECT Id, Ratio FROM Treatments`;
    let patientCountQuery = `SELECT TreatmentId, SUM(Patients) AS PatientCount FROM DHIS2 WHERE FacilityId = @FacilityId GROUP BY TreatmentId`;
    let timePerTreatmentQuery = `SELECT TreatmentId, CadreId, SUM(MinutesPerPatient) AS TreatmentTime FROM TreatmentSteps INNER JOIN TimeOnTask ON TreatmentSteps.TaskId = TimeOnTask.Id GROUP BY TreatmentId, CadreId`;

    new sql.Request()
        .input('FacilityId', sql.Int, req.body.facilityId)
        .query(`${treatmentsQuery}; ${patientCountQuery}; ${timePerTreatmentQuery};`)
        .then(result => {

            let treatmentsQueryResult = result.recordsets[0];

            let patientCountQueryResult = result.recordsets[1];
            // convert results from query into a dictionary from an array
            let patientsPerTreatment = {}
            patientCountQueryResult.forEach(row => {
                patientsPerTreatment[row['TreatmentId']] = row['PatientCount'];
            });

            //
            let timePerTreatmentQueryResult = result.recordsets[2]

            let workersNeeded = {};
            Object.keys(req.body.cadres).forEach(cadreId => {
                let timesPerTreatment = timePerTreatmentQueryResult.filter(val => { return val['CadreId'] == cadreId })

                let totalHoursNeeded = 0; // This should be per year for all treatments
                timesPerTreatment.forEach(row => {
                    totalHoursNeeded += (row['TreatmentTime'] / 60) * patientsPerTreatment[row['TreatmentId']];
                });

                let hoursAWeek = req.body.cadres[cadreId] * (1 - (req.body.percentageAdminHours / 100));
                let hoursAYear = hoursAWeek * 52;

                workersNeeded[cadreId] = totalHoursNeeded / hoursAYear;
            });

            res.json(workersNeeded);
        }).catch(err => console.log(err));
});


module.exports = router;