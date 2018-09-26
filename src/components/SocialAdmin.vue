<template>
  <section class="section">
    <h1 class="title has-text-centered">Manage Social Stuff</h1>
    <router-link to="social/blacklist" class="button is-danger">Manage Blacklist</router-link>
    <br/><br/>

    <p>There are currently {{brothers.length}} brothers with accounts.</p>
    <table class="table is-fullwidth is-striped">
      <thead>
      <tr>
        <th>Name</th>
        <th>Paid Bill</th>
        <th>Role</th>
        <th v-if="role === 'admin'">Verify Account</th>
        <th v-if="role === 'admin'">Delete User</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="bro in brothers">
        <td>{{bro.name}}</td>
        <td>
          <b-switch v-model="bro.paid_bill" @input="update('paid_bill', bro.id, bro.paid_bill)">
            {{ bro.paid_bill }}
          </b-switch>
        </td>
        <td v-if="role === 'admin'">
          <div class="select">
            <select v-model="bro.role" @change="update('role', bro.id, bro.role)">
              <option value="admin">Admin</option>
              <option value="social">Social</option>
              <option value="risk">Risk Manager</option>
              <option value="normal">Normal</option>
            </select>
          </div>
        </td>
        <td v-else>{{bro.role}}</td>
        <td v-if="role === 'admin'">
          <span v-if="bro.verified === true" class="tag is-medium">Verified</span>
          <button v-if="bro.verified === false" v-on:click="update('verified', bro.id, true)" class="button is-primary">
            Verify
          </button>
        </td>
        <td v-if="role === 'admin'">
          <button v-on:click="remove(bro.id, bro.name)" class="button is-danger">
            Delete
          </button>
        </td>
      </tr>
      </tbody>
    </table>
  </section>
</template>

<script>
  import firebase from 'firebase'

  export default {
    data() {
      return {
        userId: '',
        name: '',
        email: '',
        role: '',
        brothers: [],
        broNames: []
      }
    },
    created() {
      let user = this.$store.state.user;
      let vm = this;
      let db = firebase.database();

      if (user !== null) {
        vm.name = user.displayName;
        vm.email = user.email;
        vm.userId = this.$store.state.uid;

      }

      db.ref('bros/').orderByChild('sortKey').on('value', (snapshot) => {
        let i = 0;
        snapshot.forEach(function (child) {
          vm.$set(vm.brothers, i, {
            id: child.key,
            name: child.val().name,
            role: child.val().role,
            paid_bill: child.val().paid_bill,
            email: child.val().email,
            verified: child.val().verified
          });
          i++;
        });
      });

      db.ref('bros/' + vm.userId).once('value').then(function (snapshot) {
        if (snapshot.val() && snapshot.val().role) {
          vm.role = snapshot.val().role;
        }
      });

      db.ref('brotherNames').once('value').then(function (snapshot) {
        if(!snapshot.val() || snapshot.val().length !== vm.brothers.length) {
          for (let i = 0; i < vm.brothers.length; i++) {
            vm.broNames[i] = (vm.brothers[i].name)
          }
          firebase.database().ref('brotherNames').set(vm.broNames);
          console.log("Updated list of brother names!")

        } else {
          vm.broNames = snapshot.val();
        }
      });

    },
    methods: {
      update: function (key, id, value) {
        if (id === this.userId) {
          alert("You just modified a value for your account, make sure to revert it before you exit if you didn't mean to!")
        }
        firebase.database().ref('bros/' + id).update({
          [key]: value
        });
      },
      remove: function (id, name) {
        let db = firebase.database();
        let deletion = false;

        if (confirm(`Are you sure you want to delete ${name}?`)) {
          deletion = true;
        }
        if (deletion) {
          db.ref('bros/' + id).remove();
        }
      }
    },
  };
</script>
