import React, { Component } from 'react'
import DatePicker from 'react-datepicker';
import moment from 'moment';
import 'react-datepicker/dist/react-datepicker.css';
import {addEvent} from "../../utils/EventsUtils";
import { browserHistory } from 'react-router'


export default class CreateParty extends Component {
    constructor(props) {
        super(props);
        this.state = {name: '',
            type: 'party',
            numberOfGuests: 2,
            date: moment()};

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(event) {
        if(event instanceof moment) {
            this.setState({
                date: event
            });
        } else {
            const target = event.target;
            console.log(target);
            const value = target.value;
            const name = target.name;
            console.log("Value" + value +"Name" +  name);
            this.setState({[name]: value});
        }
    }

    handleSubmit(event) {
        if(!this.state.name.toString()){
            alert("Event name can't be empty!");
        } else {
            var e = {};
            e.type = this.state.type;
            e.name = this.state.name;
            e.date = this.state.date.toObject();
            e.guestsPerBro = this.state.numberOfGuests;
            console.log(e);
            addEvent(this.state.type, this.state.name, this.state.date.format('MM/DD/YYYY'), this.state.numberOfGuests);
        }
        event.preventDefault();
    }

  render () {
    return (
      <div>
          <h1>Create an event</h1>
          <form onSubmit={this.handleSubmit}>
              <label>
                  Name:
                  <input type="text" name="name" onChange={this.handleChange} />
              </label>
              <br />
              <label>
                  Number of guests per brother:
                  <input
                      name="numberOfGuests"
                      type="number"
                      value={this.state.numberOfGuests}
                      onChange={this.handleChange} />
              </label>
              <br />
              <label>
                  Type of event:
                  <select name="type" value={this.state.type} onChange={this.handleChange}>
                      <option value="party">Party</option>
                      <option value="social">Social</option>
                      <option value="pregame">Pregame</option>
                      <option value="semi">Semi-Formal</option>
                      <option value="nocial">Nocial</option>
                      <option value="other">Other</option>
                  </select>
              </label>
              <br />
              <DatePicker
                  selected={this.state.date}
                  onChange={this.handleChange}
              />
              <input type="submit" value="Add Event" />

          </form>
      </div>
    )
  }
}