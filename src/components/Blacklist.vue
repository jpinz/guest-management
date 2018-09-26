<template>
  <section class="section">
    <h1 class="title has-text-centered">Manage Blacklist</h1>

    <input v-model="input" class="input" type="text" placeholder="Enter name">
    <br/>
    <div class="addGuest">
      <button v-on:click='addToBlackList(input, name, userId)' class="button is-danger" :disabled="role === 'risk'">Add to Blacklst</button>
    </div>

    <table class="table is-fullwidth is-striped">
      <thead>
      <tr>
        <th>Name</th>
        <th>Added By</th>
        <th>Date</th>
        <th v-if="role === 'admin'">Remove From Blacklist</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="(item, index) in blacklist">
        <td>{{item.name}}</td>
        <td>{{item.added_by}}</td>
        <td>{{item.added_date}}</td>
        <td v-if="role === 'admin'">
          <button v-on:click="remove(item.name, item.id, index)" class="button is-primary">
            Remove
          </button>
        </td>
      </tr>
      </tbody>
    </table>
  </section>
</template>

<script>
  import firebase from 'firebase'
  import moment from 'moment'

  export default {
    data() {
      return {
        userId: '',
        name: '',
        email: '',
        input: '',
        role: '',
        blacklist: []
      }
    },
    created() {
      let user = this.$store.state.user;
      let vm = this;
      let db = firebase.database();

      if (user !== null) {
        vm.userId = this.$store.state.uid;
        vm.name = user.displayName;
        vm.email = user.email;
      }

      db.ref('blacklist/').orderByChild('addedDate').on('value', (snapshot) => {
        let i = 0;
        snapshot.forEach(function (child) {
          vm.$set(vm.blacklist, i, {
            id: child.key,
            name: child.val().name,
            added_by: child.val().addedByName,
            added_date: moment(child.val().addedDate).format("ddd, MMM Do YYYY"),
          });
          i++;
        });
      });

      db.ref('bros/' + vm.userId).once('value').then(function (snapshot) {
        if (snapshot.val() && snapshot.val().role) {
          vm.role = snapshot.val().role;
        }
      });
    },
    methods: {
      addToBlackList: function (name, addedByName, addedByUID) {
        this.input = '';

        let db = firebase.database();

        if (!name || name === undefined || name === "" || name.length === 0) {
          alert("No name entered!");
        } else {
          let newBlacklistId = db.ref().push().key;
          db.ref('blacklist/' + newBlacklistId).set({
            name: name,
            addedByName: addedByName,
            addedByUID: addedByUID,
            addedDate: new Date().getTime()
          });
        }
      },
      remove: function (name, id, index) {
        if (confirm("Are you sure you want to remove " + name + " from the blacklist?")) {
          firebase.database().ref('blacklist/' + id).remove();
          this.blacklist.splice(index, 1);
        }
      }
    },
  };
</script>


