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
            percentageAdminHours: 0,
            state: 'form',
            results: null
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

    cadreAdminAmtChanged(e) {
        this.setState({ percentageAdminHours: e.target.value });
    }

    calculateClicked() {

        // set state to loading
        this.setState({ state: 'loading' });

        // add timeout so loading animation looks better
        setTimeout(() => {
            // get input from forms and put it in a data object
            let data = {
                facilityId: this.state.selectedFacility,
                cadres: {},
                percentageAdminHours: parseFloat(this.state.percentageAdminHours)
            };

            this.state.cadres.forEach((cadre, i) => {
                if (this.state.selectedCadres[i]) {
                    data.cadres[i] = parseFloat(this.state.cadreHours[i])
                }
            });

            // send the calculate workforce request
            axios.post('/user/workforce', data).then(res => {

                this.setState({
                    results: res.data,
                    state: 'results'
                });
            }).catch(err => console.log(err));
        }, 400);
    }

    renderForm() {
        return (
            <Form horizontal>
                <FormGroup>
                    <Col componentClass={ControlLabel} sm={3}>
                        Facility
                    </Col>
                    <Col sm={8}>
                        <FormControl componentClass="select"
                            onChange={e => this.setState({ selectedFacility: e.target.value })}>
                            {(this.state.facilities.map((facility, i) =>
                                <option key={i} value={facility.id}>{facility.name}</option>
                            ))}
                        </FormControl>
                    </Col>
                </FormGroup>
                <FormGroup>
                    <Col componentClass={ControlLabel} sm={3}>Cadres</Col>
                    <Col sm={8}>
                        {(this.state.cadres.map((cadre, i) =>
                            <Row key={i} style={{ padding: 2 }}>
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
                        <FormControl type="text" value={this.state.percentageAdminHours} onChange={e => this.cadreAdminAmtChanged(e)} />
                    </Col>
                </FormGroup>
                <div style={{ textAlign: "right" }}>
                    <Button onClick={() => this.calculateClicked()}>Calculate</Button>
                </div>
            </Form>
        );
    }

    renderLoading() {
        return (
            <div style={{ marginTop: 120, marginBottom: 65 }}>
                <div class="loader"></div>
            </div>
        );
    }

    renderResults() {
        return (
            <div>
                <h3>Results</h3>
                <Row>
                    <Col xs={8}>
                        <h4>Workers Needed</h4>
                    </Col>
                    <Col xs={4}>
                        <h4>{this.state.results.workersNeeded}</h4>
                    </Col>
                </Row>
                <br />
                <div style={{ textAlign: "right" }}>
                    <Button onClick={() => this.setState({ state: 'form' })}>Back</Button>
                </div>
            </div>
        )
    }

    render() {
        return (
            <div style={{ width: "70%", margin: "0 auto 0" }}>
                {this.state.state == 'form' && this.renderForm()}
                {this.state.state == 'loading' && this.renderLoading()}
                {this.state.state == 'results' && this.renderResults()}
            </div>
        );
    }

};