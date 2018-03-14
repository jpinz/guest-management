<template>
  <section class="section">
    <h1 class="title has-text-centered">{{party_name}}</h1>
    <h4 class="subtitle has-text-centered is-4">{{party_date}} - {{party_type}}</h4>

    <div class="field">
      <div class="control">
        <input v-model="input" class="input" type="text" placeholder="Enter your name" id="searchbar">

        <br/>
        <div class="addGuest">
          <button v-on:click='addMale(input , -1, name, userId)' class="button  is-info">Add Male(s)</button>
        </div>
        <div class="addGuest">
          <button v-on:click='addFemale(input, -1, name, userId)' class="button  is-danger">Add Female(s)</button>
        </div>
      </div>
    </div>
    <br/> <br/> <br/>

    <div class="columns">
      <div class="column is-half">
        <h4 class="title has-text-centered is-4">Males</h4>
        <table class="table is-fullwidth">
          <thead>
          <tr>
            <th>Name</th>
            <th>Added By</th>
            <th>Checked In</th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="male in males" :key="male.id">
            <th>{{male.name}}</th>
            <td>{{male.addedByName}}</td>
            <td v-if="male.checkedIn == -1">
              <button v-on:click="checkIn(male, true)" class="button is-info">Check in</button>
            </td>
            <td v-else><span class="tag is-info">{{male.checkedIn}}</span></td>
          </tr>
          </tbody>
        </table>
      </div>
      <div class="column is-half">
        <h4 class="title has-text-centered is-4">Females</h4>
        <table class="table is-fullwidth">
          <thead>
          <tr>
            <th>Name</th>
            <th>Added By</th>
            <th>Checked In</th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="female in females" :key="female.id">
            <th>{{female.name}}</th>
            <td>{{female.addedByName}}</td>
            <td v-if="female.checkedIn == -1">
              <button v-on:click="checkIn(female, false)" class="button is-danger">Check in</button>
            </td>
            <td v-else><span class="tag is-danger">{{female.checkedIn}}</span></td>
          </tr>
          </tbody>
        </table>
      </div>
    </div>

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
        party_name: '',
        party_id: this.$route.params.id.toString(),
        party_date: '',
        party_type: '',
        input: '',
        males: [],
        females: []
      }
    },
    created() {
      let db = firebase.database();
      let user = firebase.auth().currentUser;
      let vm = this;

      if (user !== null) {
        vm.userId = user.uid;
        vm.name = user.displayName;
        vm.email = user.email;
      }

      const eventRef = db.ref('events/' + this.$route.params.id);
      eventRef.on('value', (snapshot) => {
        let event = snapshot.val();
        vm.party_type = this.capitalize(event.type);
        vm.party_date = moment(event.date).format("ddd, MMM Do YYYY");
        vm.party_name = event.name;
      });

      const malesRef = db.ref('events/' + this.$route.params.id + '/males');
      malesRef.orderByChild('sortKey').on('value', (snapshot) => {
        let i = 0;
        snapshot.forEach(function (child) {
          vm.$set(vm.males, i, {
            id: child.key,
            name: child.val().name,
            checkedIn: (child.val().checkedIn === -1) ? -1 : moment(child.val().checkedIn).format("LTS"),
            addedByName: child.val().addedByName,
            addedByUID: child.val().addedByUID
          });
          i++;
        });
      });

      const femalesRef = db.ref('events/' + this.$route.params.id + '/females');
      femalesRef.orderByChild('sortKey').on('value', (snapshot) => {
        let i = 0;
        snapshot.forEach(function (child) {
          vm.$set(vm.females, i, {
            id: child.key,
            name: child.val().name,
            checkedIn: (child.val().checkedIn === -1) ? -1 : moment(child.val().checkedIn).format("LTS"),
            addedByName: child.val().addedByName,
            addedByUID: child.val().addedByUID
          });
          i++;
        });
      });
    },
    methods: {
      capitalize: function (str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
      },
      checkIn: function (guest, isMale) {
        let db = firebase.database();
        let d = new Date();
        if (isMale) {
          db.ref('events/' + this.$route.params.id + '/males/' + guest.id).update({'checkedIn': d.getTime()});
        } else {
          db.ref('events/' + this.$route.params.id + '/females/' + guest.id).update({'checkedIn': d.getTime()});
        }
        console.log("Checked in: " + guest);
      },
      addMale: function (nameInput, checkedIn, addedByName, addedByUID) {
        this.input = '';
        let names = nameInput.split(',');
        console.log(names);
        let addr = 'events/' + this.$route.params.id + '/males/';
        let db = firebase.database();
        names.forEach(function (name) {
          let newMaleId = db.ref().push().key;
          let sortKeyArr = name.split(' ');
          let sortKey = sortKeyArr.splice(1).join('') + sortKeyArr[0];
          console.log(sortKey);
          db.ref(addr + newMaleId).set({
            name: name,
            checkedIn: checkedIn,
            addedByName: addedByName,
            addedByUID: addedByUID,
            sortKey: sortKey
          });
        });
      },
      addFemale: function (nameInput, checkedIn, addedByName, addedByUID) {
        this.input = '';
        let names = nameInput.split(',');
        console.log(names);
        let db = firebase.database();
        let addr = 'events/' + this.$route.params.id + '/females/';
        names.forEach(function (name) {
          let newFemaleId = db.ref().push().key;
          let sortKeyArr = name.split(' ');
          let sortKey = sortKeyArr.splice(1).join('') + sortKeyArr[0];
          console.log(sortKey);
          db.ref(addr + newFemaleId).set({
            name: name,
            checkedIn: checkedIn,
            addedByName: addedByName,
            addedByUID: addedByUID,
            sortKey: sortKey
          });
        });
      }
    },
  };
</script>

<style scoped>
  .addGuest {
    padding-left: 20px;
    float: left;
  }
</style>
