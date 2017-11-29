import * as React from 'react';
import { Panel, Form, FormGroup, ControlLabel, Row, FormControl, Col, Checkbox, Button } from 'react-bootstrap';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts'
import axios from 'axios';
import * as base64 from 'base64-url'

export default class PredictivePanel extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            tagwords: null,
            selectedTagword: null,
            selectedIndicator: null
        };

        axios.get('/user/predictive/lrcharts/indicators')
            .then(res => this.setState({ tagwords: res.data }))
            .catch(err => console.log(err));

    }

    selectTagword(value) {
        this.setState({
            selectedTagword: value,
            selectedIndicator: this.state.tagwords[value][0]
        })
    }

    calculate() {
        axios.get(`/user/predictive/lrcharts/${base64.encode(this.state.selectedIndicator)}`)
            .then(res => {
                console.log(res);

                let data = [];

                Object.keys(res.data).map(year => {
                    data.push({
                        name: year,
                        s1: res.data[year]
                    });
                })

                this.setState({ data: data })
            }).catch(err => console.log(err));
    }

    render() {

        if (!this.state.tagwords) {
            return (
                <div style={{ marginTop: 120, marginBottom: 65 }}>
                    <div className="loader"></div>
                </div>
            )
        }

        return (
            <div style={{ margin: "0 auto 0" }}>
                <Form horizontal>
                    <FormGroup>
                        <Col componentClass={ControlLabel} sm={2}>
                            Disease/Condition
                    </Col>
                        <Col sm={10}>
                            <FormControl componentClass="select"
                                onChange={e => this.selectTagword(e.target.value)}>
                                {Object.keys(this.state.tagwords).map(tagword =>
                                    <option key={tagword} value={tagword}>
                                        {tagword.substr(0, 1).toUpperCase() + tagword.substr(1).toLowerCase()}
                                    </option>
                                )}
                            </FormControl>
                        </Col>
                    </FormGroup>
                    {this.state.selectedTagword &&
                        <FormGroup>
                            <Col componentClass={ControlLabel} sm={2}>
                                Indicator
                        </Col>
                            <Col sm={10}>
                                <FormControl componentClass="select"
                                    onChange={e => this.setState({ selectedIndicator: e.target.value })}>
                                    {this.state.tagwords[this.state.selectedTagword].map(indicator =>
                                        <option
                                            key={indicator}
                                            value={indicator}>
                                            {indicator}
                                        </option>
                                    )}
                                </FormControl>
                            </Col>
                        </FormGroup>
                    }

                    {this.state.selectedIndicator &&
                        <div style={{ textAlign: "right" }}>
                            <Button onClick={() => this.calculate()}>Calculate</Button>
                        </div>
                    }
                </Form>

                <hr />
                
                {this.state.data &&
                    <div style={{ margin: "0 auto 0", width: 600 }}>
                        <LineChart width={600} height={300} data={this.state.data}
                            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                            <XAxis dataKey="name" />
                            <YAxis />
                            <CartesianGrid strokeDasharray="3 3" />
                            <Tooltip />
                            <Legend />
                            <Line type="monotone" dataKey="s1" stroke="#8884d8" activeDot={{ r: 8 }} />
                            <Line type="monotone" dataKey="s2" stroke="#82ca9d" />
                        </LineChart>
                    </div>
                }
            </div>
        );
    }

};