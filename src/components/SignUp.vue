<template>
  <section class="section">
    <h1 class="title has-text-centered">Register</h1>
    <div class="columns">
      <div class="column is-one-third"/>
      <div class="column is-one-third">

        <div class="card">
          <div class="card-header is-centered">
            <h2 class="card-header-title is-centered">Create an Account</h2>
          </div>
          <div class="card-content">
            <form v-on:submit.prevent>
              <div class="field">
                <label class="label">Full Name</label>
                <div class="control has-icons-right">
                  <input v-model="name" class="input" v-bind:class="{ 'input is-danger ': missingName}" type="text"
                         placeholder="Name">
                  <span v-if="missingName" class="icon is-small is-right">
                    <i class="fas fa-exclamation-triangle"></i>
                  </span>
                  <p v-if="missingName" class="help is-danger">Please enter a name.</p>

                </div>
              </div>
              <div class="field">
                <label class="label">Email</label>
                <div class="control">
                  <input class="input" type="email" placeholder="example@email.com" v-model="email">
                </div>
              </div>
              <div class="field">
                <label class="label">Password</label>
                <div class="control">
                  <input class="input" type="password" v-model="password">
                </div>
              </div>
              <button type="submit" class="button is-primary" v-on:click="signUp">Sign-up</button>
            </form>
          </div>
        </div>

      </div>
    </div>
  </section>
</template>

<script>
  import firebase from "firebase";

  export default {
    data: function () {
      return {
        email: "",
        password: "",
        name: "",
        missingName: false,
      };
    },
    methods: {
      signUp: function () {
        let vm = this;
        if (!vm.name || vm.name === undefined || vm.name === "" || vm.name.length === 0) {
          vm.missingName = true;
          return;
        }
        firebase.auth()
          .createUserWithEmailAndPassword(this.email, this.password)
          .then(
            user => {
              let db = firebase.database();

              name = this.name;
              user.updateProfile({
                displayName: name
              }).then(function () {
                // Update successful.
                console.log("Successful name update: " + name)
              }).catch(function (error) {
                // An error happened.
                alert("Error: " + error.message)
              });

              let sortKeyArr = name.split(' ');
              let sortKey = sortKeyArr.splice(1).join('') + sortKeyArr[0];

              db.ref('bros/' + user.uid).set({
                name: name,
                email: user.email,
                paid_bill: false,
                sortKey: sortKey,
                verified: false,
                role: "normal"
              });
              vm.$router.push({path: '/'})
            },
            error => {
              alert(error.message);
            }
          );
      }
    }
  };
</script>
