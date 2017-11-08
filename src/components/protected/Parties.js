import React, { Component } from 'react'
import PartiesList from './PartiesList'
import CreateParty from './CreateParty'
import { Route, BrowserRouter, Link, Redirect, Switch } from 'react-router-dom'

export default class Parties extends Component {

  render () {
    return (
        <BrowserRouter>
            <div>
              <Switch>
                  <Route path='/parties' exact component={PartiesList} />
                  <Route path='/parties/create' component={CreateParty} />

                  <Route render={() => <h3>404: Page not found.</h3>} />
              </Switch>
              <Link to="/parties/create" >Add Party</Link>
            </div>
        </BrowserRouter>
    )
  }
}