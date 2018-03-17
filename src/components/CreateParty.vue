<template>
  <section class="section">
    <h1 class="title has-text-centered">Create a new Event</h1>
    <div class="field">
      <label class="label">Name</label>
      <div class="control has-icons-right">
        <input v-model="name" class="input" v-bind:class="{ 'input is-danger ': missingName}" type="text"
               placeholder="Party Name">
        <span v-if="missingName" class="icon is-small is-right">
          <i class="fas fa-exclamation-triangle"></i>
        </span>
        <p v-if="missingName" class="help is-danger">Please enter a name.</p>

      </div>
      <label class="label">Type of Event</label>
      <div class="select">
        <select v-model="type">
          <option value="party">Party</option>
          <option value="social">Social</option>
          <option value="pregame">Pregame</option>
          <option value="semi-formal">Semi-Formal</option>
          <option value="nocial">Nocial</option>
          <option value="other">Other</option>
        </select>
      </div>

      <b-field label="Select Date">
        <b-datepicker v-model="date"
                      placeholder="Type or select a date..."
                      icon="calendar-today">
        </b-datepicker>
      </b-field>
      <b-field label="Select Time">
        <b-timepicker v-model="time"
                      placeholder="Type or select a time..."
                      icon="clock"
                      :readonly="false">
        </b-timepicker>
      </b-field>

      <label class="label">Number of Male Guests per Brother</label>
      <div class="control">
        <input v-model="maleGuestCount" class="input" type="number" placeholder="Number">
      </div>

      <label class="label">Number of Female Guests per Brother</label>
      <div class="control">
        <input v-model="femaleGuestCount" class="input" type="Number" placeholder="Number">
      </div>
      <br/>
      <button v-on:click='addParty(name, type, parseInt(maleGuestCount), parseInt(femaleGuestCount), date)'
              class="button">Add Party
      </button>
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
        email: '',
        missingName: false,
        type: 'social',
        date: new Date(),
        time: new Date(),
        maleGuestCount: 0,
        femaleGuestCount: 0
      }
    },
    created() {

    },
    methods: {
      addParty: function (name, type, maleGuests, femaleGuests, date) {
        let db = firebase.database();
        let vm = this;

        if (!name || name === undefined || name === "" || name.length === 0) {
          vm.missingName = true;
          return;
        }
        //date.setTime(vm.time.getTime());
        let newEventId = db.ref().push().key;
        db.ref('events/' + newEventId).set({
          name: name,
          type: type,
          maleGuests: maleGuests,
          femaleGuests: femaleGuests,
          date: date
        });

        this.$router.push({path: `/party/${newEventId}`})

      }
    },
  };
</script>

