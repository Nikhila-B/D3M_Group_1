import * as React from 'react';
import { Panel, Form, FormGroup, ControlLabel, Button, FormControl, Col, Checkbox, Table } from 'react-bootstrap';

export default class NewTreatmentComponent extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            name: ""
        };
    }

    render() {
        return (
            <tr>
                <td>
                    <FormControl
                        onChange={e => this.setState({ name: e.target.value })}
                        type="text" />
                </td>
                <td></td>
                <td>
                    <Button onClick={() => this.props.save(this.state.name)}>Save</Button>
                    <Button onClick={() => this.props.cancel()}>Cancel</Button>
                </td>
            </tr>
        );
    }

}