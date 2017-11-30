import * as React from 'react';
import { Panel, Form, FormGroup, ControlLabel, Button, FormControl, Col, Checkbox, Table } from 'react-bootstrap';
import * as axios from 'axios';

export default class TasksPanel extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            tasks: {},
            filter: ""
        };

        axios.get('/admin/tasks')
            .then(res => this.setState({ tasks: res.data }))
            .catch(err => console.log(err));

    }

    getFilteredTasks() {
        return Object.keys(this.state.tasks).filter(val => {
            let task = this.state.tasks[val].task.toUpperCase();
            let filter = this.state.filter.toUpperCase();
            return task.indexOf(filter) > -1;
        });
    }

    render() {
        return (
            <div>
                <FormGroup type>
                    <ControlLabel>Filter</ControlLabel>
                    <FormControl
                        type="text"
                        value={this.state.filter}
                        placeholder="task name"
                        onChange={e => this.setState({ filter: e.target.value })}
                    />
                </FormGroup>
                <Table>
                    <thead>
                        <tr>
                            <th>Id</th>
                            <th>Name</th>
                            <th>Minutes Per Patient</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.getFilteredTasks().map(taskId =>
                            <tr key={taskId}>
                                <td>{taskId}</td>
                                <td>{this.state.tasks[taskId].task}</td>
                                <td>{Math.round(this.state.tasks[taskId].minutesPerPatient)} mins</td>
                            </tr>
                        )}
                    </tbody>
                </Table>
            </div>
        );
    }

}