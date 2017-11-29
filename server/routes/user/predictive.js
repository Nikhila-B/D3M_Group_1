const sql = require('mssql');
const base64url = require('base64-url')

const LinearRegression = require('./predictive-lib/linear_regression').LinearRegression;
const euclideanDistance = require('./predictive-lib/distance').euclidean;
const KMeans = require('./predictive-lib/k_means').KMeans;

var years = [2000, 2001, 2002, 2003, 2004, 2005, 2006, 2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016]
let router = require('express').Router();

// get list of indicators
router.get('/lrcharts/indicators', (req, res) => {
    new sql.Request()
        .query(`SELECT k.tagword, t.[Indicator Name] as indicator
                FROM [dbo].[keyWords] k, (select * from [dbo].[WDIData] where [Country Code] = 'UGA') as t
                WHERE t.[Indicator Name] LIKE '%'+ k.tagword +'%';`)
        .then(result => {
            // group all the indicators by tagword
            let tagwords = {};
            result.recordset.forEach(row => {
                if(tagwords[row['tagword']] == null) {
                    tagwords[row['tagword']] = [];
                }
                tagwords[row['tagword']].push(row['indicator']);
            });

            res.json(tagwords);
        }).catch(err => res.status(500).json(err));
});


/*get all the rows/relevant records related to healthcare categories for LR chart
------ x-axis = will be years [2000 - 2016] | predict[upto 2020] : FIXED
------ y-axis = will be the numbers values : need to edit */
router.get('/lrcharts/:indicator', (req, res) => {
    let indicator = base64url.decode(req.params.indicator);

    new sql.Request()
        .input('Indicator', sql.NVarChar, indicator)
        .query(`SELECT [2000], [2001], [2002], [2003], [2004],
                    [2005], [2006], [2007], [2008],[2009], [2010],
                    [2011], [2012], [2013], [2014], [2015], [2016] FROM WDIData 
                WHERE [Country Code] = 'UGA' 
                    AND [Indicator Name] = @Indicator`)
        .then(result => {

            let data = result.recordset[0];

            // remove zero value/ years
            var available_years = [] // x-axis
            var available_value = [] // y-axis
            for(var i = 0; i < years.length; i++){
                if(data[''+str(years[i])+ ''] != 0){
                    available_years.push(years[i])
                    available_value.push(data[''+str(years[i])+ ''])
                }
            }
          
            // Initialize and train the linear regression
            var lr = new LinearRegression(available_years, available_value);
            lr.train(function (err) {
                if (err) {
                    console.log('error', err);
                    process.exit(2);
                }
            });

            // Use the linear regression function to get a set of data to graph the linear regression line
            var y2 = [];
            x2 = [2017, 2018, 2019, 2020]
            x2.forEach(function (xi) {
                y2.push(lr.predict(xi));
            });
        
            res.json({
                series1: {
                    x: available_years,
                    y: available_value
                },
                series2: {
                    x: x2,
                    y: y2
                }
                
            });

        }).catch(err => console.log(err))
});


module.exports = router;