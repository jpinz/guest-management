<template>
  <section class="section">
    <h1 class="title has-text-centered">Manage Your Account</h1>
    <div class="field">
      <label class="label">Name</label>
      <div class="control">
        <input v-model="name" class="input" type="text" placeholder="Enter your name">
        <button v-on:click="changeName" class="button is-link">Change Name</button>

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
      let user = firebase.auth().currentUser;
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
      changeName: function (event) {
        let user = firebase.auth().currentUser;
        name = this.name;
        user.updateProfile({
          displayName: name
        }).then(function () {
          // Update successful.
          console.log("Successful update: " + name)
        }).catch(function (error) {
          // An error happened.
          alert("Error: " + error.message)
        });
      },
      changeEmail: function (event) {
        let user = firebase.auth().currentUser;
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

