import * as React from 'react';
import { Panel, Form, FormGroup, ControlLabel, FormControl, Col, Checkbox, Accordion } from 'react-bootstrap';

import WPCPanel from './WPCPanel';
import PredictivePanel from './PredictivePanel';

export default class UserPage extends React.Component {

    constructor(props) {
        super(props);

    }

    render() {
        return (
            <div>
                <Accordion defaultActiveKey="1">
                    <Panel header="Work Force Pressure Calculator" eventKey="1">
                        <WPCPanel />
                    </Panel>
                    <Panel header="Predictive Work Force Pressure Calculator" eventKey="2">
                        <PredictivePanel />
                    </Panel>
                    <Panel header="Workforce Utilization" eventKey="3">
                    </Panel>
                </Accordion>
            </div>
        );
    }
};