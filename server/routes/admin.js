const express = require('express');
const sql = require('mssql');

let router = express.Router();

// get list of treatments and the task names it has
router.get('/treatments', (req, res) => {
    new sql.Request()
        .query('SELECT Treatments.Id, Treatment, Task FROM TreatmentSteps INNER JOIN TimeOnTask ON TreatmentSteps.TaskId = TimeOnTask.Id RIGHT OUTER JOIN Treatments ON TreatmentSteps.TreatmentId = Treatments.Id')
        .then(results => {
            let treatments = {};

            results.recordset.forEach(row => {
                if (treatments[row['Id']]) {
                    treatments[row['Id']].tasks.push(row['Task']);
                } else {
                    treatments[row['Id']] = {
                        treatment: row['Treatment'],
                        tasks: row['Task'] ? [row['Task']] : []
                    };
                }
            });

            res.json(treatments);
        })
        .catch(err => res.sendStatus(500));
});



// add a new treatment
router.post('/treatments', (req, res) => {
    new sql.Request()
        .input('Treatment', sql.NVarChar, req.body.name)
        .query('INSERT INTO Treatments (Treatment, Ratio) VALUES (@Treatment, 1); SELECT * FROM Treatments WHERE Id = SCOPE_IDENTITY()')
        .then(results => res.json(results.recordset[0]))
        .catch(err => res.sendStatus(500));
});

// delete treatment
router.delete('/treatments/:id', (req, res) => {
    new sql.Request()
        .input('Id', sql.Int, req.params.id)
        .query('DELETE FROM Treatments WHERE Id=@Id')
        .then(results => {
            res.sendStatus(200);
        })
        .catch(err => res.sendStatus(500));
});

// tasks

// get all the tasks
router.get('/tasks', (req, res) => {
    new sql.Request()
        .query(`SELECT * FROM TimeOnTask`)
        .then(results => {
            // convert to a dictionary instead of array
            let tasks = {}
            results.recordset.forEach(row =>
                tasks[row['Id']] = { task: row['Task'], minutesPerPatient: ['MinutesPerPatient'] }
            );

            res.json(tasks);
        })
        .catch(err => res.sendStatus(500));
});

// add a new task
router.post('/task', (req, res) => {
    new sql.Request()
        .input('Task', sql.NVarChar, req.body.task)
        .input('MinutesPerPatient', sql.Float, req.body.minutesPerPatient)
        .query(`INSERT INTO TimeOnTask (Task, MinutesPerPatient) VALUES (@Task, @MinutesPerPatient);
                SELECT * FROM TimeOnTask WHERE Id = SCOPE_IDENTITY()`)
        .then(results => res.json(results.recordset[0]))
        .catch(err => res.sendStatus(500));
});

// steps //


// detailed list of steps for treatment
router.get('/:treatmentId/steps', (req, res) => {
    new sql.Request()
        .input('Id', sql.Int, req.params.treatmentId)
        .query(`SELECT TreatmentSteps.Id, TaskId, Task, CadreId, MinutesPerPatient FROM TreatmentSteps 
                    INNER JOIN TimeOnTask ON TreatmentSteps.TaskId = TimeOnTask.Id
                    WHERE TreatmentSteps.TreatmentID=@Id`)
        .then(results => res.json(results.recordset))
        .catch(err => res.sendStatus(500));
});

// add new step to treatment
router.post('/:treatmentId/steps', (req, res) => {
    new sql.Request()
        .input('TreatmentId', sql.Int, req.params.treatmentId)
        .input('TaskId', sql.NVarChar, req.body.taskId)
        .input('CadreId', sql.Int, req.body.cadreId)
        .query(`INSERT INTO TreatmentSteps (TreatmentId, TaskId, CadreId) VALUES (@TreatmentId, @TaskId, @CadreId);
                SELECT TreatmentSteps.Id, TaskId, Task, CadreId, MinutesPerPatient FROM TreatmentSteps 
                    INNER JOIN TimeOnTask ON TreatmentSteps.TaskId = TimeOnTask.Id
                    WHERE TreatmentSteps.Id = SCOPE_IDENTITY()`)
        .then(results => res.json(results.recordset[0]))
        .catch(err => res.sendStatus(500));
});

/* update step
router.patch('/:treatmentId/steps/:stepId', (req, res) => {
    console.log(req.params); // = { treatmentId: 2, taskId: 3 }

});*/

// delete step
router.delete('/:treatmentId/steps/:stepId', (req, res) => {
    new sql.Request()
        .input('Id', sql.Int, req.params.stepId)
        .query(`DELETE FROM TreatmentSteps WHERE Id = @Id`)
        .then(() => res.sendStatus(200))
        .catch(err => res.sendStatus(500));
});

module.exports = router;