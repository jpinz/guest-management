import React, { Component } from 'react'
import { getUser, saveUser } from '../../helpers/auth'


export default class AccountManager extends Component {
    constructor(props) {
        super(props);
        this.state = {
            user: getUser()
        };
        this.email =  getUser().email;
        this.displayName = getUser().displayName
    }
    handleSubmit = (e) => {
        if(this.displayName.value.toString()) {
            console.log(this.displayName.value.toString());
            this.state.user.updateProfile({
                displayName: this.displayName.value.toString()
            }).then(function() {
                // Update successful.
                console.log("Name update succeeded" + this);
            }).catch(function(error) {
                // An error happened.
                console.log(error);
            });
        }
        if(this.email.value.toString()) {
            this.state.user.updateEmail(this.email.value.toString()).then(function () {
                // Update successful.
                saveUser(getUser());
                console.log("Email update succeeded" + this);
            }).catch(function (error) {
                // An error happened.
                console.log(error);
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
                      <input  className="form-control" defaultValue ={this.displayName} placeholder="Name" ref={(name) => this.displayName = name} />
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