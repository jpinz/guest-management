import React, { Component } from 'react'
import 'bootstrap/dist/css/bootstrap.css'
import { Route, BrowserRouter, Link, Redirect, Switch } from 'react-router-dom'
import Login from './Login'
import Register from './Register'
import Home from './Home'
import Parties from './protected/Parties'
import Dashboard from './protected/Dashboard'
import { logout, getUser, saveUser } from '../helpers/auth'
import { firebaseAuth } from '../config/constants'
import AccountManager from "./protected/AccountManager";
import CreateParty from "./protected/CreateParty";
import Party from "./protected/Party";

function PrivateRoute ({component: Component, authed, ...rest}) {
    return (
        <Route
            {...rest}
            render={(props) => authed === true
                ? <Component {...props} />
                : <Redirect to={{pathname: '/login', state: {from: props.location}}} />}
        />
    )
}

function PublicRoute ({component: Component, authed, ...rest}) {
    return (
        <Route
            {...rest}
            render={(props) => authed === false
                ? <Component {...props} />
                : <Redirect to='/dashboard' />}
        />
    )
}

export default class App extends Component {
    state = {
        authed: false,
        loading: true,
    };
    componentDidMount () {
        this.removeListener = firebaseAuth().onAuthStateChanged((user) => {
            if (user) {
                saveUser(getUser());
                this.setState({
                    authed: true,
                    loading: false,
                })
            } else {
                this.setState({
                    authed: false,
                    loading: false
                })
            }
        })
    }
    componentWillUnmount () {
        this.removeListener()
    }
    render() {
        return this.state.loading === true ? <h1>Loading</h1> : (
            <BrowserRouter>
                <div>
                    <nav className="navbar navbar-default navbar-static-top">
                        <div className="container">
                            <div className="navbar-header">
                                <Link to="/" className="navbar-brand">TKE ZM</Link>
                            </div>
                            <ul className="nav navbar-nav pull-right">
                                <li>
                                    <Link to="/" className="navbar-brand">Home</Link>
                                </li>
                                <li>
                                    {this.state.authed
                                        ? <span>
                                    <Link to="/dashboard" className="navbar-brand">Dashboard</Link>
                                    <Link to="/parties" className="navbar-brand">Parties</Link>
                                    <Link to="/account" className="navbar-brand">Account</Link>
                                    <button
                                        style={{border: 'none', background: 'transparent'}}
                                        onClick={() => {
                                            logout()
                                        }}
                                        className="navbar-brand">Logout</button>
                                    </span> : <span>
                                        <Link to="/login" className="navbar-brand">Login</Link>
                                        {/*<Link to="/register" className="navbar-brand">Register</Link>*/}
                                    </span>}
                                </li>
                            </ul>
                        </div>
                    </nav>
                    <div className="container">
                        <div className="row">
                            <Switch>
                                <Route path='/' exact component={Home} />
                                <PublicRoute authed={this.state.authed} path='/login' component={Login} />
                                {<PublicRoute authed={this.state.authed} path='/register' component={Register} />}
                                <PrivateRoute authed={this.state.authed} path='/parties/:id' component={Party} />
                                <PrivateRoute authed={this.state.authed} path='/dashboard' component={Dashboard} />
                                <PrivateRoute authed={this.state.authed} path='/parties' component={Parties} />
                                <PrivateRoute authed={this.state.authed} path='/createEvent' component={CreateParty} />
                                <PrivateRoute authed={this.state.authed} path='/account' component={AccountManager} />
                                <Route render={() => <h3>404: Page not found.</h3>} />
                            </Switch>
                        </div>
                    </div>
                </div>
            </BrowserRouter>
        );
    }
}
