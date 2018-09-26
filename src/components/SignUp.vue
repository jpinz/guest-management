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
              <b-field label="Email">
                <b-input type="email" placeholder="example@email.com" v-model="email"></b-input>
              </b-field>

              <b-field label="Password">
                <b-input type="password" v-model="password" placeholder="Password"></b-input>
              </b-field>
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
        missingName: false
      };
    },
    methods: {
      signUp: function () {
        let vm = this;
        if (!vm.name || vm.name === undefined || vm.name === "" || vm.name.length === 0) {
          vm.missingName = true;
          return;
        }
        if (!vm.email.includes("wpi.edu")) {
          alert("Please use your wpi.edu email");
          vm.email = '';
          return;
        }

        let db = firebase.database();

        firebase.auth()
          .createUserWithEmailAndPassword(vm.email, vm.password)
          .then(
            user => {
              user.user.updateProfile({
                displayName: vm.name
              }).then(function () {
                // Update successful.
                console.log("Successful name update: " + vm.name)
              }).catch(function (error) {
                // An error happened.
                alert("Error: " + error.message)
              });

              let sortKeyArr = vm.name.split(' ');
              let sortKey = sortKeyArr.splice(1).join('') + sortKeyArr[0];
              console.log("name: " + vm.name + " email: " + vm.email + " sortKey: " + sortKey)
              db.ref('bros/' + vm.email.substr(0, vm.email.indexOf('@'))).set({
                name: vm.name,
                email: vm.email,
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
