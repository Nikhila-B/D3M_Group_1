import * as React from 'react';
import { Panel, Form, FormGroup, ControlLabel, Row, FormControl, Col, Checkbox, Button } from 'react-bootstrap';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts'
import axios from 'axios';

export default class PredictivePanel extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            data: null
        };

        axios.post('/user/predictive').then(res => {
            let data = {};

            for (let i = 0; i < res.data.series1.x.length; i++) {
                data[res.data.series1.x[i]] = {
                    name: res.data.series1.x[i],
                    s1: res.data.series1.y[i]
                };
            }

            for (let i = 0; i < res.data.series2.x.length; i++) {
                data[res.data.series2.x[i]] = {
                    name: res.data.series2.x[i],
                    s2: res.data.series2.y[i]
                };
            }

            this.setState({ data: Object.values(data) });
        }).catch(err => console.log(err));


    }


    render() {
        return (
            <div style={{ margin: "0 auto 0" }}>
                {this.state.data && <LineChart width={600} height={300} data={this.state.data}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                    <XAxis dataKey="name" />
                    <YAxis />
                    <CartesianGrid strokeDasharray="3 3" />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="s1" stroke="#8884d8" activeDot={{ r: 8 }} />
                    <Line type="monotone" dataKey="s2" stroke="#82ca9d" />
                </LineChart>}
            </div>
        );
    }

};