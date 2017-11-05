import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
var firebase;
var db;
class App extends Component {
    constructor(props) {
        super(props);
        this.state = {value: ''};

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);


        firebase = require("firebase");
        const firebaseui = require('firebaseui');
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
    }

    handleChange(event) {
        this.setState({value: event.target.value});
    }

    handleSubmit(event) {
        console.log( this.state);

        db.collection("guests").doc(this.state.gender).add({
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
            <img src={logo} className="App-logo" alt="logo" />
            <h1 className="App-title">Welcome to React</h1>
          </header>
          <p className="App-intro">
            To get started, edit <code>src/App.js</code> and save to reload.
          </p>
            <form onSubmit={this.handleSubmit}>
                <label>
                    Guest:
                    <input type="text" value={this.state.value} onChange={this.handleChange} />
                </label>
                <input type="submit" value={this.state.gender = "males"} />

            </form>
        </div>
      );
    }
}

export default App;
