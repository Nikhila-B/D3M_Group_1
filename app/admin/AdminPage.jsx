import * as React from 'react';
import { Panel, Form, FormGroup, ControlLabel, Button, FormControl, Col, Checkbox, Table } from 'react-bootstrap';

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
                <Panel header="Treatments">
                    <TreatmentPanel />
                </Panel>
                <Panel header="Tasks">
                    <TasksPanel />
                </Panel>
            </div>
        );
    }

};