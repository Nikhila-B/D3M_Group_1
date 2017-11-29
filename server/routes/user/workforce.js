const sql = require('mssql');

let router = require('express').Router();

router.post('/', (req, res) => {
    
    /* what req.body looks like:
        { facilityId: '8',
  cadres:
   { '1': { hours: 40, adminPercentage: 17 },
     '2': { hours: 43, adminPercentage: 15 } },
  treatments:
   { '1': true,
     '2': false,
     '3': true,
     '15': true,
     '16': true,
     '17': true,
     '18': true } }
    */

    let treatmentsQuery = `SELECT Id, Ratio FROM Treatments`;
    let patientCountQuery = `SELECT TreatmentId, SUM(Patients) AS PatientCount 
                                FROM DHIS2
                                WHERE CONCAT([Year], [QUARTER])=ANY(SELECT DISTINCT TOP 4 CONCAT([Year], [Quarter]) FROM DHIS2 WHERE FacilityId=@FacilityId ORDER BY CONCAT([Year], [QUARTER]) DESC)
                                    AND FacilityId=@FacilityId
                                GROUP BY TreatmentId`;
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

            let timePerTreatmentQueryResult = result.recordsets[2]

            // set to zero if treatment has no patients
            treatmentsQueryResult.forEach(row => {
                if (!patientsPerTreatment[row['Id']]) {
                    patientsPerTreatment[row['Id']] = 0
                }
            });

            let workersNeeded = {};
            Object.keys(req.body.cadres).forEach(cadreId => {
                let timesPerTreatment = timePerTreatmentQueryResult.filter(val => val['CadreId'] == cadreId)

                let totalHoursNeeded = 0; // This should be per year for all treatments
                timesPerTreatment.forEach(row => {
                    totalHoursNeeded += (row['TreatmentTime'] / 60) * patientsPerTreatment[row['TreatmentId']];
                });

                // input parameters
                let cadreHours = req.body.cadres[cadreId].hours;
                let cadreAdminPercentage = req.body.cadres[cadreId].adminPercentage;

                let hoursAWeek = cadreHours * (1 - (cadreAdminPercentage / 100));
                let hoursAYear = hoursAWeek * 52;

                workersNeeded[cadreId] = totalHoursNeeded / hoursAYear;
            });

            res.json(workersNeeded);
        }).catch(err => res.status(500).json(err));
});


module.exports = router;