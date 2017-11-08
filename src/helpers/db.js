import { db } from '../config/constants'
import { getUID } from './auth'
import React from 'react'

export function addMaleGuest (name) {
    db.collection("guests").doc("male").add({
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

export function getParties() {
    var parties = [];
    db.collection("events").onSnapshot(function(querySnapshot) {
        querySnapshot.forEach(function(doc) {
            var d = doc.data();
            d.id = doc.id;
            parties.push(d);
        });
        console.log(parties);
        console.log("Current party list: ", parties.join(", "));

    });
}

export function addEvent(type, name, date, guestsPerBro) {
    db.collection("events").add({
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
        });
}