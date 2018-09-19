<template>
  <section v-if="verified" class="section">
    <h1 class="title has-text-centered">Events</h1>

    <div v-if="social == true">
      <table class="table is-fullwidth is-striped">
        <thead>
        <tr>
          <th>Name</th>
          <th>Guests</th>
          <th>Type</th>
          <th>Date</th>
          <th>Jobs</th>
          <th>Close</th>
          <th>Modify</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="event in events">
          <th>
            <router-link :to="`/party/${event.id}` ">[{{event.type.toUpperCase()}}] {{event.name}}</router-link>
          </th>
          <td>{{event.total}}</td>
          <td>{{capitalize(event.type)}}</td>
          <td>{{event.date}}</td>
          <th v-if="event.jobsUrl">
            <a class="button is-link" :href="`${event.jobsUrl}`" target="_blank">Jobs</a>
          </th>
          <th v-else>
            <button class="button is-link" v-on:click="addUrl(event.id)">Add Jobs Sheet</button>
          </th>
          <td>
            <b-switch @input="close(event.id, event.closed)" v-model="event.closed"></b-switch>
          </td>
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
        <th>Guests</th>
        <th>Type</th>
        <th>Date</th>
        <th>Jobs</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="event in events">
        <th>
          <router-link :to="`/party/${event.id}`">[{{event.type.toUpperCase()}}] {{event.name}}</router-link>
        </th>
        <td>{{event.total}}</td>
        <td>{{capitalize(event.type)}}</td>
        <td>{{event.date}}</td>
        <th v-if="event.jobsUrl">
          <a class="button is-link" :href="`${event.jobsUrl}`" target="_blank">Jobs</a>
        </th>
        <th v-else-if="riskManager">
          <button class="button is-link" v-on:click="addUrl(event.id)">Add Jobs Sheet</button>
        </th>
        <td v-else>Not up</td>
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
        riskManager: false,
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
            total: (currEvents[event].males && currEvents[event].females) ? Object.keys(currEvents[event].males).length + Object.keys(currEvents[event].females).length : 0,
            closed: currEvents[event].closed,
            jobsUrl: currEvents[event].jobsUrl
          });
          i++;
        }
      });
      db.ref('bros/' + vm.userId).once('value').then(function (snapshot) {
        if (snapshot.val() && (snapshot.val().role === "admin" || snapshot.val().role === "social")) {
          vm.social = true;
        } else if (snapshot.val() && (snapshot.val().role === "risk" )) {
          vm.riskManager = true;
        }
        vm.verified = snapshot.val().verified;
      });
    },
    methods: {
      capitalize: function (str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
      },
      close: function (id, closed) {
        firebase.database().ref('events/' + id).update({
          closed: closed
        });
      },
      addUrl: function (id) {
        console.log(id);
        let url = prompt("Please enter the Google sheets URL for the party jobs (with http:// or https:// at the beginning):", "");
        if (!url) {
          //User cancelled prompt
        } else if(url && !url.startsWith("https://") && !url.startsWith("http://")) {
          alert("You didn't start the url with http:// or https://");
        } else {
          firebase.database().ref('events/' + id).update({
            jobsUrl: url
          });
        }
      }
    }
  }

</script>

