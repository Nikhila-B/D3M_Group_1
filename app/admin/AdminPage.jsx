import * as React from 'react';
import { Panel, Form, FormGroup, ControlLabel, Button, FormControl, Col, Checkbox, Table } from 'react-bootstrap';
import { Route, Redirect, Switch, Link } from 'react-router-dom'

import TreatmentPanel from './TreatmentPanel';
import TasksPanel from './TasksPanel';

export default class AdminPage extends React.Component {

    constructor(props) {
        super(props);

        this.state = {};
    }

    render() {
        return (
            <div>
                <Panel bsStyle="primary" header="Treatments">
                    <Route component={TreatmentPanel} />
                </Panel>
                <Panel bsStyle="success" header="Tasks">
                    <TasksPanel />
                </Panel>
            </div>
        );
    }

};