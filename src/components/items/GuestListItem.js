import React, { Component } from 'react';

import {deleteGuest, setGuestStatus} from "../../utils/GuestUtils";

require('../../styles/GuestList.css');


export default class GuestListItem extends Component {
    constructor() {
        super();
        this.onDelete = this.onDelete.bind(this);
        this.onCheckIn = this.onCheckIn.bind(this);
    }


    onDelete() {
        const {guest} = this.props;
        const {id} = this.props;
        deleteGuest(((guest.male) ? 'male' : 'female'), guest.id, id);
    }

    onCheckIn() {
        const {guest} = this.props;
        console.log(guest);
        const {id} = this.props;
        setGuestStatus(((guest.male) ? 'male' : 'female'), id, guest.id, true);

    }

    render() {
        const {guest} = this.props;
        let style = (guest.male) ? 'guest-list-item male' : 'guest-list-item female';
        let edit_string;

        if (!guest.checkedIn) {
            edit_string = (<div className='pull-right'>
                <button className='btn btn-success' onClick={this.onCheckIn}>
                    <span className='glyphicon glyphicon-ok' aria-hidden='true'></span>
                </button>
            </div>);

        } else {
            edit_string = (<div className='pull-right'>
                <button className='btn btn-danger' onClick={ this.onDelete }>
                    <span className='glyphicon glyphicon-remove' aria-hidden='true'></span>
                </button>
            </div>);
        }

        return (
            <li className={style}><span className='guest-name'>{guest.name}</span> - {guest.addedBy} {edit_string}
            </li>
        );
    }
}