<template>
  <section class="section">
    <h1 class="title has-text-centered">Manage Your Account</h1>
    <div class="field">
      <div class="control">
        <label class="label">Email</label>
        <input v-model="email" class="input" type="email" placeholder="Email input">
        <button v-on:click="changeEmail" class="button is-link">Change Email</button>
        <br><br>
        <button v-on:click="resetPassword" class="button is-link">Reset Password</button>

      </div>
    </div>
  </section>
</template>

<script>
  import firebase from 'firebase'

  export default {
    data() {
      return {
        userId: '',
        name: '',
        email: ''
      }
    },
    created() {
      let user = this.$store.state.user;
      let vm = this;

      if (user !== null) {
        user.providerData.forEach(function (profile) {
          vm.userId = profile.uid;
          vm.name = profile.displayName;
          vm.email = profile.email;
        });
      }
    },
    methods: {
      changeEmail: function (event) {
        let user = this.$store.state.user;
        user.updateEmail(this.email).then(function () {
          // Update successful.
          console.log("Successful update of email.")
        }).catch(function (error) {
          // An error happened.
          alert("Error: " + error.message)

        });
      },
      resetPassword: function (event) {
        var auth = firebase.auth();
        auth.sendPasswordResetEmail(this.email).then(function () {
          // Email sent.
          console.log("Successful password reset sent")
        }).catch(function (error) {
          // An error happened.
          alert("Error: " + error.message)
        });
      }
    },
  };
</script>

