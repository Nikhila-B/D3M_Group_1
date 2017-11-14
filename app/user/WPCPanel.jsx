import * as React from 'react';
import { Panel, Form, FormGroup, ControlLabel, Row, FormControl, Col, Checkbox, Button } from 'react-bootstrap';
import axios from 'axios';

export default class WPCPanel extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            cadres: [],
            cadreDict: {},
            facilities: [],
            selectedCadres: {},
            selectedFacility: 0,
            cadreHours: {},
            percentageAdminHours: '0',
            state: 'form',
            results: null
        };

        axios.get('/user/cadres').then(res => {
            let cadres = res.data;

            let selectedCadres = {};
            let cadreHours = {};
            let cadreDict = {};
            cadres.forEach(cadre => {
                selectedCadres[cadre.id] = true;
                cadreHours[cadre.id] = 40;
                cadreDict[cadre.id] = cadre.name;
            });

            this.setState({
                cadres: cadres,
                cadreDict: cadreDict,
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

    checkboxChange(id) {
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
                if (this.state.selectedCadres[cadre.id]) {
                    data.cadres[cadre.id] = parseFloat(this.state.cadreHours[cadre.id])
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
                        {(this.state.cadres.map(cadre =>
                            <Row key={cadre.id} style={{ padding: 2 }}>
                                <Col xs={4}>
                                    <Checkbox
                                        checked={this.state.selectedCadres[cadre.id]}
                                        onChange={() => this.checkboxChange(cadre.id)}
                                    >{cadre.name}
                                    </Checkbox>
                                </Col>
                                <Col xs={3}>
                                    {this.state.selectedCadres[cadre.id] &&
                                        <FormControl type="number" onChange={e => this.cadreHoursChanged(e, cadre.id)} value={this.state.cadreHours[cadre.id]} />}
                                </Col>
                                <Col xs={3}>
                                    {this.state.selectedCadres[cadre.id] && <h5>hours/week</h5>}
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
                <div className="loader"></div>
            </div>
        );
    }

    renderResults() {
        return (
            <div>
                <h3>Results</h3>
                <Row>
                    <Col xs={8}>
                        {Object.keys(this.state.results).map(cadreId =>
                            <h4 key={cadreId}>{this.state.cadreDict[cadreId]}</h4>
                        )}
                    </Col>
                    <Col xs={4}>
                        {Object.keys(this.state.results).map(cadreId =>
                            <h4 key={cadreId}>{this.state.results[cadreId]}</h4>
                        )}
                    </Col>
                </Row>
                <br />
                <div style={{ textAlign: "right" }}>
                    <Button onClick={() => this.setState({ state: 'form', results: null })}>Back</Button>
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