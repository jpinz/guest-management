<template>
  <section class="section">
    <h1 class="title has-text-centered">{{party_name}}</h1>
    <h4 class="subtitle has-text-centered is-4">{{party_date}} - {{party_type}}</h4>
    <br/>
    <div v-if="isShamed">
      <div class="notification is-danger">
        SHAME SHAME ON YOU - Go sign up for a party job
      </div>
      <br/>
    </div>
    <div>
      <div class="tile is-ancestor">
        <div class="tile is-parent">
          <article class="tile is-child box">
            <p class="subtitle">Sober Volunteers</p>
            <div class="tags dragArea">
              <draggable v-model="soberVolunteers" @remove="updateJobs" class="dragArea"
                         id="soberVolunteers"
                         :options="{group:'brothers'}">
              <span v-for="(brother) in soberVolunteers" v-if="brother.name === name" :id="brother.id"
                    class="tag is-medium is-info">{{brother.name}}</span>
                <span v-else-if="brother.name !== name" class="tag is-medium" :id="brother.id">{{brother.name}}</span>
              </draggable>
            </div>
          </article>
        </div>
        <div class="tile is-parent">
          <article class="tile is-child box">
            <p class="subtitle">Sober Officers</p>
            <div class="tags dragArea">
              <draggable v-model="soberOfficers" @remove="updateJobs" class="dragArea" id="soberOfficers"
                         :options="{group:'brothers'}">
              <span v-for="(brother) in soberOfficers" v-if="brother.name === name" :id="brother.id"
                    class="tag is-medium is-info">{{brother.name}}</span>
                <span v-else-if="brother.name !== name" class="tag is-medium" :id="brother.id">{{brother.name}}</span>
              </draggable>
            </div>
          </article>
        </div>
        <div class="tile is-parent">
          <article class="tile is-child box">
            <p class="subtitle">Risk Managers</p>
            <div class="tags">
              <span v-for="(brother) in riskManagers" v-if="brother.name === name" :id="brother.id"
                    class="tag is-medium is-info">{{brother.name}}</span>
              <span v-else-if="brother.name !== name" class="tag is-medium" :id="brother.id">{{brother.name}}</span>
            </div>
          </article>
        </div>
      </div>
      <table class="table is-bordered is-striped">
        <thead>
        <tr>
          <th>Time</th>
          <th>Outside Front Door</th>
          <th>Inside Front Door</th>
          <th>Coat Room</th>
          <th>Bar</th>
          <th>Basement Back Door</th>
          <th>Back Door</th>
          <th>DJ</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="(job, key) in jobs" :key="key">
          <th v-if="key == 0">10 PM</th>
          <th v-if="key == 1">11 PM</th>
          <th v-if="key == 2">12 AM</th>
          <th v-if="key == 3">1 AM</th>
          <td class="dragArea">
            <div class="tags dragArea">
              <draggable v-model="jobs[key]['outsideFrontDoor']" class="dragArea"
                         @remove="updateJobs" :id="'outsideFrontDoor'+key"
                         :options="{group:'brothers'}">
              <span v-for="outsideFrontDoor in jobs[key]['outsideFrontDoor']" v-if="outsideFrontDoor.name === name"
                    :id="outsideFrontDoor.id"
                    class="tag is-info">{{outsideFrontDoor.name}}</span>
                <span v-else-if="outsideFrontDoor.name !== name" class="tag"
                      :id="outsideFrontDoor.id">{{outsideFrontDoor.name}}</span>
              </draggable>
            </div>
          </td>
          <td class="dragArea">
            <div class="tags dragArea">
              <draggable v-model="jobs[key]['insideFrontDoor']" class="dragArea"
                         @remove="updateJobs" :id="'insideFrontDoor'+key"
                         :options="{group:'brothers'}">
              <span v-for="insideFrontDoor in jobs[key]['insideFrontDoor']" v-if="insideFrontDoor.name === name"
                    :id="insideFrontDoor.id"
                    class="tag is-info">{{insideFrontDoor.name}}</span>
                <span v-else-if="insideFrontDoor.name !== name" class="tag"
                      :id="insideFrontDoor.id">{{insideFrontDoor.name}}</span>
              </draggable>
            </div>
          </td>
          <td class="dragArea">
            <div class="tags dragArea">
              <draggable v-model="jobs[key]['coatRoom']" class="dragArea"
                         @remove="updateJobs" :id="'coatRoom'+key"
                         :options="{group:'brothers'}">
              <span v-for="coatRoom in jobs[key]['coatRoom']" v-if="coatRoom.name === name" :id="coatRoom.id"
                    class="tag is-info">{{coatRoom.name}}</span>
                <span v-else-if="coatRoom.name !== name" class="tag" :id="coatRoom.id">{{coatRoom.name}}</span>
              </draggable>
            </div>
          </td>
          <td class="dragArea">
            <div class="tags dragArea">
              <draggable v-model="jobs[key]['bar']" class="dragArea"
                         @remove="updateJobs" :id="'bar'+key"
                         :options="{group:'brothers'}">
              <span v-for="bar in jobs[key]['bar']" v-if="bar.name === name" :id="bar.id"
                    class="tag is-info">{{bar.name}}</span>
                <span v-else-if="bar.name !== name" class="tag" :id="bar.id">{{bar.name}}</span>
              </draggable>
            </div>
          </td>
          <td class="dragArea">
            <div class="tags dragArea">
              <draggable v-model="jobs[key]['basementBackDoor']" class="dragArea"
                         @remove="updateJobs" :id="'basementBackDoor'+key"
                         :options="{group:'brothers'}">
              <span v-for="basementBackDoor in jobs[key]['basementBackDoor']" v-if="basementBackDoor.name === name"
                    :id="basementBackDoor.id"
                    class="tag is-info">{{basementBackDoor.name}}</span>
                <span v-else-if="basementBackDoor.name !== name" class="tag"
                      :id="basementBackDoor.id">{{basementBackDoor.name}}</span>
              </draggable>
            </div>
          </td>
          <td class="dragArea">
            <div class="tags dragArea">
              <draggable v-model="jobs[key]['backDoor']" class="dragArea"
                         @remove="updateJobs" :id="'backDoor'+key"
                         :options="{group:'brothers'}">
              <span v-for="backDoor in jobs[key]['backDoor']" v-if="backDoor.name === name" :id="backDoor.id"
                    class="tag is-info">{{backDoor.name}}</span>
                <span v-else-if="backDoor.name !== name" class="tag" :id="backDoor.id">{{backDoor.name}}</span>
              </draggable>
            </div>
          </td>
          <td class="dragArea">
            <div class="tags dragArea">
              <draggable v-model="jobs[key]['dj']" class="dragArea"
                         @remove="updateJobs" :id="'dj'+key"
                         :options="{group:'brothers'}">
              <span v-for="dj in jobs[key]['dj']" v-if="dj.name === name" :id="dj.id"
                    class="tag is-info">{{dj.name}}</span>
                <span v-else-if="dj.name !== name" class="tag" :id="dj.id">{{dj.name}}</span>
              </draggable>
            </div>
          </td>
        </tr>
        </tbody>
        <tfoot>
        <tr>
          <th>Needed brothers</th>
          <th class="dragArea">
            2
          </th>
          <th class="dragArea">
            1
          </th>
          <th class="dragArea">
            2 or 3
          </th>
          <th class="dragArea">
            2
          </th>
          <th class="dragArea">
            1
          </th>
          <th class="dragArea">
            1
          </th>
          <th class="dragArea">
            1
          </th>
        </tr>
        </tfoot>
      </table>
      <div class="tile is-ancestor">
        <div class="tile is-parent">
          <article class="tile is-child notification is-danger">
            <p class="subtitle">Wall of SHAME</p>
            <div class="tags dragArea">
              <draggable v-model="shamedBrothers" class="dragArea" @remove="updateJobs" id="shame"
                         :options="{group:'brothers'}">
              <span v-for="(brother) in shamedBrothers" v-if="brother.name === name" :id="brother.id"
                    class="tag is-medium is-info">{{brother.name}}</span>
                <span v-else-if="brother.name !== name" class="tag is-medium" :id="brother.id">{{brother.name}}</span>
              </draggable>
            </div>
          </article>
        </div>
      </div>
    </div>
    <!--<div v-else>-->
      <!--<div class="tile is-ancestor">-->
        <!--<div class="tile is-parent" @click="addMe('soberVolunteer')">-->
          <!--<article class="tile is-child box">-->
            <!--<p class="subtitle">Sober Volunteers</p>-->
            <!--<div class="tags">-->
              <!--<span v-for="(brother) in soberVolunteers" v-if="brother.name === name" :id="brother.id"-->
                    <!--class="tag is-medium is-info">{{brother.name}}</span>-->
              <!--<span v-else-if="brother.name !== name" class="tag is-medium" :id="brother.id">{{brother.name}}</span>-->
            <!--</div>-->
          <!--</article>-->
        <!--</div>-->
        <!--<div class="tile is-parent" @click="addMe('soberOfficer')">-->
          <!--<article class="tile is-child box">-->
            <!--<p class="subtitle">Sober Officers</p>-->
            <!--<div class="tags">-->
              <!--<span v-for="(brother) in soberOfficers" v-if="brother.name === name" :id="brother.id"-->
                    <!--class="tag is-medium is-info">{{brother.name}}</span>-->
              <!--<span v-else-if="brother.name !== name" class="tag is-medium" :id="brother.id">{{brother.name}}</span>-->
            <!--</div>-->
          <!--</article>-->
        <!--</div>-->
        <!--<div class="tile is-parent">-->
          <!--<article class="tile is-child box">-->
            <!--<p class="subtitle">Risk Managers</p>-->
            <!--<div class="tags">-->
              <!--<span v-for="(brother) in riskManagers" v-if="brother.name === name" :id="brother.id"-->
                    <!--class="tag is-medium is-info">{{brother.name}}</span>-->
              <!--<span v-else-if="brother.name !== name" class="tag is-medium" :id="brother.id">{{brother.name}}</span>-->
            <!--</div>-->
          <!--</article>-->
        <!--</div>-->
      <!--</div>-->
      <!--<table class="table is-bordered is-fullwidth">-->
        <!--<thead>-->
        <!--<tr>-->
          <!--<th>Time</th>-->
          <!--<th>Outside Front Door</th>-->
          <!--<th>Inside Front Door</th>-->
          <!--<th>Coat Room</th>-->
          <!--<th>Bar</th>-->
          <!--<th>Basement Back Door</th>-->
          <!--<th>Back Door</th>-->
          <!--<th>DJ</th>-->
        <!--</tr>-->
        <!--</thead>-->
        <!--<tbody>-->
        <!--<tr v-for="(job, key) in jobs" :key="key">-->
          <!--<th v-if="key == 0">10 PM</th>-->
          <!--<th v-if="key == 1">11 PM</th>-->
          <!--<th v-if="key == 2">12 AM</th>-->
          <!--<th v-if="key == 3">1 AM</th>-->
          <!--<td>-->
            <!--<div class="tags">-->
              <!--<span v-for="outsideFrontDoor in jobs[key]['outsideFrontDoor']" v-if="outsideFrontDoor.name === name"-->
                    <!--:id="outsideFrontDoor.id"-->
                    <!--class="tag is-info">{{outsideFrontDoor.name}}</span>-->
              <!--<span v-else-if="outsideFrontDoor.name !== name" class="tag"-->
                    <!--:id="outsideFrontDoor.id">{{outsideFrontDoor.name}}</span>-->
            <!--</div>-->
          <!--</td>-->
          <!--<td>-->
            <!--<div class="tags">-->
              <!--<span v-for="insideFrontDoor in jobs[key]['insideFrontDoor']" v-if="insideFrontDoor.name === name"-->
                    <!--:id="insideFrontDoor.id"-->
                    <!--class="tag is-info">{{insideFrontDoor.name}}</span>-->
              <!--<span v-else-if="insideFrontDoor.name !== name" class="tag"-->
                    <!--:id="insideFrontDoor.id">{{insideFrontDoor.name}}</span>-->
            <!--</div>-->
          <!--</td>-->
          <!--<td>-->
            <!--<div class="tags">-->
              <!--<span v-for="coatRoom in jobs[key]['coatRoom']" v-if="coatRoom.name === name" :id="coatRoom.id"-->
                    <!--class="tag is-info">{{coatRoom.name}}</span>-->
              <!--<span v-else-if="coatRoom.name !== name" class="tag" :id="coatRoom.id">{{coatRoom.name}}</span>-->
            <!--</div>-->
          <!--</td>-->
          <!--<td>-->
            <!--<div class="tags">-->
              <!--<span v-for="bar in jobs[key]['bar']" v-if="bar.name === name" :id="bar.id"-->
                    <!--class="tag is-info">{{bar.name}}</span>-->
              <!--<span v-else-if="bar.name !== name" class="tag" :id="bar.id">{{bar.name}}</span>-->
            <!--</div>-->
          <!--</td>-->
          <!--<td>-->
            <!--<div class="tags">-->
              <!--<span v-for="basementBackDoor in jobs[key]['basementBackDoor']" v-if="basementBackDoor.name === name"-->
                    <!--:id="basementBackDoor.id"-->
                    <!--class="tag is-info">{{basementBackDoor.name}}</span>-->
              <!--<span v-else-if="basementBackDoor.name !== name" class="tag"-->
                    <!--:id="basementBackDoor.id">{{basementBackDoor.name}}</span>-->
            <!--</div>-->
          <!--</td>-->
          <!--<td>-->
            <!--<div class="tags">-->
              <!--<span v-for="backDoor in jobs[key]['backDoor']" v-if="backDoor.name === name" :id="backDoor.id"-->
                    <!--class="tag is-info">{{backDoor.name}}</span>-->
              <!--<span v-else-if="backDoor.name !== name" class="tag" :id="backDoor.id">{{backDoor.name}}</span>-->
            <!--</div>-->
          <!--</td>-->
          <!--<td>-->
            <!--<div class="tags">-->
              <!--<span v-for="dj in jobs[key]['dj']" v-if="dj.name === name" :id="dj.id"-->
                    <!--class="tag is-info">{{dj.name}}</span>-->
              <!--<span v-else-if="dj.name !== name" class="tag" :id="dj.id">{{dj.name}}</span>-->
            <!--</div>-->
          <!--</td>-->
        <!--</tr>-->
        <!--</tbody>-->
        <!--<tfoot>-->
        <!--<tr>-->
          <!--<th>Needed brothers</th>-->
          <!--<th>-->
            <!--2-->
          <!--</th>-->
          <!--<th>-->
            <!--1-->
          <!--</th>-->
          <!--<th>-->
            <!--2 or 3-->
          <!--</th>-->
          <!--<th>-->
            <!--2-->
          <!--</th>-->
          <!--<th>-->
            <!--1-->
          <!--</th>-->
          <!--<th>-->
            <!--1-->
          <!--</th>-->
          <!--<th>-->
            <!--1-->
          <!--</th>-->
        <!--</tr>-->
        <!--</tfoot>-->
      <!--</table>-->
      <!--<div class="tile is-ancestor">-->
        <!--<div class="tile is-parent">-->
          <!--<article class="tile is-child notification is-danger">-->
            <!--<p class="subtitle">Wall of SHAME</p>-->
            <!--<div class="tags">-->
              <!--<span v-for="(brother) in shamedBrothers" v-if="brother.name === name" :id="brother.id"-->
                    <!--class="tag is-medium is-info">{{brother.name}}</span>-->
              <!--<span v-else-if="brother.name !== name" class="tag is-medium" :id="brother.id">{{brother.name}}</span>-->
            <!--</div>-->
          <!--</article>-->
        <!--</div>-->
      <!--</div>-->
    <!--</div>-->
  </section>
