<template>
  <section class="section">
    <h1 class="title has-text-centered">Parties</h1>
    <table class="table is-fullwidth is-striped">
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
    <br/>

    <button v-on:click='addParty("Jungle Party 2", "party", 3, -1, 0)' class="button">Add Party</button>
  </section>
</template>

<script>
  import firebase from 'firebase'
  import moment from 'moment'

  export default {
    data() {
      return {
        events: []
      }
    },
    created() {
      var db = firebase.database();
      var vm = this;
      var eventsRef = db.ref('events/');
      eventsRef.on('value', function (snapshot) {
        let currEvents = snapshot.val();
        for (let event in currEvents) {
          vm.events.push({
            id: event,
            name: currEvents[event].name,
            date: moment(currEvents[event].date).format("ddd, MMM Do YYYY"),
            type: currEvents[event].type,
            maleGuests: currEvents[event].maleGuests,
            femaleGuests: currEvents[event].femaleGuests
          });
        }
        console.log(snapshot.val());
        console.log(vm.events);
        console.log(vm.events[0].name);

      });
    },
    methods: {
      addParty: function (name, type, maleGuests, femaleGuests, date) {
        var db = firebase.database();
        var newEventId = db.ref().push().key;
        db.ref('events/' + newEventId).set({
          name: name,
          type: type,
          maleGuests: maleGuests,
          femaleGuests: femaleGuests,
          date: date
        });
      }
    }
  }

</script>

