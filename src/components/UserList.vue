<template>
  <section class="section">
    <h1 class="title has-text-centered">Your personal guest list</h1>
    <br/>
    <div class="field">
      <div class="control">
        <div v-if="!paid_bill">
          <div class="notification is-danger">
            You have not paid your social bill! Please talk to social about this.
          </div>
          <br/>
        </div>
        <input v-model="input" class="input" type="text" placeholder="Enter guest name(s)" id="searchbar">
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
      <p>There are <strong>{{females.length}}</strong> females and <strong>{{males.length}}</strong>
        males on your guest list. For you math majors that is <strong>{{females.length + males.length}}</strong> guests.</p>
    </div>

    <div class="columns">
      <div class="column is-half">
        <h4 class="title has-text-centered is-4">Males</h4>
        <table class="table is-fullwidth">
          <thead>
          <tr>
            <th>Name</th>
            <th>Delete</th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="(male, index) in filteredMales" :key="male.id">
            <th>{{male.name}}</th>
            <th>
              <button v-on:click="remove(male, true, index, false)" class="button is-link">Delete</button>
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
            <th>Delete</th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="(female, index) in filteredFemales" :key="female.id">
            <th>{{female.name}}</th>
            <th>
              <button v-on:click="remove(female, false, index, false)" class="button is-link">Delete</button>
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
        social: true,
        paid_bill: true,
        input: '',
        blacklist: [],
        males: [],
        females: [],
        checkedIn: 0,
        maleLimit: '',
        femaleLimit: '',
        generalLimit: '',
        malesAdded: 0,
        femalesAdded: 0,
        generalAdded: 0
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

      const blacklistRef = db.ref('blacklist/');
      blacklistRef.on('value', (snapshot) => {
        let i = 0;
        snapshot.forEach(function (child) {
          vm.$set(vm.blacklist, i, child.val().name.toLowerCase());
          i++;
        });
      });

      const malesRef = db.ref('bros/' + vm.userId+ '/list/males');
      malesRef.orderByChild('sortKey').on('value', (snapshot) => {
        let i = 0;
        let count = 0;
        snapshot.forEach(function (child) {
          if (child.val().addedByUID === vm.userId) count++;
          vm.$set(vm.males, i, {
            id: child.key,
            name: child.val().name,
          });
          i++;
        });
        vm.malesAdded = count;
        vm.generalAdded = vm.malesAdded + vm.femalesAdded;
      });

      const femalesRef = db.ref('bros/' + vm.userId+ '/list/females');
      femalesRef.orderByChild('sortKey').on('value', (snapshot) => {
        let i = 0;
        let count = 0;
        snapshot.forEach(function (child) {
          if (child.val().addedByUID === vm.userId) count++;
          vm.$set(vm.females, i, {
            id: child.key,
            name: child.val().name
          });
          i++;
        });
        vm.femalesAdded = count;
        vm.generalAdded = vm.malesAdded + vm.femalesAdded;
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
          return (male.name.toLowerCase().indexOf(this.input.toLowerCase()) > -1)
        })
      },
      filteredFemales() {
        return this.females.filter(female => {
          return (female.name.toLowerCase().indexOf(this.input.toLowerCase()) > -1)
        })
      }
    },
    methods: {
      capitalize: function (str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
      },
      remove: function (guest, isMale, index, approvalList) {
        let db = firebase.database();
        console.log("Removing guest: " + guest.name);
        if (isMale) {
          let addr = 'bros/' + vm.userId+ '/list/males/';
          this.males.splice(index, 1);

          db.ref(addr + guest.id).remove();
        } else {
          let addr = 'bros/' + vm.userId+ '/list/females/';
          this.females.splice(index, 1);

          db.ref(addr + guest.id).remove();
        }
      },
      addMale: function (nameInput) {
        this.input = '';
        let vm = this;
        let names = nameInput.split(',');

        let addr = 'bros/' + vm.userId+ '/list/males';
        let db = firebase.database();
        names.every(function (name) {
          name = name.replace(/[~!@#$%^&*()_|+\-=?;:",.<>\{\}\[\]\\\/]/gi, '').replace(/[0-9]/g, '').trim();

          if (vm.blacklist.includes(name.toLowerCase())) {
            alert(name + " is on the blacklist! They will not be added to the guest list.");
          } else if (vm.males.some(e => e.name.toLowerCase() === name.toLowerCase())) {
            console.log(name + " has already been added.");
          } else if (!name || name === undefined || name === "" || name.length === 0) {
            console.log("Name was empty, didn't add");
          } else {
            console.log(vm.generalAdded + " " + vm.generalLimit);
            let newMaleId = db.ref().push().key;
            let sortKeyArr = name.split(' ');
            let sortKey = sortKeyArr.splice(1).join('') + sortKeyArr[0];
            db.ref(addr + '/' + newMaleId).set({
              name: name,
              sortKey: sortKey
            });
          }
          return true;
        });
      },
      addFemale: function (nameInput) {
        this.input = '';
        let vm = this;
        let names = nameInput.split(',');

        let db = firebase.database();
        let addr = 'bros/' + vm.userId+ '/list/females';
        names.every(function (name) {
          name = name.replace(/[~!@#$%^&*()_|+\-=?;:",.<>\{\}\[\]\\\/]/gi, '').replace(/[0-9]/g, '');

          if (vm.blacklist.includes(name.toLowerCase())) {
            alert(name + " is on the blacklist! They will not be added to the guest list.");
          } else if (vm.females.some(e => e.name.toLowerCase() === name.toLowerCase())) {
            console.log(name + " has already been added.");
          } else if (!name || name === undefined || name === "" || name.length === 0) {
            console.log("Name was empty, didn't add");
          } else {
            let newFemaleId = db.ref().push().key;
            let sortKeyArr = name.split(' ');
            let sortKey = sortKeyArr.splice(1).join('') + sortKeyArr[0];
            db.ref(addr + '/' + newFemaleId).set({
              name: name,
              sortKey: sortKey
            });
          }
          return true;
        });
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
