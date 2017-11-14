import firebase from 'firebase'

const config = {
  apiKey: "AIzaSyA3jEriGQpF0rvDsmiZ8z887S4GWsGCM8o",
  authDomain: "zm-parties.firebaseapp.com",
  databaseURL: "https://zm-parties.firebaseio.com",
  projectId: "zm-parties"
};

firebase.initializeApp(config);

export const ref = firebase.database().ref();
export const db = firebase.database();

export const firebaseAuth = firebase.auth;
require("firebase/firestore");
export const firestore = firebase.firestore();

