import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { BrowserRouter, Route, Redirect, Switch, Link } from 'react-router-dom'
import { Grid, NavItem, Nav } from 'react-bootstrap';
import axios from 'axios';

axios.defaults.baseURL = 'http://localhost:3000/api';

import AdminPage from './admin/AdminPage';
import UserPage from './user/UserPage';

class App extends React.Component {

    render() {
        return (
            <BrowserRouter>
                <Grid>
                    <Nav bsStyle="tabs" activeKey="1">
                        <li className="link-wrapper"><Link to="/user">User</Link></li>
                        <li> </li>
                        <li className="link-wrapper"><Link to="/admin">Admin</Link></li>
                    </Nav>
                    <br />
                    <Switch>
                        <Route path='/user' component={UserPage} />
                        <Route path='/admin' component={AdminPage} />
                        <Redirect to='/user' />
                    </Switch>
                </Grid>
            </BrowserRouter>
        );
    }

}

ReactDOM.render(<App />, document.getElementById("app"));