import Vue from 'vue';
import App from './App.vue';
import Firebase from 'firebase';
import VueRouter from 'vue-router';
import {store} from './store/store';
import {routes} from './router/routes';
import {config} from "./config/firebaseConfig";
import Buefy from 'buefy'
import 'buefy/dist/buefy.css'

// Initialize Firebase
Firebase.initializeApp(config);

// Set-up and use the Vue Router
// Pass in your routes and then
// Set the mode to use history
// removes # from the URL
Vue.use(VueRouter);
Vue.use(Buefy);

const router = new VueRouter({
  routes: routes,
  mode: 'history'
});

// Check before each page load whether the page requires authentication/
// if it does check whether the user is signed into the web app or
// redirect to the sign-in page to enable them to sign-in
router.beforeEach((to, from, next) => {

  let db = Firebase.database();
  const currentUser = Firebase.auth().currentUser;
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);
  const requiresSocial = to.matched.some(record => record.meta.requiresSocial);

  if (requiresAuth && !currentUser) {
    next('/sign-in');
  } else if (requiresAuth && currentUser) {
    db.ref('bros/' + currentUser.email.substr(0, currentUser.email.indexOf('@'))).once('value').then(function (snapshot) {
      if (snapshot.val() && (snapshot.val().role === "admin" || snapshot.val().role === "social" || snapshot.val().role === "risk")) {
        next();
      } else if (requiresSocial) {
        next(false);
      } else {
        next();
      }
    });

  } else {
    next();
  }

});

// Wrap the vue instance in a Firebase onAuthStateChanged method
// This stops the execution of the navigation guard 'beforeEach'
// method until the Firebase initialization ends
Firebase.auth().onAuthStateChanged(function (user) {

  new Vue({
    el: '#app',
    store: store,
    router: router,
    render: h => h(App)
  });

});
