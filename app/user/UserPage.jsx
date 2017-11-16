import * as React from 'react';
import { Panel, Form, FormGroup, ControlLabel, FormControl, Col, Checkbox, Accordion } from 'react-bootstrap';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts'

// this needs to be pulled from the database
const data = [
    { name: 'Page A', uv: 4000, pv: 2400, amt: 2400 },
    { name: 'Page B', uv: 3000, pv: 1398, amt: 2210 },
    { name: 'Page C', uv: 2000, pv: 9800, amt: 2290 },
    { name: 'Page D', uv: 2780, pv: 3908, amt: 2000 },
    { name: 'Page E', uv: 1890, pv: 4800, amt: 2181 },
    { name: 'Page F', uv: 2390, pv: 3800, amt: 2500 },
    { name: 'Page G', uv: 3490, pv: 4300, amt: 2100 },
];

import WPCPanel from './WPCPanel';

export default class UserPage extends React.Component {

    constructor(props) {
        super(props);

    }

    render() {
        return (
            <div>
                <Accordion defaultActiveKey="1">
                    <Panel header="Work Force Pressure Calculator" eventKey="1">
                        <WPCPanel />
                    </Panel>
                    <Panel header="Predictive Work Force Pressure Calculator" eventKey="2">
                        <Form horizontal>
                            <FormGroup>
                                <Col componentClass={ControlLabel} sm={4}>
                                    Facility
                            </Col>
                                <Col sm={8}>
                                    <FormControl componentClass="select">
                                        <option value="1">Facility 1</option>
                                    </FormControl>
                                </Col>
                            </FormGroup>
                            <FormGroup>
                                <Col componentClass={ControlLabel} sm={4}>
                                    Cadres
                            </Col>
                                <Col sm={8}>
                                    <Checkbox checked>Nurse</Checkbox>
                                    <Checkbox checked>Doctor</Checkbox>
                                    <Checkbox checked>Whatever</Checkbox>
                                </Col>
                            </FormGroup>
                        </Form>
                    </Panel>
                    <Panel header="Workforce Utilization" eventKey="3">
                        <LineChart width={600} height={300} data={data}
                            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                            <XAxis dataKey="name" />
                            <YAxis />
                            <CartesianGrid strokeDasharray="3 3" />
                            <Tooltip />
                            <Legend />
                            <Line type="monotone" dataKey="pv" stroke="#8884d8" activeDot={{ r: 8 }} />
                            <Line type="monotone" dataKey="uv" stroke="#82ca9d" />
                        </LineChart>
                    </Panel>
                </Accordion>
            </div>
        );
    }
};