</template>

<script>
  import firebase from 'firebase'
  import moment from 'moment'
  import draggable from 'vuedraggable'

  export default {
    data () {
      return {
        userId: '',
        name: '',
        email: '',
        social: false,
        paid_bill: true,
        isShamed: false,
        userKey: -1,
        party_name: '',
        party_id: this.$route.params.id.toString(),
        party_date: '',
        party_type: '',
        party_closed: false,
        jobs: [],
        shamedBrothers: [],
        soberVolunteers: [],
        riskManagers: [],
        soberOfficers: [],
      }
    },
    components: {
      draggable
    },
    created () {
      let db = firebase.database()
      let user = firebase.auth().currentUser
      let vm = this

      if (user !== null) {
        vm.userId = user.uid
        vm.name = user.displayName
        vm.email = user.email
      }

      const eventRef = db.ref('events/' + this.$route.params.id)
      eventRef.on('value', (snapshot) => {
        let event = snapshot.val()
        vm.party_type = this.capitalize(event.type)
        vm.party_date = moment(event.party_date).format('ddd, MMM Do YYYY')
        vm.party_name = event.name
        vm.party_closed = event.closed;
        (event.maleGuests !== -1 ) ? vm.maleLimit = event.maleGuests : vm.maleLimit = '∞';
        (event.femaleGuests !== -1 ) ? vm.femaleLimit = event.femaleGuests : vm.femaleLimit = '∞';
        (event.generalGuests !== -1 ) ? vm.generalLimit = event.generalGuests : vm.generalLimit = '∞'
      })

      db.ref('bros/' + vm.userId).once('value').then(function (snapshot) {
        if (snapshot.val() && (snapshot.val().role === 'admin' || snapshot.val().role === 'social')) {
          vm.social = true
        }

        vm.paid_bill = snapshot.val() && snapshot.val().paid_bill === true
      })

      const shamedRef = db.ref('events/' + this.$route.params.id + '/jobs/shame')
      shamedRef.on('value', (snapshot) => {
        let i = 0
        snapshot.forEach(function (child) {
          vm.$set(vm.shamedBrothers, i, {
            id: child.key,
            ref: child.ref,
            name: child.val()
          })
          if (child.val() === vm.name) {
            vm.isShamed = true
            vm.userKey = i
          }
          i++
        })
      })

      const jobsRef = db.ref('events/' + this.$route.params.id + '/jobs/jobs')
      jobsRef.on('value', (snapshot) => {
        snapshot.forEach(function (hour) {
          let d = {
            'outsideFrontDoor': [],
            'insideFrontDoor': [],
            'coatRoom': [],
            'bar': [],
            'basementBackDoor': [],
            'backDoor': [],
            'dj': []
          }
          hour.forEach(function (job) {
            let i = 0
            job.forEach(function (bro) {
              d[job.key][i] = {
                id: bro.key,
                ref: bro.ref,
                name: bro.val()
              }
              if (bro.val() === vm.name) {
                vm.userKey = i
              }
              i++
            })
          })

          vm.$set(vm.jobs, hour.key, d)
        })
      })

      const riskRef = db.ref('events/' + this.$route.params.id + '/jobs/risk')
      riskRef.on('value', (snapshot) => {
        snapshot.forEach(function (child) {
          vm.$set(vm.riskManagers, child.key, {
            ref: child.ref,
            name: child.val()
          })
        })
      })

      const officerRef = db.ref('events/' + this.$route.params.id + '/jobs/officer')
      officerRef.on('value', (snapshot) => {
        let i = 0
        snapshot.forEach(function (child) {
          vm.$set(vm.soberOfficers, i, {
            id: child.key,
            ref: child.ref,
            name: child.val()
          })
          if (child.val() === vm.name) {
            vm.userKey = i
          }
          i++
        })
      })

      const volunteerRef = db.ref('events/' + this.$route.params.id + '/jobs/volunteer')
      volunteerRef.on('value', (snapshot) => {
        let i = 0
        snapshot.forEach(function (child) {
          vm.$set(vm.soberVolunteers, i, {
            id: child.key,
            ref: child.ref,
            name: child.val()
          })
          if (child.val() === vm.name) {
            vm.userKey = i
          }
          i++
        })
      })
    },
    computed: {}
    ,
    methods: {
      capitalize: function (str) {
        return str.charAt(0).toUpperCase() + str.slice(1)
      },
      updateJobs: function (evt) {
        console.log(evt)
        let vm = this
        let db = firebase.database()

        if (evt.to.id === 'soberVolunteers') {
          console.log(vm.soberVolunteers[evt.oldIndex])
          let ref = vm.soberVolunteers[evt.newIndex].ref
          let id = vm.soberVolunteers[evt.newIndex].id
          let name = vm.soberVolunteers[evt.newIndex].name
          ref && ref.remove()
          db.ref('events/' + this.$route.params.id + '/jobs/volunteer/' + id).set(name)
          if (name === vm.name) {
            vm.isShamed = false
          }
        } else if (evt.to.id === 'soberOfficers') {
          let ref = vm.soberOfficers[evt.newIndex].ref
          let id = vm.soberOfficers[evt.newIndex].id
          let name = vm.soberOfficers[evt.newIndex].name
          ref && ref.remove()
          db.ref('events/' + this.$route.params.id + '/jobs/officer/' + id).set(name)
          if (name === vm.name) {
            vm.isShamed = false
          }
        } else if (evt.to.id === 'shame') {
          let ref = vm.shamedBrothers[evt.newIndex].ref
          let id = vm.shamedBrothers[evt.newIndex].id
          let name = vm.shamedBrothers[evt.newIndex].name
          ref && ref.remove()
          db.ref('events/' + this.$route.params.id + '/jobs/shame/' + id).set(name)
          if (name === vm.name) {
            vm.isShamed = true
          }
        } else if (/\d/.test(evt.to.id.slice(-1))) {
          let time = parseInt(evt.to.id.slice(-1))
          let job = evt.to.id.substring(0, evt.to.id.length - 1)
          let item = vm.jobs[time][job][evt.newIndex]
          console.log(item)
          let ref = item.ref
          let id = item.id
          let name = item.name
          ref && ref.remove()
          db.ref('events/' + this.$route.params.id + '/jobs/jobs/' + time + '/' + job + '/' + id).set(name)
          if (name === vm.name) {
            vm.isShamed = false
          }
        }
      },
      addMe: function (str) {
        console.log(str)
        let vm = this
        let db = firebase.database()

        if (!vm.isShamed) {
          if (str === 'soberVolunteer') {
            if (vm.soberVolunteers[vm.userKey].name !== vm.name) {
              alert('Error: Trying to add someone besides yourself, please reload')
            } else {
              let ref = vm.soberVolunteers[vm.userKey].ref
              let id = vm.soberVolunteers[vm.userKey].id
              let name = vm.soberVolunteers[vm.userKey].name
              ref && ref.remove()
              db.ref('events/' + this.$route.params.id + '/jobs/shame/' + id).set(name)
              if (name === vm.name) {
                vm.isShamed = true
              }
              location.reload();
            }
          }
        } else if (str === 'soberVolunteer') {
          console.log(vm.shamedBrothers[vm.userKey])
          if (vm.shamedBrothers[vm.userKey].name !== vm.name) {
            alert('Error: Trying to add someone besides yourself, please reload')
          } else {
            let ref = vm.shamedBrothers[vm.userKey].ref
            let id = vm.shamedBrothers[vm.userKey].id
            let name = vm.shamedBrothers[vm.userKey].name
            ref && ref.remove()
            db.ref('events/' + this.$route.params.id + '/jobs/volunteer/' + id).set(name)
            if (name === vm.name) {
              vm.isShamed = false
            }
          }
        }
      }
    },
  }
</script>

<style scoped>

  #center {
    text-align: center;
    margin: 0 auto;
    width: 50%;
  }

  .dragArea {
    width: 100%;
    height: 100%;
    min-height: 25px;
  }

</style>
