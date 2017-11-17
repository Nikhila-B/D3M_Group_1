const sql = require('mssql');

const workforceRoute = require('./user/workforce');
const predictiveRoute = require('./user/predictive')

let router = require('express').Router();

// get list of facilities
router.get('/facilities', (req, res) => {
    new sql.Request()
        .query('SELECT Id AS id, Name AS name FROM Facilities')
        .then(result => res.json(result.recordset))
        .catch(err => res.sendStatus(500));
});

// get list of cadres
router.get('/cadres', (req, res) => {
    new sql.Request()
        .query('SELECT Id AS id, [Job Cadre] AS name FROM Cadre')
        .then(result => res.json(result.recordset))
        .catch(err => res.sendStatus(500));
});

// analytics
router.use('/workforce', workforceRoute);
router.use('/predictive', predictiveRoute);

module.exports = router;