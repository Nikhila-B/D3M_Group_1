import * as React from 'react';
import { Panel, Form, FormGroup, ControlLabel, Button, FormControl, Col, Checkbox, Table } from 'react-bootstrap';
import * as axios from 'axios';
import { Route, Redirect, Switch, Link } from 'react-router-dom'

import NewTreatmentComponent from './NewTreatmentComponent';
import TreatmentComponent from './TreatmentComponent';

export default class TreatmentPanel extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            tasks: {},
            cadres: {},
            treatments: {},
            showingNewTask: false,
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

    manageTreatmentSteps(treatmentId) {
        this.setState({ treatmentSteps: [] });
        axios.get(`/admin/${treatmentId}/steps`).then(res => {
            console.log(res.data);
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
        this.setState({ showingNewTask: false });
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

    renderTreatments() {
        return (
            <div>
                <div style={{ textAlign: "right", paddingBottom: 4 }}>
                    <Button
                        disabled={this.state.showingNewTask}
                        onClick={() => this.setState({ showingNewTask: true })}>
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
                        {this.state.showingNewTask &&
                            <NewTreatmentComponent
                                save={name => this.newTreatmentSave(name)}
                                cancel={() => this.setState({ showingNewTask: false })} />}
                    </tbody>
                </Table>
            </div>
        );
    }

    renderTreatment(route) {
        return (
            <div>
                <h3>{this.state.treatments[route.match.params.id].treatment}</h3>
                <ol>
                    {this.state.treatmentSteps.map(step =>
                        <ol key={step.id}>{this.state.tasks[step.taskId].task} - {this.state.cadres[step.cadreId]}</ol>
                    )}
                </ol>
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