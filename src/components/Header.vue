<template>
  <header>
    <nav>
      <router-link to="/" class="button">Home</router-link>
      <router-link to="parties" class="button" v-if="user">Parties</router-link>
      <router-link to="account" class="button" v-if="user">Account</router-link>
      <router-link to="sign-in" class="button" v-if="!user">Login</router-link>
      <router-link to="sign-up" class="button" v-if="!user">Register</router-link>
      <a class="button" v-on:click="signOut" v-if="user">Log out</a>
    </nav>
  </header>
</template>

<script>
  import Firebase from "firebase";

  export default {
    computed: {
      user() {
        return this.$store.getters.getUser;
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


