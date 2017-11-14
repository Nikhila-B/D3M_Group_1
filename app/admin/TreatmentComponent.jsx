import * as React from 'react';
import { Panel, Form, FormGroup, ControlLabel, Button, FormControl, Col, Checkbox, Table } from 'react-bootstrap';


export default class TreatmentComponent extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            displayTasks: false
        };
    }

    renderTasks() {
        if (this.state.displayTasks) {
            return (
                <ol>
                    {this.props.tasks.map((task, i) =>
                        <li key={i}>{task}</li>
                    )}
                </ol>

            );
        } else {
            return <a>View Tasks ({this.props.tasks.length})</a>
        }
    }

    render() {
        return (
            <tr>
                <td>{this.props.name}</td>
                <td className="show-pointer" onClick={() => this.setState({ displayTasks: !this.state.displayTasks })}> {this.renderTasks()}</td>
                <td>
                    <Button onClick={() => this.props.manage()}>Manage Tasks</Button>
                    <Button onClick={() => this.props.delete()}>Delete</Button>
                </td>
            </tr>
        );
    }

}