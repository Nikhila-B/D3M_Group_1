import * as React from 'react';
import { Panel, Form, FormGroup, ControlLabel, FormControl, Col, } from 'react-bootstrap';


export default class UserPage extends React.Component {

    constructor(props) {
        super(props);

    }

    render() {
        return (
            <div>
                <Panel header="Work Force Pressure Calculator">
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
                                Cadre
                            </Col>
                            <Col sm={8}>
                                <FormControl componentClass="select">
                                    <option value="1">Cadre 1</option>
                                </FormControl>
                            </Col>
                        </FormGroup>
                    </Form>
                </Panel>
            </div>
        );
    }

};