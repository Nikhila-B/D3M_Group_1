import * as React from 'react';
import { Panel, Form, FormGroup, ControlLabel, Row, FormControl, Col, Checkbox, Button } from 'react-bootstrap';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Label } from 'recharts'
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
     * http://jsfiddle.net/dfnt777s/ 
     * label={{ value: 'Time Measure in Minutes', angle: -90, position: 'left' }} />*/

    render() {
        return (
             <div style={{ margin: "0 auto 0", width: 700 }}>
                {this.state.data &&
                    <div style={{ margin: "0 auto 0", width: 700 }}>
                        <BarChart width={800} height={500} data={this.state.data}
                            margin={{ top: 20, right: 20, left: 20, bottom: 5 }}>
                            <XAxis dataKey="name" tick={{stroke: 'black', strokeWidth: 0.5}} >
                                <Label value="Treatments Available" offset={0} position="bottom" />
                            </XAxis>
                            <YAxis label={{ value: "Time Measured in Minutes", angle: -90, position: "insideLeft", offset:0}} />
                            <CartesianGrid strokeDasharray="3 3" />
                            <Tooltip />
                           <Legend iconType="star" verticalAlign="top" height={45} />
                           
                            {this.state.cadres.map((cadre, i) =>
                                <Bar key={i} dataKey={cadre} stackId="a" fill={colorList[i]} />
                            )}
                        </BarChart>
                    </div>
                }
            </div>
        );
    }

};