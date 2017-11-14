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

export function resetPassword (email) {
  return firebaseAuth().sendPasswordResetEmail(email)
}

export function saveUser (user) {
    db.ref('users/' + user.uid).set({
        name: user.displayName,
        email: user.email
    });
}
