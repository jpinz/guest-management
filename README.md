# guest-management

> Guest List management website for social events.

## Build Setup

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run startLocal

# build for production with minification
npm run build

# build for production and view the bundle analyzer report
npm run build --report

# serve the built application at localhost:5000 (only after build)
npm run start

# run unit tests
npm run unit

# run e2e tests
npm run e2e

# run all tests
npm test
```

## Normal config
Change info in appConfig.json to whatever you want.

## Firebase config
First make a [firebase app](https://firebase.google.com/).

Then get the config information

Put your config (should look like this):

```
export const config = {
  apiKey: '<API_KEY>',
  authDomain: '<PROJECT_ID>.firebaseapp.com',
  databaseURL: 'https://<DATABASE_NAME>.firebaseio.com',
  projectId: '<PROJECT_ID>',
  storageBucket: '<BUCKET>.appspot.com',
  messagingSenderId: '<SENDER_ID>'
};
```

into a file called `firebaseConfig.js` in `src/config`

Make sure you enable firebase email/password authentication too!
