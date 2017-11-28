import * as React from 'react';
import { Panel, Form, FormGroup, ControlLabel, Row, FormControl, Col, Checkbox, Button } from 'react-bootstrap';
import {BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend} from 'recharts'
import axios from 'axios';

export default class WUPanel extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            data: null
        };

        axios.post('/user/utilization').then(res => {
            let data = {};

            //Need to parse through the res.json object TODO
            for (let i = 0; i < res.data.series1.x.length; i++) {
                data[res.data.series1.x[i]] = {
                    name: res.data.series1.x[i],
                    s1: res.data.series1.y[i]
                };
            }

            this.setState({ data: Object.values(data) });
        }).catch(err => console.log(err));


    }


/**  Please find the chart here
 * http://jsfiddle.net/dfnt777s/ */

    render () {
    return (
        <div style={{ margin: "0 auto 0" }}>
     {this.state.data && <BarChart width={600} height={300} data={this.state.data}
          margin={{top: 20, right: 30, left: 20, bottom: 5}}>
     <XAxis dataKey="name"/>
     <YAxis/>
     <CartesianGrid strokeDasharray="3 3"/>
     <Tooltip/>
     <Legend />
     <Bar dataKey="female" stackId="a" fill="#8884d8" />
     <Bar dataKey="male" stackId="a" fill="#82ca9d" />
      <Bar dataKey="uv" stackId="a" fill="#ffc658" />
    </BarChart>}
    </div>
  );
}

};