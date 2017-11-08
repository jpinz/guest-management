import React, { Component } from 'react'
import { getParties } from '../../helpers/db'

function ListItem(props) {
    // Correct! There is no need to specify the key here:
    return <li>{props.value}</li>;
}
function GetParties(props) {
    const events = props.events;
    const listItems = events.map((event) =>
        // Correct! Key should be specified inside the array.
        <ListItem key={event}
                  value={event.name} />
    );
    return (
        <ul>
            {listItems}
        </ul>
    );
}
export default class PartiesList extends Component {
    constructor(props) {
        super(props);

    }



    render () {
        return (
            <div>
                <h1>List of parties here</h1>

            </div>
        )
    }
}