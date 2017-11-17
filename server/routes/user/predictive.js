const sql = require('mssql');

const LinearRegression = require('./predictive-lib/linear_regression').LinearRegression;
const euclideanDistance = require('./predictive-lib/distance').euclidean;
const KMeans = require('./predictive-lib/k_means').KMeans;


let router = require('express').Router();

router.post('/', (req, res) => {

    // test data from Uganda -
    var x = [2000, 2001, 2002, 2003, 2004, 2005, 2006, 2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016];
    var y = [0, 1, 1, 2, 4, 8, 8, 9, 13, 16, 20, 24, 33, 44, 55, 60, 67];

    // Initialize and train the linear regression
    var lr = new LinearRegression(x, y);
    lr.train(function (err) {
        if (err) {
            console.log('error', err);
            process.exit(2);
        }
    });


    var y_1 = [];
    x.forEach(function (xi) {
        y_1.push(lr.predict(xi));
    });

    // Use the linear regression function to get a set of data to graph the linear regression line
    var y2 = [];
    x2 = [2017, 2018, 2019, 2020]
    x2.forEach(function (xi) {
        y2.push(lr.predict(xi));
    });

    // example
    res.json({
        series1: {
            x: x,
            y: y
        },
        series2: {
            x: x2,
            y2: y2
        }
    });
});

module.exports = router;