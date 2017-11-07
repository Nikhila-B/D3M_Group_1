import * as React from 'react';
import { Panel, Form, FormGroup, ControlLabel, Row, FormControl, Col, Checkbox, Button } from 'react-bootstrap';
import axios from 'axios';

export default class WPCPanel extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            cadres: [],
            facilities: [],
            selectedCadres: [],
            selectedFacility: 0,
            cadreHours: [],
            percentageAdminHours: 0
        };

        axios.get('/user/cadres').then(res => {
            let cadres = res.data;

            let selectedCadres = [];
            let cadreHours = [];
            cadres.forEach(() => {
                selectedCadres.push(true);
                cadreHours.push(40);
            });

            this.setState({
                cadres: cadres,
                selectedCadres: selectedCadres,
                cadreHours: cadreHours
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

    cadreHoursChanged(e, i) {
        let cadreHours = this.state.cadreHours;
        cadreHours[i] = e.target.value;
        this.setState({ cadreHours: cadreHours });
    }

    calculateClicked() {

        let data = {
            facilityId: this.state.selectedFacility,
            cadres: {},
            percentageAdminHours: this.state.percentageAdminHours
        };

        this.state.cadres.forEach((cadre, i) => {
            if (this.state.selectedCadres[i]) {
                data.cadres[i] = this.state.cadreHours[i]
            }
        });


        axios.post('/user/workforce', data).then(res => {

            console.log(res.data);

        }).catch(err => console.log(err));

    }

    render() {
        return (
            <Form horizontal style={{ width: "70%", margin: "0 auto 0" }}>
                <FormGroup>
                    <Col componentClass={ControlLabel} sm={3}>
                        Facility
                    </Col>
                    <Col sm={8}>
                        <FormControl componentClass="select">
                            {(this.state.facilities.map((facility, i) =>
                                <option value={facility.id}>{facility.name}</option>
                            ))}
                        </FormControl>
                    </Col>
                </FormGroup>
                <FormGroup>
                    <Col componentClass={ControlLabel} sm={3}>Cadres</Col>
                    <Col sm={8}>
                        {(this.state.cadres.map((cadre, i) =>
                            <Row style={{ padding: 2 }}>
                                <Col xs={4}>
                                    <Checkbox
                                        checked={this.state.selectedCadres[i]}
                                        onChange={() => this.checkboxChange(i)}
                                    >{cadre.name}
                                    </Checkbox>
                                </Col>
                                <Col xs={3}>
                                    {this.state.selectedCadres[i] &&
                                        <FormControl type="number" onChange={e => this.cadreHoursChanged(e, i)} value={this.state.cadreHours[i]} />}
                                </Col>
                                <Col xs={3}>
                                    {this.state.selectedCadres[i] && <h5>hours/week</h5>}
                                </Col>
                            </Row>
                        ))}
                    </Col>
                </FormGroup>
                <FormGroup>
                    <Col componentClass={ControlLabel} sm={3}>
                        % of time spent of admin task
                    </Col>
                    <Col sm={8}>
                        <FormControl type="text" />
                    </Col>
                </FormGroup>
                <div style={{ textAlign: "right" }}>
                    <Button onClick={() => this.calculateClicked()}>Calculate</Button>
                </div>
            </Form>
        );
    }

};