//https://github.com/luccastera/shaman : GitHub Repo Reference
// https://plot.ly/javascript/reference/#scatter : plotly options

var LinearRegression = require('../index').LinearRegression;
var _ = require('underscore');
var apiKey = 'CsOcANaMMMKqbzHRj6F2'//process.env.PLOTLY_API_KEY;
var username ='nbalaji'; //process.env.PLOTLY_USERNAME;
var plotly = require('plotly')(username,apiKey);

// test data from Uganda -
var x = [2000, 2001, 2002, 2003, 2004, 2005, 2006, 2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016];
var y = [0,	1,	1,	2,	4,	8,	8,	9,	13,	16,	20,	24,	33,	44,	55,	60,	67]  ;

// Initialize and train the linear regression
var lr = new LinearRegression(x, y);
lr.train(function(err) {
  if (err) {
    console.log('error', err);
    process.exit(2);
  }
});


var y_1 = [];
x.forEach(function(xi) {
   y_1.push(lr.predict(xi));
});

// Use the linear regression function to get a set of data to graph the linear regression line
var y2 = [];
x2 = [2017, 2018, 2019, 2020]
x2.forEach(function(xi) {
   y2.push(lr.predict(xi));
});

// Create scatter plots of training data + linear regression function
var layout = {
  title: 'Antiretroviral therapy coverage (% of people living with HIV)',
  xaxis: {
    title: 'Time - in Years'
  },
  yaxis: {
    title: '% of people living with HIV getting ARV Coverage'
  }
};

var trace1 = {
  x: x,
  y: y,
  mode: "markers",
  visible: "true",
  showlegend: false,
  hoverinfo: "skip",
  type: "scatter" //perhaps make this a time series
};

var trace2 = {
  x: x,
  y: y,
  name: 'Training Data - Time Series',
  mode: "lines",
  marker: {
    color: "rgb(142, 124, 195)",
    size: 2,
    line: {
      color: "black",
      width: 0.5
    }
  },
  type: "scatter"
};

var trace3 = {
  x: x2,
  y: y2,
  name: 'Prediction for next few years',
  mode: "lines",
  type: "scatter"
};

var plotData = [trace1, trace2, trace3];
var graphOptions = {layout: layout,filename: "Linear-regression-with-shaman", fileopt: "overwrite"}
      
plotly.plot(plotData, graphOptions, function (err, msg) {
  if (msg){
    console.log(msg);
    console.log('Success! The plot (' + msg.filename + ') can be found at ' + msg.url);
    process.exit();
  } else {
    console.log(err);
    process.exit(3);
  } 
});
