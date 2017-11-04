import * as React from 'react';
import { Panel, Form, FormGroup, ControlLabel, FormControl, Col, Checkbox } from 'react-bootstrap';
import axios from 'axios';

export default class WPCPanel extends React.Component {

    constructor(props) {
        super(props);
        
        this.state = {
            cadres: [],
            facilities: [],
            selectedCadres: [],
            selectedFacility: 0
        };

        axios.get('/user/cadres').then(res => {
            let cadres = res.data;

            let selectedCadres = [];
            cadres.forEach(() => selectedCadres.push(true));

            this.setState({
                cadres: cadres,
                selectedCadres: selectedCadres
            });
        }).catch(err => console.log(err));

        axios.get('/user/facilities').then(res => {
            let facilities = res.data;

            this.setState({
                facilities: facilities
            });

        }).catch(err => console.log(err));
    }

    checkboxChange(index) {
        let selectedCadres = this.state.selectedCadres;
        selectedCadres[index] = !selectedCadres[index];

        this.setState({
            selectedCadres: selectedCadres
        });
    }

    render() {
        return (
            <Panel header="Work Force Pressure Calculator" eventKey="1">
                        <Form horizontal>
                            <FormGroup>
                                <Col componentClass={ControlLabel} sm={4}>
                                    Facility
                            </Col>
                                <Col sm={8}>
                                    <FormControl componentClass="select">
                                        {(this.state.facilities.map((facility, i) => 
                                            <option value={i}>{facility}</option>
                                        ))}
                                    </FormControl>
                                </Col>
                            </FormGroup>
                            <FormGroup>
                                <Col componentClass={ControlLabel} sm={4}>
                                    Cadres
                            </Col>
                                <Col sm={8}>
                                    {(this.state.cadres.map((cadre, i) => 
                                        <Checkbox 
                                            checked={this.state.selectedCadres[i]}
                                            onChange={() => this.checkboxChange(i)}
                                            >{cadre}
                                        </Checkbox>
                                    ))}
                                </Col>
                            </FormGroup>
                        </Form>
                    </Panel>
        );
    }

};