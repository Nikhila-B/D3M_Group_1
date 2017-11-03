import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { BrowserRouter, Route, Redirect, Switch, Link } from 'react-router-dom'
import { Grid, NavItem, Nav } from 'react-bootstrap';

import AdminPage from './admin/AdminPage';
import UserPage from './user/UserPage';

class App extends React.Component {

    render() {
        return (
            <BrowserRouter>
                <Grid>
                    <Nav bsStyle="tabs" activeKey="1">
                        <li><Link to="/user">User</Link></li>
                        <li><Link to="/admin">Admin</Link></li>
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