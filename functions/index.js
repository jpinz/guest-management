const functions = require('firebase-functions');

// The Firebase Admin SDK to access the Firebase Realtime Database.
const admin = require('firebase-admin');
admin.initializeApp();

/*// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });

// Listens for males added to an event in  /events/:eventID/males and creates a
// sortkey for the guest in /events/:eventID/males/:guestID/sortKey
exports.maleSortkey = functions.database.ref('/events/{eventID}/males/{maleID}')
  .onCreate((snapshot, context) => {
    // Grab the current value of what was written to the Realtime Database.
    const male = snapshot.val();
    console.log('Creating sort key for ' + male.name);
    let sortKeyArr = male.name.toUpperCase().split(' ');
    let sortKey = sortKeyArr.splice(1).join('') + sortKeyArr[0];
    // You must return a Promise when performing asynchronous tasks inside a Functions such as
    // writing to the Firebase Realtime Database.
    // Setting an "uppercase" sibling in the Realtime Database returns a Promise.
    return snapshot.ref.child('sortKey').set(sortKey);
  });

// Listens for females added to an event in  /events/:eventID/females and creates a
// sortkey for the guest in /events/:eventID/females/:guestID/sortKey
exports.femaleSortkey = functions.database.ref('/events/{eventID}/females/{femaleID}')
  .onCreate((snapshot, context) => {
    // Grab the current value of what was written to the Realtime Database.
    const female = snapshot.val();
    console.log('Creating sort key for ' + female.name);
    let sortKeyArr = female.name.toUpperCase().split(' ');
    let sortKey = sortKeyArr.splice(1).join('') + sortKeyArr[0];
    // You must return a Promise when performing asynchronous tasks inside a Functions such as
    // writing to the Firebase Realtime Database.
    // Setting an "uppercase" sibling in the Realtime Database returns a Promise.
    return snapshot.ref.child('sortKey').set(sortKey);
  });

// Listens for males added to an event in  /events/:eventID/males_approval and creates a
// sortkey for the guest in /events/:eventID/males_approval/:guestID/sortKey
exports.maleApprovalSortkey = functions.database.ref('/events/{eventID}/males_approval/{maleID}')
  .onCreate((snapshot, context) => {
    // Grab the current value of what was written to the Realtime Database.
    const male = snapshot.val();
    console.log('Creating sort key for ' + male.name);
    let sortKeyArr = male.name.toUpperCase().split(' ');
    let sortKey = sortKeyArr.splice(1).join('') + sortKeyArr[0];
    // You must return a Promise when performing asynchronous tasks inside a Functions such as
    // writing to the Firebase Realtime Database.
    // Setting an "uppercase" sibling in the Realtime Database returns a Promise.
    return snapshot.ref.child('sortKey').set(sortKey);
  });

// Listens for females added to an event in  /events/:eventID/females_approval and creates a
// sortkey for the guest in /events/:eventID/females_approval/:guestID/sortKey
exports.femaleApprovalSortkey = functions.database.ref('/events/{eventID}/females_approval/{femaleID}')
  .onCreate((snapshot, context) => {
    // Grab the current value of what was written to the Realtime Database.
    const female = snapshot.val();
    console.log('Creating sort key for ' + female.name);
    let sortKeyArr = female.name.toUpperCase().split(' ');
    let sortKey = sortKeyArr.splice(1).join('') + sortKeyArr[0];
    // You must return a Promise when performing asynchronous tasks inside a Functions such as
    // writing to the Firebase Realtime Database.
    // Setting an "uppercase" sibling in the Realtime Database returns a Promise.
    return snapshot.ref.child('sortKey').set(sortKey);
  });*/

// Listens for brothers added to the site in  /bros/:email and creates a
// sortkey for the guest in /bros/:email/sortKey
exports.brotherSortkey = functions.database.ref('/bros/{email}')
  .onCreate((snapshot, context) => {
    // Grab the current value of what was written to the Realtime Database.
    const brother = snapshot.val();
    console.log('Creating sort key for ' + brother.name);
    let sortKeyArr = brother.name.toUpperCase().split(' ');
    let sortKey = sortKeyArr.splice(1).join('') + sortKeyArr[0];
    // You must return a Promise when performing asynchronous tasks inside a Functions such as
    // writing to the Firebase Realtime Database.
    // Setting an "uppercase" sibling in the Realtime Database returns a Promise.
    return snapshot.ref.child('sortKey').set(sortKey);
  });
