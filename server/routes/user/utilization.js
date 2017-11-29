const sql = require('mssql');

let router = require('express').Router();

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
        .then(result => {

            let data = {};

            result.recordset.forEach(row => {
                if (data[row['treatmentName']] == null) {
                    data[row['treatmentName']] = {
                        name: row['treatmentName']
                    };
                }

                let roundedMinutes = Math.round(row['totalTime'] * 100) / 100;
                data[row['treatmentName']][row['Job Cadre']] = roundedMinutes;
            });

            data = Object.keys(data).map(name => data[name]);
            res.json(data);
        })
        .catch(err => res.status(500).json(err));
});



module.exports = router;