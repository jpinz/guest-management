import React, { Component } from 'react'
import { db } from '../../config/constants'
import { ListGroup, ListGroupItem } from 'react-bootstrap';
import {checkInGuest, addMaleGuest, addFemaleGuest} from '../../utils/GuestUtils'
import {capitalize} from "../../utils/EventsUtils";
import GuestListItem from "../items/GuestListItem";
import {getUser, setUserName} from "../../helpers/auth";
import {Redirect} from "react-router-dom";

var moment = require('moment');


function getAdded(uid) {
    db.ref('/users/' + uid).once('value').then(function(snapshot) {
        console.log(snapshot.val().name);
        return snapshot.val().name;
    });
}


function getGuestListItem2(guest, id) {
    console.log(id);
    let ret = (
        <GuestListItem
            key={guest.id}
            guest={guest}
            id={id}
        />
    );
    return ret;
}

function guestSortCompare(guest1, guest2) {
    let guest1_names = guest1.name.split(' ');
    let guest1_last_name = guest1_names[guest1_names.length - 1].toLowerCase();

    let guest2_names = guest2.name.split(' ');
    let guest2_last_name = guest2_names[guest2_names.length - 1].toLowerCase();

    if(guest1_last_name < guest2_last_name) {
        return -1;
    } else if(guest1_last_name > guest2_last_name) {
        return 1;
    } else {
        return 0;
    }
}
export default class Party extends Component {
    constructor(props) {
        super(props);
        this.state = {
            males: [],
            females: [],
            event: [],
            search_filter: '',
            id: props.match.params.id
        };
        this.onMaleAdd = this.onGuestAdd.bind(this, true);
        this.onFemaleAdd = this.onGuestAdd.bind(this, false);
        this.handleFilterChange = this.handleFilterChange.bind(this);
    }

    checkIn(id) {
        console.log(id);
        //checkInGuest(id);
    }

    onGuestAdd(isMale) {
        if(!getUser().displayName) {
            var name = prompt("You don't have a name associated with this account, please add one", "");

            if (name) {
                console.log(name);
                setUserName(name);

                if (isMale) {
                    addMaleGuest(this.state.search_filter, this.state.id);
                } else {
                    addFemaleGuest(this.state.search_filter, this.state.id);
                }
            }
        } else {
            if (isMale) {
                addMaleGuest(this.state.search_filter, this.state.id);
            } else {
                addFemaleGuest(this.state.search_filter, this.state.id);
            }
        }
    }


    handleFilterChange(event) {
        let filter = event.target.value;
        let guests = [];
        let male_guests = [];
        let female_guests = [];
        if(filter == '') {
            guests = this.state.males.sort(guestSortCompare);
        } else {
            guests = this.state.males.filter((guest)=> {
                return (guest.name.replace(/[^a-zA-Z ]/g, "").toLowerCase().indexOf(filter.toLowerCase()) > -1)||(guest.addedBy.toLowerCase().indexOf(filter.toLowerCase()) > -1);
            }).sort(guestSortCompare);

        }

        for(let guest of guests) {
            if(guest.male) {
                male_guests.push(guest);
            } else {
                female_guests.push(guest);
            }
        }
        this.setState({
            males: male_guests,
            females: female_guests,
            search_filter: filter
        });

    }

    componentDidMount() {
        const malesRef = db.ref('guests/' + this.state.id + '/male');
        malesRef.on('value', (snapshot) => {
            let males = snapshot.val();
            let newGuy = [];
            for (let male in males) {
                newGuy.push({
                    id: male,
                    name: males[male].name,
                    addedBy: males[male].addedBy,
                    checkedIn: males[male].checkedIn
                });
            }
            this.setState({
                males: newGuy
            });
        });

        const femalesRef = db.ref('guests/' + this.state.id + '/female');
        femalesRef.on('value', (snapshot) => {
            let females = snapshot.val();
            let newGirl = [];
            for (let female in females) {
                newGirl.push({
                    id: female,
                    name: females[female].name,
                    addedBy: females[female].addedBy,
                    checkedIn: females[female].checkedIn
                });
            }
            this.setState({
                females: newGirl
            });
        });

        const eventRef = db.ref('events/' + this.state.id);
        eventRef.on('value', (snapshot) => {
            let event = snapshot.val();
            event.type = capitalize(event.type);
            event.date = moment(event.date).format("ddd, MMM Do YYYY");
            this.setState({
                event: event
            });
        });
    }

    render () {
        console.log(this.state);


        let male_text = 'Add Male';//(this.state.search_filter.indexOf(',') > -1) ? 'Add Males' : 'Add Male';
        let female_text = 'Add Female'; //(this.state.search_filter.indexOf(',') > -1) ? 'Add Females' : 'Add Female';

        let males = [];
        let females = [];

        this.state.males.map((male) => {
            male.male = true;
            males.push(getGuestListItem2(male, this.state.id));
        });

        this.state.females.map((female) => {
            female.male = false;
            females.push(getGuestListItem2(female, this.state.id));
        });

        return (
            <div>
                <h1>{this.state.event.name} - {this.state.event.type}</h1>
                <h2>{this.state.event.date}</h2>
                <input type='text' className='form-control' placeholder='Guest Name' value={this.state.search_filter} ref={(input) => { this.nameInput = input; }} onChange={this.handleFilterChange}/>
                <button type='button' className='btn btn-male' onClick={this.onMaleAdd}>{ male_text }</button>
                <button type='button' className='btn btn-female' onClick={this.onFemaleAdd}>{ female_text }</button>
                <div className='row'>
                    <div className='col-xs-12 col-sm-6 page-break'>
                        <h3>Males</h3>
                        <ul className='guest-list'>
                            { males }
                        </ul>
                    </div>
                    <div className='col-xs-12 col-sm-6 page-break'>
                        <h3>Females</h3>
                        <ul className='guest-list'>
                            { females }
                        </ul>
                    </div>
                </div>
                {/*<Grid>
                    <Row className="show-grid">
                        <Col md={6} mdPush={6}><code>&lt;{'Col md={6} mdPush={6}'} /&gt;</code></Col>
                        <Col md={6} mdPull={6}><code>&lt;{'Col md={6} mdPull={6}'} /&gt;</code></Col>
                    </Row>
                </Grid>*/}
            </div>
        )
    }
}