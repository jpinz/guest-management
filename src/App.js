import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
var firebase;
var db;
var guests = [];
var listitems;
class App extends Component {
    constructor(props) {
        super(props);
        this.state = {value: ''};

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);


        firebase = require("firebase");
        var firebaseui = require('firebaseui');
        require("firebase/firestore");

        // Initialize Firebase
        const config = {
            apiKey: "AIzaSyA3jEriGQpF0rvDsmiZ8z887S4GWsGCM8o",
            authDomain: "zm-parties.firebaseapp.com",
            databaseURL: "https://zm-parties.firebaseio.com",
            projectId: "zm-parties",
            storageBucket: "zm-parties.appspot.com",
            messagingSenderId: "1022544483863"
        };
        firebase.initializeApp(config);

        db = firebase.firestore();

        db.collection("guests").onSnapshot(function(querySnapshot) {
                querySnapshot.forEach(function(doc) {
                    guests.push(doc.data().name);
                });
            listitems = guests.map((guests) =>
                <li>{guests}</li>
            );
                console.log("Current guest list: ", guests.join(", "));
            });

        var uiConfig = {
            signInSuccessUrl: '<url-to-redirect-to-on-success>',
            signInOptions: [
                // Leave the lines as is for the providers you want to offer your users.
                firebase.auth.GoogleAuthProvider.PROVIDER_ID,
                firebase.auth.EmailAuthProvider.PROVIDER_ID
            ]
        };

        // Initialize the FirebaseUI Widget using Firebase.
        var ui = new firebaseui.auth.AuthUI(firebase.auth());
        // The start method will wait until the DOM is loaded.
        ui.start('#firebaseui-auth-container', uiConfig);
    }

    handleChange(event) {
        this.setState({value: event.target.value});
    }

    handleSubmit(event) {
        console.log( this.state);

        db.collection("guests").add({
            name: this.state.value
        })
            .then(function(docRef) {
                console.log("Document written with ID: ", docRef.id);
            })
            .catch(function(error) {
                console.error("Error adding document: ", error);
            });
        event.preventDefault();
    }
    render() {


        return (
        <div className="App">
          <header className="App-header">
              <div id="firebaseui-auth-container"></div>
          </header>
          <p className="App-intro">
            To get started, edit <code>src/App.js</code> and save to reload.
          </p>
            <form onSubmit={this.handleSubmit}>
                <label>
                    Guest:
                    <input type="text" value={this.state.value} onChange={this.handleChange} />
                </label>
                <input type="submit" value="Add Guest" />

            </form>

            <ul>{listitems}</ul>
        </div>
      );
    }
}

export default App;
