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

    let treatmentIds = Object.keys(req.body.treatments).filter(id => req.body.treatments[id]);


    // queries
    let treatmentsQuery = `SELECT Id, Ratio FROM Treatments`;
    let patientCountQuery = `SELECT TreatmentId, SUM(Patients) AS PatientCount FROM DHIS2
                                WHERE CONCAT([Year], [QUARTER])=ANY(SELECT DISTINCT TOP 4 CONCAT([Year], [Quarter]) FROM DHIS2 WHERE FacilityId=@FacilityId ORDER BY CONCAT([Year], [QUARTER]) DESC)
                                    AND FacilityId=@FacilityId
                                GROUP BY TreatmentId`;
    let timePerTreatmentQuery = `SELECT TreatmentId, CadreId, SUM(MinutesPerPatient) AS TreatmentTime FROM TreatmentSteps INNER JOIN TimeOnTask ON TreatmentSteps.TaskId = TimeOnTask.Id GROUP BY TreatmentId, CadreId`;
    let facilityStaffCountQuery = `SELECT CadreId, COUNT(*) AS StaffCount FROM dbo.iHRIS
                                    WHERE ([Employee Status] = N'Employee') 
                                        AND (CadreId IS NOT NULL) 
                                        AND FacilityId=@FacilityId
                                    GROUP BY CadreId`;

    new sql.Request()
        .input('FacilityId', sql.Int, req.body.facilityId)
        .query(`${treatmentsQuery}; ${patientCountQuery}; ${timePerTreatmentQuery}; ${facilityStaffCountQuery};`)
        .then(result => {
            let treatmentsQueryResult = result.recordsets[0];

            let patientCountQueryResult = result.recordsets[1];
            // convert results from query into a dictionary from an array
            let patientsPerTreatment = {}
            patientCountQueryResult.forEach(row => {
                patientsPerTreatment[row['TreatmentId']] = row['PatientCount'];
            });

            let timePerTreatmentQueryResult = result.recordsets[2];

            // set to zero if treatment has no patients
            treatmentsQueryResult.forEach(row => {
                if (!patientsPerTreatment[row['Id']]) {
                    patientsPerTreatment[row['Id']] = 0
                }
            });

            let workersNeededPerTreatment = {};
            Object.keys(req.body.cadres).forEach(cadreId => {
                treatmentsQueryResult.forEach(treatmentRow => {
                    let treatmentId = treatmentRow['Id'];

                    let timePerPatient = timePerTreatmentQueryResult.filter(val =>
                        val['CadreId'] == cadreId && val['TreatmentId'] == treatmentId);
                    if (timePerPatient[0] == null) {
                        timePerPatient = 0;
                    } else {
                        timePerPatient = timePerPatient[0]['TreatmentTime'];
                    }

                    totalHoursForTreatment = (timePerPatient / 60) * patientsPerTreatment[treatmentId];


                    // input parameters
                    let cadreHours = req.body.cadres[cadreId].hours;
                    let cadreAdminPercentage = req.body.cadres[cadreId].adminPercentage;

                    let hoursAWeek = cadreHours * (1 - (cadreAdminPercentage / 100));
                    let hoursAYear = hoursAWeek * 52;

                    if (workersNeededPerTreatment[cadreId] == null) {
                        workersNeededPerTreatment[cadreId] = {};
                    }

                    workersNeededPerTreatment[cadreId][treatmentId] = totalHoursForTreatment / hoursAYear;
                });
            });

            // sum workers needed for only selected treatments
            let workersNeeded = {};
            Object.keys(workersNeededPerTreatment).forEach(cadreId => {
                workersNeeded[cadreId] = 0;
                treatmentIds.forEach(treatmentId =>
                    workersNeeded[cadreId] += workersNeededPerTreatment[cadreId][treatmentId]
                )
            });

            /******* calculate workforce pressure ***************/
            // step 1: normalize ratio values
            let ratioSum = 0;
            treatmentsQueryResult.forEach(row => ratioSum += row['Ratio']);
            let normalizedRatios = {};
            treatmentsQueryResult.forEach(row =>
                normalizedRatios[row['Id']] = row['Ratio'] / ratioSum
            );
            // step 2: determine current workforce dedicated to each treatment
            let workersPerTreatment = {};
            result.recordsets[3].forEach(row => {
                workersPerTreatment[row['CadreId']] = {};
                Object.keys(normalizedRatios).forEach(treatmentId => {
                    workersPerTreatment[row['CadreId']][treatmentId] = row['StaffCount'] * normalizedRatios[treatmentId];
                });
            });
            // step 3: calculate pressure, but only for the selected treatments
            let pressure = {}
            Object.keys(workersPerTreatment).forEach(cadreId => {
                let workers = 0;
                treatmentIds.forEach(treatmentId => {
                    workers += workersPerTreatment[cadreId][treatmentId];
                });
                pressure[cadreId] = workers / workersNeeded[cadreId];
            });
            
            res.json({
                workersNeeded: workersNeeded,
                pressure: pressure
            });
        }).catch(err => res.status(500).json(err));
});


module.exports = router;