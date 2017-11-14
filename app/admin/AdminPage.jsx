import * as React from 'react';
import { Panel, Form, FormGroup, ControlLabel, Button, FormControl, Col, Checkbox, Table } from 'react-bootstrap';
import { Route, Redirect, Switch, Link } from 'react-router-dom'

import NewTreatmentComponent from './NewTreatmentComponent';
import TreatmentComponent from './TreatmentComponent';

export default class AdminPage extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            showingNewTask: false
        };

    }

    manageTask(taskId) {

    }

    deleteTask(taskId) {

    }

    newTreatmentSave(name) {
        // add a new task

    }

    render() {
        return (
            <Panel header="Treatments">
                <Table bordered>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Tasks</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        <TreatmentComponent
                            name="ART"
                            tasks={["prep needles", "sedate patient", "???", "profit"]}
                            manage={() => this.manageTask(1)}
                            delete={() => this.deleteTask(1)}
                        />
                        {this.state.showingNewTask &&
                            <NewTreatmentComponent
                                save={name => this.newTreatmentSave(name)}
                                cancel={() => this.setState({ showingNewTask: false })} />}
                    </tbody>
                </Table>
                <div style={{ textAlign: "right" }}>
                    {!this.state.showingNewTask &&
                        <Button onClick={() => this.setState({ showingNewTask: true })}> Add</Button>}
                </div>
            </Panel>
        );
    }

};