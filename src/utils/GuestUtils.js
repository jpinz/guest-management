import { db } from '../config/constants'
import { getUser } from '../helpers/auth'

export function checkIn (id) {

}
export function addMaleGuest (name, party) {
    var newUserId = db.ref().push().key;

    db.ref('guests/' + party + '/male/' + newUserId).set({
        name: name,
        addedBy: getUser().displayName,
        checkedIn: false
    });
}



export function addFemaleGuest (name, party) {
    var newUserId = db.ref().push().key;

    db.ref('guests/' + party + '/female/' + newUserId).set({
        name: name,
        addedBy: getUser().displayName,
        checkedIn: false
    });
}

export function getGuests() {
    return db.collection("guests");
}

export function setGuestStatus (gender, party_id, id, status) {
    console.log("guests/" + party_id + '/' + gender + '/' + id + "/checkedIn/" + status);
    db.ref("guests/" + party_id + '/' + gender + '/' + id + "/checkedIn").set(status);
}

export function deleteGuest (gender, id, party_id) {
    db.ref("guests/" + party_id + '/' + gender + '/' + id).remove();
}
