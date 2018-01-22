import { firebaseAuth, db } from '../config/constants'

export function auth (email, pw) {
  return firebaseAuth().createUserWithEmailAndPassword(email, pw)
}

export function logout () {
  return firebaseAuth().signOut()
}

export function login (email, pw) {
  return firebaseAuth().signInWithEmailAndPassword(email, pw)
}

export function isAdmin() {
    return firebaseAuth().currentUser;
}

export function isSocial() {
    return firebaseAuth().currentUser;
}

export function getUser() {
    return firebaseAuth().currentUser;
}

export function getUID() {
    return firebaseAuth().currentUser.uid;
}

export function setSocial (user, isSocial) {
    db.ref('users/' + user.uid).set({
        social: isSocial
    });
}

export function setAdmin (user, isAdmin) {
    db.ref('users/' + user.uid).set({
        admin: isAdmin
    });
}

export function setUserName(name) {
    getUser().updateProfile({
        displayName: name
    }).then(function() {
        // Update successful.
        console.log("Name update succeeded" + this);
        saveUser(getUser());
    }).catch(function(error) {
        // An error happened.
        console.log(error);
    });
}

export function setEmail(email) {
    getUser().updateEmail(email).then(function () {
        // Update successful.
        saveUser(getUser());
        console.log("Email update succeeded" + this);
    }).catch(function (error) {
        // An error happened.
        console.log(error);
    });
}

export function resetPassword (email) {
  return firebaseAuth().sendPasswordResetEmail(email)
}

export function saveUser (user) {
    db.ref('users/' + user.uid).set({
        name: user.displayName,
        email: user.email
    });
}
