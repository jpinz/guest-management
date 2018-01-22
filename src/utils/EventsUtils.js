import { db } from '../config/constants'


export function capitalize(string) {
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
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