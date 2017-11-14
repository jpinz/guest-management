import React, { Component } from 'react'
import { db } from '../../config/constants'
import { ListGroup, ListGroupItem } from 'react-bootstrap';
import { checkInGuest, capitalize } from '../../helpers/db'
var moment = require('moment');


function getAdded(uid) {
    db.ref('/users/' + uid).once('value').then(function(snapshot) {
        console.log(snapshot.val().name);
        return snapshot.val().name;
    });
}

export default class Party extends Component {
    constructor(props) {
        super(props);
        this.state = {
            males: [],
            event: [],
            id: props.match.params.id
        };

    }

    checkIn(id) {
        console.log(id);
        //checkInGuest(id);
    }



    componentDidMount() {
        const malesRef = db.ref('guests/male');
        malesRef.on('value', (snapshot) => {
            let males = snapshot.val();
            let newGuy = [];
            for (let male in males) {
                newGuy.push({
                    id: male,
                    name: males[male].name,
                    addedByUID: males[male].addedByUID,
                    addedByName: males[male].addedByName,
                    party: males[male].party,
                    checkedIn: males[male].checkedIn
                });
            }
            this.setState({
                males: newGuy
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

        return (
            <div>
                <h1>{this.state.event.name} - {this.state.event.type}</h1>
                <h2>{this.state.event.date}</h2>
                <ListGroup>
                    {this.state.males.map((male) => {
                        return (
                            <ListGroupItem key={male.id} header={male.name} onClick={(e) => this.checkIn(male.id, e)}>Added by: {male.addedByName}</ListGroupItem>
                        )
                    })}
                </ListGroup>
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