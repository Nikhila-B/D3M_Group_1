const express = require('express');
const sql = require('mssql');

let router = express.Router();

// get list of treatments and the task names it has
router.get('/treatments', (req, res) => {
    new sql.Request()
        .query('SELECT Id, Treatment From Treatments')
        .then(results => {
            console.log(results);
            res.json({});
        });
});

// add a new treatment
router.post('/treatments', (req, res) => {
    new sql.Request()
        .input('Treatment', sql.NVarChar, req.body.name)
        .query('INSERT INTO Treatments (Treatment, Ratio) VALUES (@Treatment, 1)')
        .then(results => {
            console.log(results);
            res.json({});
        });
});

// delete treatment
router.delete('/treatments/:id', (req, res) => {
    new sql.Request()
        .input('Id', sql.Int, req.params.id)
        .query('DELETE FROM Treatments WHERE Id=@Id')
        .then(results => {
            console.log(results);
            res.json({});
        });
});

// tasks

// detailed list of tasks for treatment
router.get('/:treatmentId/tasks', (req, res) => {

});

// add new task to treatment
router.post('/:treatmentId/tasks',  (req, res) => {

});

// update task
router.patch('/:treatmentId/tasks/:taskId', (req, res) => {
    console.log(req.params); // = { treatmentId: 2, taskId: 3 }

}); 

// delete task
router.delete('/:treatmentId/tasks/:taskId', (req, res) => {
    console.log(req.params); // = { treatmentId: 2, taskId: 3 }

}); 

module.exports = router;