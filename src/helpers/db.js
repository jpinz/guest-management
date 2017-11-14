import { db } from '../config/constants'
import { getUID, getUser } from './auth'

export function addMaleGuest (name, party) {
    var newUserId = db.ref().push().key;

    db.ref('guests/male/' + newUserId).set({
        name: name,
        addedByUID: getUser().uid,
        addedByName: getUser().displayName,
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
    var eventsRef = db.ref('events/');
    eventsRef.on('value', function(snapshot) {
        console.log(snapshot.val());
});



//return <ul>{parties}</ul>;
}

export function addEvent(type, name, date, guestsPerBro) {
var newEventId = db.ref().push().key;

db.ref('events/'+ newEventId).set({
        name: name,
        date: date,
        guestsPerBro: guestsPerBro,
        type: type
    });
}

export function capitalize(string) {
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
}
