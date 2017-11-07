import * as React from 'react';
import { Panel, Form, FormGroup, ControlLabel, Button, FormControl, Col, Checkbox, Table } from 'react-bootstrap';
import { Route, Redirect, Switch, Link } from 'react-router-dom'

export default class AdminPage extends React.Component {

    constructor(props) {
        super(props);


    }

    render() {
        return (
            <Panel header="Treatments">
                <Table bordered>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>Example</td>
                            <td><Button>Add Tasks</Button><Button>Delete</Button></td>
                        </tr>
                    </tbody>
                </Table>
                <div style={{ textAlign: "right" }}>
                    <Button>Add</Button>
                </div>
            </Panel>
        );
    }

};