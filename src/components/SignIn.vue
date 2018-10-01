<template>
  <section class="section">
    <h1 class="title has-text-centered">Login</h1>
    <div class="columns">
      <div class="column is-one-third"/>
      <div class="column is-one-third">

        <div class="card">
          <div class="card-header is-centered">
            <h2 class="card-header-title is-centered">Sign in to Your Account</h2>
          </div>
          <div class="card-content">
            <form v-on:submit.prevent>
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
              <button type="submit" class="button is-primary" v-on:click="signIn">Sign-in</button>
              <br/> <br/>
              <button type="submit" class="button is-info" v-on:click="resetPassword">Forgot Password?</button>

            </form>
          </div>
        </div>

      </div>
    </div>
  </section>
</template>

<script>
  import Firebase from "firebase";

  export default {
    data: function () {
      return {
        email: "",
        password: ""
      };
    },
    methods: {
      signIn: function () {
        Firebase.auth()
          .signInWithEmailAndPassword(this.email, this.password)
          .then(
            user => {
              this.$router.replace('/');
            },
            error => {
              alert(error.message);
            }
          );
      },
      resetPassword: function () {
        var auth = Firebase.auth();
        let email = prompt("Enter your email address")
        if(!email) {
          alert("Enter an email address")
          return
        }
        auth.sendPasswordResetEmail(email).then(function() {
          // Email sent.
          alert("Email sent!")
        }).catch(function(error) {
          // An error happened.
          alert(error.message)
        });
      }
    }
  };
</script>
