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
        .then(results => {
            res.json(results.recordset[0]);
        })
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

// detailed list of tasks for treatment
router.get('/:treatmentId/tasks', (req, res) => {
    new sql.Request()
        .input('Id', sql.Int, req.params.treatmentId)
        .query('SELECT TaskId, Task, CadreId, MinutesPerPatient FROM TreatmentSteps INNER JOIN TimeOnTask ON TreatmentSteps.TaskId = TimeOnTask.Id WHERE TreatmentSteps.TreatmentID=@Id')
        .then(results => {
            res.json(results.recordset);
        });
});

// add new task to treatment
router.post('/:treatmentId/tasks', (req, res) => {
    new sql.Request()
        .input('Task', sql.NVarChar, req.body.taskName)
        .input('CadreId', sql.Int, req.body.cadreId)
        .input('MinutesPerPatient', sql.Float, req.body.minutesPerPatient)
        .input('TreatmentId', sql.Int, req.params.treatmentId)
        .query(`INSERT INTO TimeOnTask (Task, MinutesPerPatient) VALUES (@Task, @MinutesPerPatient); 
                INSERT INTO TreatmentSteps (TreatmentId, TaskId, CadreId) VALUES (@TreatmentId, SCOPE_IDENTITY(), @CadreId);
                SELECT TaskId, Task, CadreId, MinutesPerPatient FROM TreatmentSteps 
                    INNER JOIN TimeOnTask ON TreatmentSteps.TaskId = TimeOnTask.Id
                    WHERE TreatmentSteps.Id = SCOPE_IDENTITY()`)
        .then(results => res.json(results.recordset[0]))
        .catch(err => res.sendStatus(500));
});

// update task
router.patch('/:treatmentId/tasks/:taskId', (req, res) => {
    console.log(req.params); // = { treatmentId: 2, taskId: 3 }

});

// delete task
router.delete('/:treatmentId/tasks/:taskId', (req, res) => {
    console.log(req.params); // = { treatmentId: 2, taskId: 3 }
    new sql.Request()
        .input('TaskId', sql.Int, req.params.taskId)
        .query(`DELETE FROM TreatmentSteps WHERE`)
});

module.exports = router;