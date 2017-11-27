import * as React from 'react';
import { Panel, Form, FormGroup, ControlLabel, Button, FormControl, Col, Checkbox, Table } from 'react-bootstrap';

export default class NewStepComponent extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            taskId: Object.keys(props.tasks)[0],
            cadreId: Object.keys(props.cadres)[0]
        };
    }

    render() {
        return (
            <tr>
                <td>
                    <FormControl
                        componentClass="select"
                        onChange={e => this.setState({ taskId: e.target.value })}
                        value={this.state.taskId}>
                        {Object.keys(this.props.tasks).map(taskId =>
                            <option
                                key={taskId}
                                value={taskId}>
                                {this.props.tasks[taskId].task}
                            </option>
                        )}
                    </FormControl>
                </td>
                <td>
                    <FormControl
                        componentClass="select"
                        onChange={e => this.setState({ cadreId: e.target.value })}
                        value={this.state.cadreId}>
                        {Object.keys(this.props.cadres).map(cadreId =>
                            <option
                                key={cadreId}
                                value={cadreId}>
                                {this.props.cadres[cadreId]}
                            </option>
                        )}
                    </FormControl>
                </td>
                <td>
                    <Button onClick={() => this.props.save(this.state)}>Save</Button>
                    <Button onClick={() => this.props.cancel()}>Cancel</Button>
                </td>
            </tr>
        );
    }

}