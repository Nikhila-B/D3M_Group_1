import * as React from 'react';
import { Panel, Form, FormGroup, ControlLabel, Button, FormControl, Col, Checkbox, Table, ButtonToolbar } from 'react-bootstrap';
import { Link } from 'react-router-dom'

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
                <div>
                    <a>Hide Treatment Steps</a>
                    <br />
                    <ol>
                        {this.props.tasks.map((task, i) =>
                            <li key={i}>{task}</li>
                        )}
                    </ol>
                </div>
            );
        } else {
            return <a>View Treatment Steps ({this.props.tasks.length})</a>
        }
    }

    render() {
        return (
            <tr>
                <td>{this.props.name}</td>
                <td className="show-pointer" onClick={() => this.setState({ displayTasks: !this.state.displayTasks })}> {this.renderTasks()}</td>
                <td>
                <ButtonToolbar>
                    <Link to={this.props.manageLink}>
                        <Button bsStyle="info" onClick={() => this.props.manage()}>Manage Treatment Steps</Button>
                    </Link>
                    <Button bsStyle="warning" onClick={() => this.props.delete()}>Delete</Button>
                </ButtonToolbar>
                </td>
            </tr>
        );
    }

}