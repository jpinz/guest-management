<template>
  <main id="app" class="section">
    <title>{{title}}</title>
    <div class="container">
      <nav-main></nav-main>
      <router-view></router-view>
    </div>
  </main>
</template>

<script>
  import Header from './components/Header.vue';
  import * as config from '../appConfig.json';

  export default {
    data() {
      return {
        title: config.title,
        description: config.description,
        id: config.id
      }
    },
    components: {
      navMain: Header
    },
    methods: {
      setUser: function () {
        this.$store.dispatch('setUser');
      }
    },
    created() {
      // when the app is created run the set user method
      // this uses Vuex to check if a user is signed in
      // check out mutations in the store.js file
      this.setUser();
    }
  };
</script>
