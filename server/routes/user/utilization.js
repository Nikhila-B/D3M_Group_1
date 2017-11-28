const sql = require('mssql');

let router = require('express').Router();


/**  Please find the chart here
 * http://jsfiddle.net/dfnt777s/ */
router.post('/', (req, res) => {

    //sample test data
    const data = [
          {name: 'Page A', uv: 4000, female: 2400, male: 2400},
          {name: 'Page B', uv: 3000, female: 1398, male: 2210},
          {name: 'Page C', uv: 2000, female: 9800, male: 2290},
          {name: 'Page D', uv: 2780, female: 3908, male: 2000},
          {name: 'Page E', uv: 1890, female: 4800, male: 2181},
          {name: 'Page F', uv: 2390, female: 3800, male: 2500},
          {name: 'Page G', uv: 3490, female: 4300, male: 2100},
    ];
    // TODO pass it on a res.json object
  
});

/*
---------- get the data for a stacked bar chart together
---------- x-axis = will have the treatments
---------- y - axis = will have the time ( color stacks for cadres)
*/
router.get('/StackedBarcharts', (req, res) => {
    new sql.Request()
        .query(`Select temp.Treatment as treatmentName, temp.[Job Cadre], SUM(temp.MinutesPerPatient) as totalTime
        from (select t.Treatment, c.[Job Cadre], tt.MinutesPerPatient, tt.Task
        from [dbo].[Treatments] t, [dbo].[TreatmentSteps] ts, [dbo].[Cadre] c, [dbo].[TimeOnTask] tt
        where ts.TreatmentId = t.Id AND ts.CadreId = c.Id AND ts.TaskId = tt.Id) AS temp
        GROUP BY temp.Treatment, temp.[Job Cadre]`)
        .then(result => res.json(result.recordset))
        .catch(err => res.sendStatus(500));
});





module.exports = router;