import React, { Component } from 'react'
import { db } from '../../config/constants'
import { Grid, Row, Col, ListGroup, ListGroupItem } from 'react-bootstrap';
import { checkInGuest } from '../../helpers/db'

export default class Party extends Component {
    constructor(props) {
        super(props);
        this.state = {
            males: []
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
                    addedBy: males[male].addedBy,
                    party: males[male].party,
                    checkedIn: males[male].checkedIn
                });
            }
            this.setState({
                males: newGuy
            });
        });
    }

    render () {
        console.log(this.state);

        return (
            <div>
                <ListGroup>
                    {this.state.males.map((male) => {
                        return (
                            <ListGroupItem key={male.id} header={male.name} onClick={(e) => this.checkIn(male.id, e)}>Added by:{male.addedBy}</ListGroupItem>
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