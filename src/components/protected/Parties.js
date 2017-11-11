import React, { Component } from 'react'
import PartiesList from './PartiesList'
import CreateParty from './CreateParty'
import { Grid, Row, Col } from 'react-bootstrap';
import App from '../index'
import { Route, BrowserRouter, Link, Redirect, Switch } from 'react-router-dom'
import Party from "./Party";

export default class Parties extends Component {

  render () {
    return (
        <BrowserRouter>
            <div>
              <Switch>
                  <Route path='/parties' exact component={PartiesList} />
                  <Route path='/parties/create' exact component={CreateParty} />
                  <Route path='/parties/:id' component={Party} />

                  <Route render={() => <h3>404: Page not found.</h3>} />
              </Switch>
                <br />
              <Link to="/parties/create" >Add Party</Link>
            </div>
        </BrowserRouter>
    )
  }
}