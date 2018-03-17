<template>
  <section class="section">
    <h1 class="title has-text-centered">{{party_name}}</h1>
    <h4 class="subtitle has-text-centered is-4">{{party_date}} - {{party_type}}</h4>
    <div class="field" id="center">
      <span>Front Door Mode enabled: </span>
      <b-switch v-model="isFrontDoor">
      </b-switch>
    </div>
    <br/>
    <div class="field">
      <div v-if="paid_bill" class="control">
        <input v-model="input" class="input" type="text" placeholder="Enter your name" id="searchbar">
        <br/>
        <div class="addGuest">
          <button v-on:click='addMale(input , -1, name, userId)' class="button is-info">Add Male(s)</button>
        </div>
        <div class="addGuest">
          <button v-on:click='addFemale(input, -1, name, userId)' class="button is-danger" style="margin-left: 20px;">
            Add Female(s)
          </button>
        </div>
        <br/><br/><br/>
      </div>
      <div v-else>
        <div class="notification is-danger">
          You have not paid your social bill! Please talk to social about this.
        </div>
        <br/>
      </div>
      <p>There are <strong>{{females.length}}</strong> females and <strong>{{males.length}}</strong>
        males on the list. For you math majors that is <strong>{{females.length + males.length}}</strong> guests.</p>
      <p>You have added <strong>{{femalesAdded}}/{{femaleLimit}}</strong> females and <strong>{{malesAdded}}/{{maleLimit}}</strong>
        males for a total of <strong>{{malesAdded + femalesAdded}}</strong> added.</p>
      <p>There are <strong>{{checkedIn}}</strong> guests who have checked in.</p>
    </div>

    <div class="columns">
      <div class="column is-half">
        <h4 class="title has-text-centered is-4">Males</h4>
        <table class="table is-fullwidth">
          <thead>
          <tr>
            <th>Name</th>
            <th>Added By</th>
            <th>Checked In</th>
            <th v-if="!isFrontDoor && social">Delete</th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="(male, index) in filteredMales" :key="male.id">
            <th>{{male.name}}</th>
            <td>{{male.addedByName}}</td>
            <td v-if="male.checkedIn == -1">
              <button v-on:click="checkIn(male, true)" class="button is-info"
                      :disabled="social == false || !isFrontDoor">Check in
              </button>
            </td>
            <td v-else><span class="tag is-info is-medium">{{male.checkedIn}}</span></td>
            <th v-if="!isFrontDoor && social">
              <button v-on:click="remove(male, true, index)" class="button is-link">Delete</button>
            </th>
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
            <th v-if="!isFrontDoor && social">Delete</th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="(female, index) in filteredFemales" :key="female.id">
            <th>{{female.name}}</th>
            <td>{{female.addedByName}}</td>
            <td v-if="female.checkedIn == -1">
              <button v-on:click="checkIn(female, false)" class="button is-danger"
                      :disabled="social == false || !isFrontDoor">
                Check in
              </button>
            </td>
            <td v-else><span class="tag is-danger is-medium">{{female.checkedIn}}</span></td>
            <th v-if="!isFrontDoor && social">
              <button v-on:click="remove(female, false, index)" class="button is-link">Delete</button>
            </th>
          </tr>
          </tbody>
        </table>
      </div>
    </div>
    <!-- APPROVAL LIST -->
    <div class="columns">
      <div class="column is-half">
        <h4 class="title has-text-centered is-4">Males Awaiting Approval</h4>
        <table class="table is-fullwidth">
          <thead>
          <tr>
            <th>Name</th>
            <th>Added By</th>
            <th v-if="social == true">Approve</th>
            <th v-if="!isFrontDoor && social">Delete</th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="(male, index) in filteredMalesApproval" :key="male.id">
            <th>{{male.name}}</th>
            <td>{{male.addedByName}}</td>
            <td v-if="social == true">
              <button v-on:click="approve(male, true, index)" class="button is-info">Approve</button>
            </td>
            <th v-if="!isFrontDoor && social">
              <button v-on:click="remove(male, true, index)" class="button is-link">Delete</button>
            </th>
          </tr>
          </tbody>
        </table>
      </div>
      <div class="column is-half">
        <h4 class="title has-text-centered is-4">Females Awaiting Approval</h4>
        <table class="table is-fullwidth">
          <thead>
          <tr>
            <th>Name</th>
            <th>Added By</th>
            <th v-if="social == true">Approve</th>
            <th v-if="!isFrontDoor && social">Delete</th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="(female, index) in filteredFemalesApproval" :key="female.id">
            <th>{{female.name}}</th>
            <td>{{female.addedByName}}</td>
            <td v-if="social == true">
              <button v-on:click="approve(female, false, index)" class="button is-danger">Approve</button>
            </td>
            <th v-if="!isFrontDoor && social">
              <button v-on:click="remove(female, false, index)" class="button is-link">Delete</button>
            </th>
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
        social: false,
        paid_bill: true,
        isFrontDoor: false,
        party_name: '',
        party_id: this.$route.params.id.toString(),
        party_date: '',
        party_type: '',
        input: '',
        males: [],
        females: [],
        malesApproval: [],
        femalesApproval: [],
        checkedIn: 0,
        maleLimit: '',
        femaleLimit: '',
        malesAdded: 0,
        femalesAdded: 0
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
      console.log("Is front door?: " + vm.isFrontDoor);

      const eventRef = db.ref('events/' + this.$route.params.id);
      eventRef.on('value', (snapshot) => {
        let event = snapshot.val();
        vm.party_type = this.capitalize(event.type);
        vm.party_date = moment(event.date).format("ddd, MMM Do YYYY");
        vm.party_name = event.name;
        (event.maleGuests !== -1 ) ? vm.maleLimit = event.maleGuests : vm.maleLimit = '∞';
        (event.femaleGuests !== -1 ) ? vm.femaleLimit = event.femaleGuests : vm.femaleLimit = '∞';
      });

      const malesRef = db.ref('events/' + this.$route.params.id + '/males');
      malesRef.orderByChild('sortKey').on('value', (snapshot) => {
        let i = 0;
        let count = 0;
        snapshot.forEach(function (child) {
          if (child.val().addedByUID === vm.userId) count++;
          if (child.val().checkedIn !== -1) vm.checkedIn++;
          vm.$set(vm.males, i, {
            id: child.key,
            name: child.val().name,
            checkedIn: (child.val().checkedIn === -1) ? -1 : moment(child.val().checkedIn).format("LTS"),
            addedByName: child.val().addedByName,
            addedByUID: child.val().addedByUID
          });
          i++;
        });
        vm.malesAdded = count;
      });

      const malesApprovalRef = db.ref('events/' + this.$route.params.id + '/males_approval');
      malesApprovalRef.orderByChild('sortKey').on('value', (snapshot) => {
        let i = 0;
        snapshot.forEach(function (child) {
          vm.$set(vm.malesApproval, i, {
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
        let count = 0;
        snapshot.forEach(function (child) {
          if (child.val().addedByUID === vm.userId) count++;
          if (child.val().checkedIn !== -1) vm.checkedIn++;

          vm.$set(vm.females, i, {
            id: child.key,
            name: child.val().name,
            checkedIn: (child.val().checkedIn === -1) ? -1 : moment(child.val().checkedIn).format("LTS"),
            addedByName: child.val().addedByName,
            addedByUID: child.val().addedByUID
          });
          i++;
        });
        vm.femalesAdded = count;
      });

      const femalesApprovalRef = db.ref('events/' + this.$route.params.id + '/females_approval');
      femalesApprovalRef.orderByChild('sortKey').on('value', (snapshot) => {
        let i = 0;
        snapshot.forEach(function (child) {
          vm.$set(vm.femalesApproval, i, {
            id: child.key,
            name: child.val().name,
            checkedIn: (child.val().checkedIn === -1) ? -1 : moment(child.val().checkedIn).format("LTS"),
            addedByName: child.val().addedByName,
            addedByUID: child.val().addedByUID
          });
          i++;
        });
      });

      db.ref('bros/' + vm.userId).once('value').then(function (snapshot) {
        if (snapshot.val() && (snapshot.val().role === "admin" || snapshot.val().role === "social")) {
          vm.social = true;
        }

        vm.paid_bill = snapshot.val() && snapshot.val().paid_bill === true;
      });

    },
    computed: {
      filteredMales() {
        return this.males.filter(male => {
          return (male.name.toLowerCase().indexOf(this.input.toLowerCase()) > -1) || (male.addedByName.toLowerCase().indexOf(this.input.toLowerCase()) > -1)
        })
      },
      filteredFemales() {
        return this.females.filter(female => {
          return (female.name.toLowerCase().indexOf(this.input.toLowerCase()) > -1) || (female.addedByName.toLowerCase().indexOf(this.input.toLowerCase()) > -1)
        })
      },
      filteredMalesApproval() {
        return this.malesApproval.filter(male => {
          return (male.name.toLowerCase().indexOf(this.input.toLowerCase()) > -1) || (male.addedByName.toLowerCase().indexOf(this.input.toLowerCase()) > -1)
        })
      },
      filteredFemalesApproval() {
        return this.femalesApproval.filter(female => {
          return (female.name.toLowerCase().indexOf(this.input.toLowerCase()) > -1) || (female.addedByName.toLowerCase().indexOf(this.input.toLowerCase()) > -1)
        })
      }
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
      },
      approve: function (guest, isMale, index) {
        let db = firebase.database();
        if (isMale) {
          let addr = 'events/' + this.$route.params.id + '/males';
          this.malesApproval.splice(index, 1);

          db.ref(addr + '_approval/' + guest.id).once("value", function (snapshot) {
            let male = snapshot.val();
            db.ref(addr + '/' + guest.id).set(male);
            db.ref(addr + '_approval/' + guest.id).remove();
          });
        } else {
          console.log("Approving: " + guest.name);
          let addr = 'events/' + this.$route.params.id + '/females';
          this.femalesApproval.splice(index, 1);

          db.ref(addr + '_approval/' + guest.id).once("value", function (snapshot) {
            let female = snapshot.val();
            db.ref(addr + '/' + guest.id).set(female);
            db.ref(addr + '_approval/' + guest.id).remove();
          });
        }
      },
      remove: function (guest, isMale, index) {
        let db = firebase.database();
        if (isMale) {
          let addr = 'events/' + this.$route.params.id + '/males/';
          this.malesApproval.splice(index, 1);

          db.ref(addr + guest.id).remove();
        } else {
          console.log("Approving: " + guest.name);
          let addr = 'events/' + this.$route.params.id + '/females/';
          this.femalesApproval.splice(index, 1);

          db.ref(addr + guest.id).remove();
        }
      },
      addMale: function (nameInput, checkedIn, addedByName, addedByUID) {
        this.input = '';
        let vm = this;
        let names = nameInput.split(',');

        let addr = 'events/' + this.$route.params.id + '/males';
        let db = firebase.database();
        let hitLimit = false;
        names.every(function (name) {
          name = name.replace(/[~!@#$%^&*()_|+\-=?;:",.<>\{\}\[\]\\\/]/gi, '').replace(/[0-9]/g, '');

          if (vm.males.some(e => e.name === name)) {
            console.log(name + " has already been added.");
          } else if (!name || name === undefined || name === "" || name.length === 0) {
            console.log("Name was empty, didn't add");
          } else {
            if (vm.malesAdded >= vm.maleLimit && !vm.social) {
              hitLimit = true;
              let newMaleId = db.ref().push().key;
              let sortKeyArr = name.split(' ');
              let sortKey = sortKeyArr.splice(1).join('') + sortKeyArr[0];
              db.ref(addr + '_approval/' + newMaleId).set({
                name: name,
                checkedIn: checkedIn,
                addedByName: addedByName,
                addedByUID: addedByUID,
                sortKey: sortKey
              });
            } else {
              let newMaleId = db.ref().push().key;
              let sortKeyArr = name.split(' ');
              let sortKey = sortKeyArr.splice(1).join('') + sortKeyArr[0];
              db.ref(addr + '/' + newMaleId).set({
                name: name,
                checkedIn: checkedIn,
                addedByName: addedByName,
                addedByUID: addedByUID,
                sortKey: sortKey
              });
              db.ref('bros/' + addedByUID + '/events/' + vm.party_id).set({
                males: vm.malesAdded,
                females: vm.femalesAdded
              });
            }
          }
          return true;
        });
        if (hitLimit) alert("You hit your maximum for male guests, they've been added to the approval list")
      },
      addFemale: function (nameInput, checkedIn, addedByName, addedByUID) {
        this.input = '';
        let vm = this;
        let names = nameInput.split(',');

        let db = firebase.database();
        let addr = 'events/' + this.$route.params.id + '/females';
        let hitLimit = false;
        names.every(function (name) {
          name = name.replace(/[~!@#$%^&*()_|+\-=?;:",.<>\{\}\[\]\\\/]/gi, '').replace(/[0-9]/g, '');

          if (vm.females.some(e => e.name === name)) {
            console.log(name + " has already been added.");
          } else if (!name || name === undefined || name === "" || name.length === 0) {
            console.log("Name was empty, didn't add");
          } else {
            if (vm.femalesAdded >= vm.femaleLimit && !vm.social) {
              hitLimit = true;
              let newFemaleId = db.ref().push().key;
              let sortKeyArr = name.split(' ');
              let sortKey = sortKeyArr.splice(1).join('') + sortKeyArr[0];
              db.ref(addr + '_approval/' + newFemaleId).set({
                name: name,
                checkedIn: checkedIn,
                addedByName: addedByName,
                addedByUID: addedByUID,
                sortKey: sortKey
              });
            } else {
              let newFemaleId = db.ref().push().key;
              let sortKeyArr = name.split(' ');
              let sortKey = sortKeyArr.splice(1).join('') + sortKeyArr[0];
              db.ref(addr + '/' + newFemaleId).set({
                name: name,
                checkedIn: checkedIn,
                addedByName: addedByName,
                addedByUID: addedByUID,
                sortKey: sortKey
              });

              db.ref('bros/' + addedByUID + '/events/' + vm.party_id).set({
                males: vm.malesAdded,
                females: vm.femalesAdded
              });
            }
          }
          return true;
        });
        if (hitLimit) alert("You hit your maximum for female guests, they've been added to the approval list")
      }
    },
  };
</script>

<style scoped>
  .addGuest {
    padding-top: 20px;
    float: left;
  }

  #center {
    text-align: center;
    margin: 0 auto;
    width: 50%;
  }
</style>
