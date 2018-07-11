<template>
  <section class="section">
    <h1 v-if="!party_id" class="title has-text-centered">Create a new Event</h1>
    <h1 v-else='' class="title has-text-centered">Edit {{name}}</h1>
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
        <b-datepicker v-model="party_date"
                      placeholder="Type or select a date..."
                      icon="calendar-today">
        </b-datepicker>
      </b-field>

      <label class="label">Number of Male Guests per Brother</label>
      <div class="control">
        <input v-model="maleGuestCount" class="input" type="number" :disabled="generalGuestCount != 0"
               placeholder="Number">
      </div>

      <label class="label">Number of Female Guests per Brother</label>
      <div class="control">
        <input v-model="femaleGuestCount" class="input" type="Number" :disabled="generalGuestCount != 0"
               placeholder="Number">
      </div>

      <label class="label">Number of General Guests per Brother</label>
      <div class="control">
        <input v-model="generalGuestCount" class="input" type="Number" placeholder="Number">
      </div>
      <p>Use General guests and leave Males and Females at 0 for just a general guest count that disregards gender.</p>
      <p>Use -1 for infinite.</p>
      <br/>
      <button v-if="party_id" v-on:click='addParty'
              class="button is-link">Edit Event
      </button>
      <button v-else v-on:click='addParty'
              class="button is-link">Add Party
      </button>
      <br/><br/>
      <button v-if="party_id" v-on:click='download'
              class="button is-info">Download Event
      </button>
      <br/><br/>
      <button v-if="party_id" v-on:click='remove'
              class="button is-danger">Delete Event
      </button>
    </div>
  </section>
</template>

<script>
  import firebase from 'firebase'

  export default {
    data () {
      return {
        userId: '',
        name: '',
        email: '',
        party_id: this.$route.query.edit,
        missingName: false,
        type: 'social',
        party_date: new Date(),
        brothers: [],
        risk: [],
        maleGuestCount: 0,
        femaleGuestCount: 0,
        generalGuestCount: 0
      }
    },
    created () {
      let db = firebase.database()
      let vm = this

      db.ref('bros/').orderByChild('sortKey').on('value', (snapshot) => {
        let i = 0
        let k = 0
        snapshot.forEach(function (child) {
          if (child.val().role === "risk") {
            console.log(child.val());
            vm.$set(vm.risk, k, child.val().name)
            k++
          } else {
            vm.$set(vm.brothers, i, child.val().name)
            i++
          }
        })
      })

      if (vm.party_id) {
        const eventRef = db.ref('events/' + vm.party_id)
        eventRef.on('value', (snapshot) => {
          let event = snapshot.val()
          vm.type = event.type
          vm.party_date = new Date(event.party_date)
          vm.name = event.name;
          (event.maleGuests !== -1 ) ? vm.maleGuestCount = event.maleGuests : vm.maleGuestCount = -1;
          (event.femaleGuests !== -1 ) ? vm.femaleGuestCount = event.femaleGuests : vm.femaleGuestCount = -1
          if (event.generalGuests) {
            if (event.generalGuests !== -1) {
              vm.generalGuestCount = event.generalGuests
            } else {
              vm.generalGuestCount = -1
            }
          } else {
            vm.generalGuestCount = 0
          }
          (event.generalGuests) ? vm.generalGuestCount = event.generalGuests : vm.generalGuestCount = 0
          //(event.generalGuests !== -1 ) ? vm.generalGuestCount = event.generalGuests : vm.generalGuestCount = -1;

        })
      }
    },
    methods: {
      addParty: function () {
        let db = firebase.database()
        let vm = this

        if (!vm.name || vm.name === undefined || vm.name === '' || vm.name.length === 0) {
          vm.missingName = true
          return
        }
        if (vm.type === 'pregame') {
          vm.party_date.setHours(21)
        } else {
          vm.party_date.setHours(22)
        }

        if (vm.party_id) {
          console.log('Updating party: ' + vm.party_id)
          if (vm.generalGuestCount !== 0) {
            db.ref('events/' + vm.party_id).update({
              name: vm.name,
              type: vm.type,
              generalGuests: parseInt(vm.generalGuestCount),
              party_date: vm.party_date.getTime()
            })
          } else {
            db.ref('events/' + vm.party_id).update({
              name: vm.name,
              type: vm.type,
              maleGuests: parseInt(vm.maleGuestCount),
              femaleGuests: parseInt(vm.femaleGuestCount),
              party_date: vm.party_date.getTime()
            })
          }
          this.$router.push({path: `/party/${vm.party_id}`})
        } else {
          let newEventId = db.ref().push().key
          if (vm.generalGuestCount !== 0 && vm.maleGuestCount === 0 && vm.femaleGuestCount === 0) {
            db.ref('events/' + newEventId).set({
              name: vm.name,
              type: vm.type,
              generalGuests: parseInt(vm.generalGuestCount),
              party_date: vm.party_date.getTime(),
              closed: false
            })
          } else {
            db.ref('events/' + newEventId).set({
              name: vm.name,
              type: vm.type,
              maleGuests: parseInt(vm.maleGuestCount),
              femaleGuests: parseInt(vm.femaleGuestCount),
              party_date: vm.party_date.getTime(),
              jobs: {
                'risk': vm.risk,
                'shame': vm.brothers,
                'jobs': {
                  0:{time: 10},
                  1:{time: 11},
                  2:{time: 12},
                  3:{time: 1}
                }
              },
              closed: false
            })
          }

          this.$router.push({path: `/party/${newEventId}`})
        }
      },
      download: function () {
        let db = firebase.database()
        let vm = this
        const eventRef = db.ref('events/' + vm.party_id)
        eventRef.once('value').then(function (snapshot) {
          let a = document.createElement('a')
          let file = new Blob([JSON.stringify(snapshot.val(), null, 2)], {type: 'application/json'})
          //Only save to firebase when deleting
          let storageRef = firebase.storage().ref()
          let dataRef = storageRef.child(vm.name.replace(' ', '_') + '_data.json')
          dataRef.put(file).then(function (snapshot) {
            console.log('Uploaded a blob or file!')
          })
          a.href = URL.createObjectURL(file)
          a.download = vm.name.replace(' ', '_') + '_data.json'
          a.click()
          alert('Will save a copy to the firebase storage when the party gets deleted.')
        })
      },
      remove: function () {
        let db = firebase.database()
        let vm = this
        let deletion = false

        if (confirm('Are you sure you want to delete this event? (WILL DOWNLOAD LIST BEFORE DELETION)')) {
          deletion = true
        }
        if (deletion) {
          const eventRef = db.ref('events/' + vm.party_id)
          eventRef.once('value').then(function (snapshot) {
            let a = document.createElement('a')
            let file = new Blob([JSON.stringify(snapshot.val(), null, 2)], {type: 'application/json'})
            let storageRef = firebase.storage().ref()
            let dataRef = storageRef.child(vm.name.replace(' ', '_') + '_data.json')
            dataRef.put(file).then(function (snapshot) {
              console.log('Uploaded a blob or file!')
            })
            a.href = URL.createObjectURL(file)
            a.download = vm.name.replace(' ', '_') + '_data.json'
            a.click()
            alert('Also saved a copy to firebase hosting.')
          })

          db.ref('events/' + vm.party_id).remove()
          db.ref('bros/').once('value').then(function (snapshot) {
            for (let key in snapshot.val()) {
              db.ref('bros/' + key + '/events/' + vm.party_id).remove()
            }
          })
          vm.$router.push({path: `/`})
        }
      }
    },
  }
</script>

