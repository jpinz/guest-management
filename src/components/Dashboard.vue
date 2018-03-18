<template>
  <section v-if="verified" class="section">
    <h1 class="title has-text-centered">Events</h1>

    <div v-if="social == true">
      <table class="table is-fullwidth is-striped">
        <thead>
        <tr>
          <th>Name</th>
          <th>Type</th>
          <th>Date</th>
          <th>Modify</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="event in events">
          <th>
            <router-link :to="`/party/${event.id}`">{{event.name}}</router-link>
          </th>
          <td>{{capitalize(event.type)}}</td>
          <td>{{event.date}}</td>
          <th>
            <router-link :to="`/createParty?edit=${event.id}`">Edit</router-link>
          </th>
        </tr>
        </tbody>
      </table>
      <router-link class="button" :to="`/createParty`">Add Party</router-link>
    </div>
    <table class="table is-fullwidth is-striped" v-else>
      <thead>
      <tr>
        <th>Name</th>
        <th>Type</th>
        <th>Date</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="event in events">
        <th>
          <router-link :to="`/party/${event.id}`">{{event.name}}</router-link>
        </th>
        <td>{{event.type}}</td>
        <td>{{event.date}}</td>
      </tr>
      </tbody>
    </table>
  </section>
  <section v-else>
    <br/>
    <div class="notification is-danger">
      Your account has not been verified, please reach out to social to have them verify it for you.
    </div>
  </section>
</template>

<script>
  import firebase from 'firebase'
  import moment from 'moment'

  export default {
    data() {
      return {
        events: [],
        social: false,
        name: '',
        email: '',
        userId: '',
        verified: false
      }
    },
    created() {
      let db = firebase.database();
      let vm = this;
      let user = firebase.auth().currentUser;

      if (user !== null) {
        vm.name = user.displayName;
        vm.email = user.email;
        vm.userId = user.uid;
      }

      var eventsRef = db.ref('events/');
      eventsRef.on('value', function (snapshot) {
        let currEvents = snapshot.val();
        let i = 0;
        for (let event in currEvents) {
          vm.$set(vm.events, i, {
            id: event,
            name: currEvents[event].name,
            date: moment(currEvents[event].party_date).format("ddd, MMM Do YYYY"),
            type: currEvents[event].type,
            maleGuests: currEvents[event].maleGuests,
            femaleGuests: currEvents[event].femaleGuests
          });
          i++;
        }
      });
      db.ref('bros/' + vm.userId).once('value').then(function (snapshot) {
        if (snapshot.val() && (snapshot.val().role === "admin" || snapshot.val().role === "social")) {
          vm.social = true;
        }
        vm.verified = snapshot.val().verified;
      });
    },
    methods: {
      capitalize: function (str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
      }
    }
  }

</script>

