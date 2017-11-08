import React, { Component } from 'react'
import { getUser } from '../../helpers/auth'


export default class AccountManager extends Component {
    constructor(props) {
        super(props);
        this.user = getUser();
        this.name = this.user.displayName;
        this.email = this.user.email
    }
    handleSubmit = (e) => {
        if(!this.name.value.toString().isEmpty()) {
            this.user.updateProfile({
                displayName: this.name.value
            }).then(function() {
                // Update successful.
                console.log("Update succeeded" + this.name.value);
            }).catch(function(error) {
                // An error happened.
            });
        }
        if(!this.name.email.value.toString().isEmpty()) {
            this.user.updateEmail(this.email.value).then(function () {
                // Update successful.
            }).catch(function (error) {
                // An error happened.
            });
        }
        e.preventDefault();

    };
    render () {
        return (
          <div>
              Manage your account here:
              <form onSubmit={this.handleSubmit}>
                  <div className="form-group">
                      <input  className="form-control" defaultValue ={this.name} placeholder="Name" ref={(name) => this.name= name} />
                  </div>
                  <div className="form-group">
                      <input className="form-control" defaultValue ={this.email} ref={(email) => this.email = email} placeholder="Email" />
                  </div>
                  <button type="submit" className="btn btn-primary">Update</button>
              </form>
          </div>
        )
    }
}