import { db } from '../config/constants'
import { getUID } from './auth'
import React from 'react'

export function addMaleGuest (name, party) {
    var newUserId = db.ref().push().key;

    db.ref('guests/male/' + newUserId).set({
        name: name,
        addedBy: getUID(),
        party: party,
        checkedIn: false
    });
}

export function checkIn (id) {

}

export function addFemaleGuest (name) {
db.collection("guests").doc("female").add({
    name: name,
    reference: getUID()
})
    .then(function(docRef) {
        console.log("Document written with ID: ", docRef.id);
    })
    .catch(function(error) {
        console.error("Error adding document: ", error);
    });
}

export function getGuests() {
return db.collection("guests");
}

export function getEvents() {
var events = [];
var eventsRef = db.ref('events/');
eventsRef.on('value', function(snapshot) {
    console.log(snapshot.val());
});



//return <ul>{parties}</ul>;
}

export function addEvent(type, name, date, guestsPerBro) {
var newEventId = db.ref().push().key;

db.ref('events/' + type + '/'+ newEventId).set({
        name: name,
        date: date,
        guestsPerBro: guestsPerBro
    });
}
/*db.collection("events").add({
    name: name,
    type: type,
    date: date,
    guestsPerBro: guestsPerBro
})
    .then(function(docRef) {
        console.log("Document written with ID: ", docRef.id);
    })
    .catch(function(error) {
        console.error("Error adding document: ", error);
    });*/
