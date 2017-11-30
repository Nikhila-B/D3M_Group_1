import * as React from 'react';
import { Panel, Form, FormGroup, ControlLabel, Button, FormControl, Col, Row, Checkbox, Table } from 'react-bootstrap';
import * as axios from 'axios';
import { Route, Redirect, Switch, Link } from 'react-router-dom';

import NewTreatmentComponent from './NewTreatmentComponent';
import TreatmentComponent from './TreatmentComponent';
import NewStepComponent from './NewStepComponent';

export default class TreatmentPanel extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            tasks: {},
            cadres: {},
            treatments: {},
            showingNewTreatment: false,
            showingNewStep: false,
            treatmentSteps: []
        };

        axios.get('/admin/treatments')
            .then(res => this.setState({ treatments: res.data }))
            .catch(err => console.log(err));

        axios.get('/admin/tasks')
            .then(res => this.setState({ tasks: res.data }))
            .catch(err => console.log(err));

        axios.get('/user/cadres').then(res => {
            let cadres = {};

            res.data.forEach(cadre => {
                cadres[cadre.id] = cadre.name;
            });

            this.setState({ cadres: cadres });
        }).catch(err => console.log(err));
    }

    componentWillReceiveProps(newProps) {
        // update our treatments incase one was edited
        if (newProps.location != this.props.location
            && newProps.location.pathname.endsWith("admin")) {
            axios.get('/admin/treatments')
                .then(res => this.setState({ treatments: res.data }))
                .catch(err => console.log(err));
        }
    }

    manageTreatmentSteps(treatmentId) {
        this.setState({ treatmentSteps: [] });
        axios.get(`/admin/${treatmentId}/steps`).then(res => {
            this.setState({ treatmentSteps: res.data });
        }).catch(err => console.log(err));
    }

    deleteTreatment(treatmentId) {
        axios.delete(`/admin/treatments/${treatmentId}`).then(() => {
            let treatments = this.state.treatments;
            delete treatments[treatmentId];
            this.setState({ treatments: treatments });
        }).catch(err => console.log(err));
    }

    newTreatmentSave(name) {
        this.setState({ showingNewTreatment: false });
        axios.post('/admin/treatments/', {
            name: name
        }).then(res => {
            let treatments = this.state.treatments;
            treatments[res.data.id] = {
                treatment: res.data.treatment,
                tasks: []
            };
            this.setState({ treatments: treatments });
        }).catch(err => console.log(err));
    }

    newStepSave(treatmentId, info) {
        this.setState({ showingNewStep: false });

        axios.post(`/admin/${treatmentId}/steps`, {
            taskId: parseInt(info.taskId),
            cadreId: parseInt(info.cadreId)
        }).then(res => {
            let treatmentSteps = this.state.treatmentSteps;
            treatmentSteps.push(res.data);
            this.setState({ treatmentSteps: treatmentSteps });
        }).catch(err => console.log(err));
    }

    deleteStep(treatmentId, stepId) {
        axios.delete(`/admin/${treatmentId}/steps/${stepId}`).then(res => {
            let treatmentSteps = this.state.treatmentSteps;
            let index = treatmentSteps.findIndex(step => step.id == stepId);
            delete treatmentSteps[index];
            this.setState({ treatmentSteps: treatmentSteps })
        }).catch(err => console.log(err));
    }

    renderTreatments() {
        return (
            <div>
                <div style={{ textAlign: "right", paddingBottom: 4 }}>
                    <Button bsStyle="success"
                        disabled={this.state.showingNewTreatment}
                        onClick={() => this.setState({ showingNewTreatment: true })}>
                        Add
                    </Button>
                </div>
                <Table bordered hover>
                    <thead>
                        <tr>
                            <th style={{ width: "10%" }}>Name</th>
                            <th style={{ width: "50%" }}>Treatment Steps</th>
                            <th style={{ width: "40%" }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {Object.keys(this.state.treatments).map(id =>
                            <TreatmentComponent
                                key={id}
                                name={this.state.treatments[id].treatment}
                                tasks={this.state.treatments[id].tasks}
                                manageLink={`/admin/${id}`}
                                manage={() => this.manageTreatmentSteps(id)}
                                delete={() => this.deleteTreatment(id)}
                            />
                        )}
                        {this.state.showingNewTreatment &&
                            <NewTreatmentComponent
                                save={name => this.newTreatmentSave(name)}
                                cancel={() => this.setState({ showingNewTreatment: false })} />}
                    </tbody>
                </Table>
            </div>
        );
    }

    renderTreatment(route) {
        return (
            <div>
                <h3>{this.state.treatments[route.match.params.id].treatment}</h3>
                <Row>
                    <Col xs={10}>
                        <Table bordered hover>
                            <thead>
                                <tr>
                                    <th style={{ width: "50%" }}>Task Name</th>
                                    <th style={{ width: "30%" }}>Cadre</th>
                                    <th style={{ width: "20%" }}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {this.state.treatmentSteps.map(step =>
                                    <tr key={step.id}>
                                        <td>{this.state.tasks[step.taskId].task}</td>
                                        <td> {this.state.cadres[step.cadreId]}</td>
                                        <td>
                                            <Button bsStyle="warning"
                                                onClick={() => this.deleteStep(route.match.params.id, step.id)}>
                                                Delete
                                            </Button>
                                        </td>
                                    </tr>
                                )}
                                {this.state.showingNewStep &&
                                    <NewStepComponent
                                        tasks={this.state.tasks}
                                        cadres={this.state.cadres}
                                        save={info => this.newStepSave(route.match.params.id, info)}
                                        cancel={() => this.setState({ showingNewStep: false })}
                                    />}
                            </tbody>
                        </Table>
                    </Col>
                    <Col xs={2}>
                        <Button bsStyle="success"
                            onClick={() => this.setState({ showingNewStep: true })}
                            disabled={this.state.showingNewStep}>
                            Add Step
                        </Button>
                    </Col>
                </Row>
            </div>
        );
    }

    render() {
        return (
            <Switch>
                {Object.keys(this.state.treatments).length == 0 &&
                    <Redirect from="/admin/*" to="/admin" />}
                <Route path='/admin/:id' render={this.renderTreatment.bind(this)} />
                <Route render={this.renderTreatments.bind(this)} />
            </Switch>
        );
    }

};