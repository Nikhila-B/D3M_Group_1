import * as React from 'react';
import { Panel, Form, FormGroup, ControlLabel, Row, FormControl, Col, Checkbox, Button, Table } from 'react-bootstrap';
import axios from 'axios';

export default class WPCPanel extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            cadres: [],
            cadreDict: {},
            cadreInputs: {},
            facilities: [],
            selectedFacility: 0,
            treatments: [],
            treatmentsSelected: {},
            treatmentFilter: "",
            treatmentToggle: true,
            state: 'form',
            results: null
        };

        axios.get('/user/cadres').then(res => {
            let cadres = res.data;

            let cadreInputs = {};
            let cadreDict = {};
            cadres.forEach(cadre => {
                cadreInputs[cadre.id] = {
                    selected: true,
                    hours: 40,
                    adminPercentage: 15
                }
                cadreDict[cadre.id] = cadre.name;
            });

            this.setState({
                cadres: cadres,
                cadreDict: cadreDict,
                cadreInputs: cadreInputs
            });
        }).catch(err => console.log(err));

        axios.get('/user/facilities')
            .then(res => this.setState({ facilities: res.data }))
            .catch(err => console.log(err));

        axios.get('/user/treatments')
            .then(res => {
                let treatmentsSelected = {};
                res.data.forEach(treatment => {
                    treatmentsSelected[treatment.id] = true
                });
                this.setState({
                    treatments: res.data,
                    treatmentsSelected: treatmentsSelected
                });
            })
            .catch(err => console.log(err));

    }

    cadreCheckboxChange(id) {
        let cadreInputs = this.state.cadreInputs;
        cadreInputs[id].selected = !cadreInputs[id].selected;

        this.setState({ cadreInputs: cadreInputs });
    }

    cadreHoursChanged(e, id) {
        let cadreInputs = this.state.cadreInputs;
        cadreInputs[id].hours = e.target.value;
        this.setState({ cadreInputs: cadreInputs });
    }

    cadreAdminAmtChanged(e, id) {
        let cadreInputs = this.state.cadreInputs;
        cadreInputs[id].adminPercentage = e.target.value;
        this.setState({ cadreInputs: cadreInputs });
    }

    filterTreatments() {
        return this.state.treatments.filter(treatment => {
            let name = treatment['treatment'].toUpperCase();
            let filter = this.state.treatmentFilter.toUpperCase();
            return name.indexOf(filter) > -1;
        });
    }

    treatmentCheckboxChanged(id) {
        let treatmentsSelected = this.state.treatmentsSelected;
        treatmentsSelected[id] = !treatmentsSelected[id];
        this.setState({ treatmentsSelected: treatmentsSelected });
    }

    toggleTreatments() {
        let treatmentToggle = !this.state.treatmentToggle;
        let treatmentsSelected = this.state.treatmentsSelected;
        this.state.treatments.forEach(treatment => {
            treatmentsSelected[treatment.id] = treatmentToggle;
        })

        this.setState({
            treatmentToggle: treatmentToggle,
            treatmentsSelected: treatmentsSelected
        });
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
                treatments: this.state.treatmentsSelected
            };

            this.state.cadres.forEach(cadre => {
                if (this.state.cadreInputs[cadre.id].selected) {
                    data.cadres[cadre.id] = {
                        hours: parseFloat(this.state.cadreInputs[cadre.id].hours),
                        adminPercentage: parseFloat(this.state.cadreInputs[cadre.id].adminPercentage)
                    };
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
                <br />
                <FormGroup>
                    <Col componentClass={ControlLabel} sm={2}>
                        Facility
                    </Col>
                    <Col sm={10}>
                        <FormControl componentClass="select"
                            onChange={e => this.setState({ selectedFacility: e.target.value })}>
                            {(this.state.facilities.map((facility, i) =>
                                <option key={i} value={facility.id}>{facility.name}</option>
                            ))}
                        </FormControl>
                    </Col>
                </FormGroup>
                <hr />
                <FormGroup>
                    <Col componentClass={ControlLabel} sm={2}>Cadres</Col>
                    <Col sm={10}>
                        <Table striped hover>
                            <thead>
                                <tr>
                                    <th style={{ width: "10%" }}>Include</th>
                                    <th style={{ width: "40%" }}>Cadre</th>
                                    <th style={{ width: "20%" }}>Hours/Week</th>
                                    <th style={{ width: "30%" }}>Percentage of time spend on administrative tasks</th>
                                </tr>
                            </thead>
                            <tbody>
                                {this.state.cadres.map(cadre =>
                                    <tr key={cadre.id}>
                                        <td>
                                            <Checkbox
                                                checked={this.state.cadreInputs[cadre.id].selected}
                                                onChange={() => this.cadreCheckboxChange(cadre.id)}
                                            />
                                        </td>
                                        <td>
                                            <h5>{cadre.name}</h5>
                                        </td>
                                        <td>
                                            <FormControl
                                                type="number"
                                                style={{ width: 75 }}
                                                disabled={!this.state.cadreInputs[cadre.id].selected}
                                                value={this.state.cadreInputs[cadre.id].hours}
                                                onChange={e => this.cadreHoursChanged(e, cadre.id)} />
                                        </td>
                                        <td>
                                            <FormControl
                                                type="number"
                                                style={{ width: 75 }}
                                                disabled={!this.state.cadreInputs[cadre.id].selected}
                                                value={this.state.cadreInputs[cadre.id].adminPercentage}
                                                onChange={e => this.cadreAdminAmtChanged(e, cadre.id)} />
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </Table>
                    </Col>
                </FormGroup>
                <hr />
                <FormGroup>
                    <Col componentClass={ControlLabel} sm={2}>Treatments</Col>
                    <Col sm={10}>
                        <Row>
                            <Col xs={3}>
                                <FormControl
                                    type="text"
                                    placeholder="filter treatments"
                                    value={this.state.treatmentFilter}
                                    onChange={e => this.setState({ treatmentFilter: e.target.value })} />
                                <div style={{ textAlign: "right", paddingTop: 5 }}>
                                    <Button onClick={() => this.toggleTreatments()}>
                                        {this.state.treatmentToggle ? "Unselect" : "Select"} All
                                    </Button>
                                </div>
                            </Col>
                            <Col xs={9}>
                                <div style={{ overflowY: "scroll", minHeight: 250, maxHeight: 250 }}>
                                    <Table striped hover>
                                        <thead>
                                            <tr>
                                                <th style={{ width: "15%" }}>Include</th>
                                                <th></th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {this.filterTreatments().map(treatment =>
                                                <tr key={treatment['id']}>
                                                    <td>
                                                        <Checkbox
                                                            checked={this.state.treatmentsSelected[treatment['id']]}
                                                            onChange={() => this.treatmentCheckboxChanged(treatment['id'])} />
                                                    </td>
                                                    <td>
                                                        <h5>{treatment['treatment']}</h5>
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </Table>
                                </div>
                            </Col>
                        </Row>
                    </Col>
                </FormGroup>
                <hr />
                <div style={{ textAlign: "right", paddingTop: 10 }}>
                    <Button onClick={() => this.calculateClicked()}>Calculate</Button>
                </div>
            </Form >
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
            <div style={{ width: "85%", margin: "0 auto 0" }}>
                {this.state.state == 'form' && this.renderForm()}
                {this.state.state == 'loading' && this.renderLoading()}
                {this.state.state == 'results' && this.renderResults()}
            </div>
        );
    }

};