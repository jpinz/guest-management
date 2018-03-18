<template>
  <header>
    <nav>
      <router-link to="/" class="button" v-if="user">Events</router-link>
      <router-link to="account" class="button" v-if="user">Account</router-link>
      <router-link to="social" class="button" v-if="social">Social Settings</router-link>
      <router-link to="sign-in" class="button" v-if="!user">Login</router-link>
      <router-link to="sign-up" class="button" v-if="!user">Register</router-link>
      <a class="button" v-on:click="signOut" v-if="user">Log out</a>
    </nav>
  </header>
</template>

<script>
  import Firebase from "firebase";

  export default {
    data() {
      return {
        social: false
      }
    },
    computed: {
      user() {
        return this.$store.getters.getUser;
      }
    },
    created() {
      let db = Firebase.database();
      let user = Firebase.auth().currentUser;
      let vm = this;
      if (user) {
        db.ref('bros/' + user.uid).once('value').then(function (snapshot) {
          if (snapshot.val() && (snapshot.val().role === "admin" || snapshot.val().role === "social")) {
            vm.social = true;
          }
        });
      }
    },
    methods: {
      signOut: function () {
        Firebase.auth()
          .signOut()
          .then(() => {
            this.$router.replace('sign-in');
          });
      }
    }
  };
</script>


