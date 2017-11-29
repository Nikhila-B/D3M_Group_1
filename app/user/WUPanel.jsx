import * as React from 'react';
import { Panel, Form, FormGroup, ControlLabel, Row, FormControl, Col, Checkbox, Button } from 'react-bootstrap';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts'
import axios from 'axios';

const colorList = ["#8884d8", "#82ca9d", "#ffc658"];

export default class WUPanel extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            data: null,
            cadres: []
        };

        axios.get('/user/cadres').then(res => {
            let cadres = [];
            res.data.forEach(cadre => cadres.push(cadre.name));
            this.setState({ cadres: cadres });
        }).catch(err => console.log(err));

        axios.get('/user/utilization/stackedbarcharts')
            .then(res => this.setState({ data: res.data }))
            .catch(err => console.log(err))
    }


    /**  Please find the chart here
     * http://jsfiddle.net/dfnt777s/ */

    render() {
        return (
            <div style={{ margin: "0 auto 0" }}>
                {this.state.data &&
                    <BarChart width={700} height={300} data={this.state.data}
                        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                        <XAxis dataKey="name" />
                        <YAxis />
                        <CartesianGrid strokeDasharray="3 3" />
                        <Tooltip />
                        <Legend />
                        {this.state.cadres.map((cadre, i) =>
                            <Bar dataKey={cadre} stackId="a" fill={colorList[i]} />
                        )}
                    </BarChart>
                }
            </div>
        );
    }

};