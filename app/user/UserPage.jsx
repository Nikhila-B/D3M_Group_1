import * as React from 'react';
import { Panel, Form, FormGroup, ControlLabel, FormControl, Col, Checkbox, Accordion } from 'react-bootstrap';

import WPCPanel from './WPCPanel';

export default class UserPage extends React.Component {

    constructor(props) {
        super(props);

    }

    render() {
        return (
            <div>
                <Accordion defaultActiveKey="1">
                    <WPCPanel />
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
                </Accordion>
            </div>
        );
    }
};