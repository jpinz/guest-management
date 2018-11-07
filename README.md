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

Make sure you enable firebase email/password authentication: https://console.firebase.google.com/project/fraternity-parties/authentication/providers

Then get the config information, from https://console.firebase.google.com/project/fraternity-parties/settings/general/ scroll to the bottom and click the icon named "Add Firebase to your web app", then copy from `apiKey` to the end of the `messagingSenderId` line, and paste in a javascript filewith the following structure:

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

## How to finish the setup and deploy the site:

1. firebase init
2. Yes project
3. check Database, functions. hosting, and storage
4. select your project (if issue, make sure there's no .firebaserc)
5. yes on database.json
6. no on overwrite
7. yes on javascript
8. no on eslint
9. no on override functions/package.json
10. no on override functions/index.js
11. yes on install dependencies
12. instead of public chose dist as directory
13. No on single page
14. enter on storage.rules

**then run `npm run build` followed by `firebase deploy`**

Then your site should be available at http://name-of-project.firebaseapp.com
