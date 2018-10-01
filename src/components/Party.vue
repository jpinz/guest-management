<template>
  <section class="section">
    <h1 class="title has-text-centered">{{party_name}}</h1>
    <h4 class="subtitle has-text-centered is-4">{{party_date}} - {{party_type}}</h4>
    <div class="field" id="center" v-if="social">
      <div v-if="!isFrontDoor" >
        <button class="button is-info" v-on:click='downloadSpreadsheet()'>
          Download Spreadsheet
        </button>
        <br/> <br/>
      </div>
      <span>Front Door Mode enabled: </span>
      <b-switch @input="frontDoor(isFrontDoor)" v-model="isFrontDoor">
      </b-switch>
    </div>
    <br/>
    <div class="field">
      <div class="control">
        <div v-if="party_closed">
          <div class="notification is-danger">
            The party list is now closed, sorry!
          </div>
          <br/>
        </div>
        <div v-else-if="!paid_bill">
          <div class="notification is-danger">
            You have not paid your social bill! Please talk to social about this.
          </div>
          <br/>
        </div>
        <input v-model="input" class="input" type="text" placeholder="Enter guest name(s)" id="searchbar">
        <div v-if="isFrontDoor">
          <br/>
        </div>
        <b-field label="Add brother to vouch for guest" v-if="isFrontDoor && allowVouching">
          <b-autocomplete
            v-model="brotherVouch"
            :data="filteredBrothersList"
            open-on-focus
            keep-first
            placeholder="e.g. Justin Garon"
            icon="account"
            @select="option => selected = option">
            <template slot="empty">No results found</template>
          </b-autocomplete>
        </b-field>
        <br/>
        <div class="addGuest">
          <button v-on:click='addMale(input, brotherVouch, -1, name, key)' class="button is-info" :disabled="(!paid_bill || party_closed) && !social">Add Male(s)</button>
        </div>
        <div class="addGuest">
          <button v-on:click='addFemale(input, brotherVouch, -1, name, key)' class="button is-danger" :disabled="(!paid_bill || party_closed) && !social" style="margin-left: 20px;">
            Add Female(s)
          </button>
        </div>
        <br/><br/><br/>
      </div>
      <p>There are <strong>{{females.length}}</strong> females and <strong>{{males.length}}</strong>
        males on the list. For you math majors that is <strong>{{females.length + males.length}}</strong> guests.</p>
      <p v-if="generalLimit == 0 || !generalLimit">You have added <strong>{{femalesAdded}}/{{femaleLimit}}</strong> females and <strong>{{malesAdded}}/{{maleLimit}}</strong>
        males for a total of <strong>{{malesAdded + femalesAdded}}</strong> added.</p>
      <p v-else>You have added <strong>{{femalesAdded}}</strong> females and <strong>{{malesAdded}}</strong>
        males for a total of <strong>{{malesAdded + femalesAdded}}/{{generalLimit}}</strong> added.</p>
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
              <button v-on:click="checkIn(male, true, false)" class="button is-info"
                      :disabled="social == false || !isFrontDoor">Check in
              </button>
            </td>
            <td v-else-if="male.checkedIn != -1 && !isFrontDoor">
              <button v-on:click="checkIn(male, true, true)" class="button is-info"
                      :disabled="social == false ">
                {{male.checkedIn}}
              </button>
            </td>
            <td v-else><span class="tag is-info is-medium">{{male.checkedIn}}</span></td>
            <th v-if="!isFrontDoor && social">
              <button v-on:click="remove(male, true, index, false)" class="button is-link">Delete</button>
            </th>
            <th v-else-if="!isFrontDoor && male.addedByName === name">
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
              <button v-on:click="checkIn(female, false, false)" class="button is-danger"
                      :disabled="social == false || !isFrontDoor">
                Check in
              </button>
            </td>
            <td v-else-if="female.checkedIn != -1 && !isFrontDoor">
              <button v-on:click="checkIn(female, false, true)" class="button is-danger"
                      :disabled="social == false ">
                {{female.checkedIn}}
              </button>
            </td>
            <td v-else><span class="tag is-danger is-medium">{{female.checkedIn}}</span></td>
            <th v-if="!isFrontDoor && social">
              <button v-on:click="remove(female, false, index, false)" class="button is-link">Delete</button>
            </th>
            <th v-else-if="!isFrontDoor && female.addedByName === name">
              <button v-on:click="remove(female, false, index, false)" class="button is-link">Delete</button>
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
              <button v-on:click="remove(male, true, index, true)" class="button is-link">Delete</button>
            </th>
            <th v-else-if="!isFrontDoor && male.addedByName === name">
              <button v-on:click="remove(male, true, index, false)" class="button is-link">Delete</button>
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
              <button v-on:click="remove(female, false, index, true)" class="button is-link">Delete</button>
            </th>
            <th v-else-if="!isFrontDoor && female.addedByName === name">
              <button v-on:click="remove(female, false, index, false)" class="button is-link">Delete</button>
            </th>
          </tr>
          </tbody>
        </table>
      </div>
    </div>


    <!-- PERSONAL LIST -->
    <div class="columns">
      <div class="column is-half">
        <h4 class="title has-text-centered is-4">Your list of Males</h4>
        <table class="table is-fullwidth">
          <thead>
          <tr>
            <th>Name</th>
            <th>Add</th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="(male, index) in filteredMalesList" :key="male.id">
            <th>{{male.name}}</th>
            <td v-if="males.includes(male.id)">Test</td>
            <td v-else><button v-on:click="add(male, true)" class="button is-info">Add to list</button></td>
          </tr>
          </tbody>
        </table>
      </div>
      <div class="column is-half">
        <h4 class="title has-text-centered is-4">Your list of Females</h4>
        <table class="table is-fullwidth">
          <thead>
          <tr>
            <th>Name</th>
            <th>Add</th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="(female, index) in filteredFemalesList" :key="female.id">
            <th>{{female.name}}</th>
            <td v-if="females.includes(female)">Test</td>
            <td v-else><button v-on:click="add(female, false)" class="button is-danger">Add to list</button></td>
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
  import XLSX from 'xlsx'

  export default {
    data() {
      return {
        userId: '',
        name: '',
        email: '',
        key: '',
        social: false,
        paid_bill: true,
        isFrontDoor: false,
        party_name: '',
        party_id: this.$route.params.id.toString(),
        party_date: '',
        party_type: '',
        party_closed: false,
        allowVouching: false,
        input: '',
        brotherVouch: '',
        broNames: [],
        blacklist: [],
        males: [],
        females: [],
        malesApproval: [],
        femalesApproval: [],
        malesList: [],
        femalesList: [],
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
      let user = this.$store.state.user;
      let vm = this;

      if (user !== null) {
        vm.key = this.$store.state.uid;
        vm.userId = user.uid;
        vm.name = user.displayName;
        vm.email = user.email;
      }

      const eventRef = db.ref('events/' + this.$route.params.id);
      eventRef.on('value', (snapshot) => {
        let event = snapshot.val();
        vm.party_type = this.capitalize(event.type);
        vm.party_date = moment(event.party_date).format("ddd, MMM Do YYYY");
        vm.party_name = event.name;
        vm.party_closed = event.closed;
        vm.allowVouching = event.allowVouching;
        vm.checkedIn = (event.checkedIn && event.checkedIn > 0) ? event.checkedIn : 0;
        (event.maleGuests !== -1 ) ? vm.maleLimit = event.maleGuests : vm.maleLimit = '∞';
        (event.femaleGuests !== -1 ) ? vm.femaleLimit = event.femaleGuests : vm.femaleLimit = '∞';
        (event.generalGuests !== -1 ) ? vm.generalLimit = event.generalGuests : vm.generalLimit= '∞';
      });

      const blacklistRef = db.ref('blacklist/');
      blacklistRef.on('value', (snapshot) => {
        let i = 0;
        snapshot.forEach(function (child) {
          vm.$set(vm.blacklist, i, child.val().name.toLowerCase());
          i++;
        });
      });

      const malesRef = db.ref('events/' + this.$route.params.id + '/males');
      malesRef.orderByChild('sortKey').on('value', (snapshot) => {
        let i = 0;
        let count = 0;
        snapshot.forEach(function (child) {
          if (child.val().addedByUID === vm.userId) count++;
          // if (child.val().checkedIn !== -1) vm.checkedIn++;
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
        vm.generalAdded = vm.malesAdded + vm.femalesAdded;

        db.ref('bros/' + vm.key + '/events/' + vm.party_id).update({
          males: vm.malesAdded
        });
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

      const malesListRef = db.ref('bros/' + vm.key + '/list/males');
      malesListRef.orderByChild('sortKey').on('value', (snapshot) => {
        let i = 0;
        snapshot.forEach(function (child) {
          vm.$set(vm.malesList, i, {
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
          // if (child.val().checkedIn !== -1) vm.checkedIn++;
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
        vm.generalAdded = vm.malesAdded + vm.femalesAdded;

        db.ref('bros/' + vm.key + '/events/' + vm.party_id).update({
          females: vm.femalesAdded
        });
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
      const femalesListRef = db.ref('bros/' + vm.key + '/list/females');
      femalesListRef.orderByChild('sortKey').on('value', (snapshot) => {
        let i = 0;
        snapshot.forEach(function (child) {
          vm.$set(vm.femalesList, i, {
            id: child.key,
            name: child.val().name,
            checkedIn: (child.val().checkedIn === -1) ? -1 : moment(child.val().checkedIn).format("LTS"),
            addedByName: child.val().addedByName,
            addedByUID: child.val().addedByUID
          });
          i++;
        });
      });

      db.ref('bros/' + vm.key).once('value').then(function (snapshot) {
        if (snapshot.val() && (snapshot.val().role === "admin" || snapshot.val().role === "social")) {
          vm.social = true;
        }

        vm.paid_bill = snapshot.val() && snapshot.val().paid_bill === true;
      });

      db.ref('brotherNames').once('value').then(function (snapshot) {
        if(snapshot.val()) {
          vm.broNames = snapshot.val();
        }
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
      },
      filteredMalesList() {
        return this.malesList.filter(male => {
          return (male.name.toLowerCase().indexOf(this.input.toLowerCase()) > -1)
        })
      },
      filteredFemalesList() {
        return this.femalesList.filter(female => {
          return (female.name.toLowerCase().indexOf(this.input.toLowerCase()) > -1)
        })
      },
      filteredBrothersList() {
        return this.broNames.filter((option) => {
          return option
            .toString()
            .toLowerCase()
            .indexOf(this.brotherVouch.toLowerCase()) >= 0
        })
      }
    },
    methods: {
      capitalize: function (str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
      },
      frontDoor: function (frontDoor) {
        if(frontDoor) {

        }
      },
      checkIn: function (guest, isMale, checkOut) {
        this.input = '';
        let db = firebase.database();
        let d = new Date();
        let vm = this;
        if(checkOut) {
          let out = confirm("Do you want check out: " + guest.name + "?");
          if(!out) {
            return
          }
          if (isMale) {
            db.ref('events/' + this.$route.params.id + '/males/' + guest.id).update({'checkedIn': -1});
          } else {
            db.ref('events/' + this.$route.params.id + '/females/' + guest.id).update({'checkedIn': -1});
          }
          vm.checkedIn--;
          db.ref('events/' + this.$route.params.id).update({'checkedIn': vm.checkedIn});

        } else {
          if (isMale) {
            db.ref('events/' + this.$route.params.id + '/males/' + guest.id).update({'checkedIn': d.getTime()});
          } else {
            db.ref('events/' + this.$route.params.id + '/females/' + guest.id).update({'checkedIn': d.getTime()});
          }

          vm.checkedIn++;
          db.ref('events/' + this.$route.params.id).update({'checkedIn': vm.checkedIn});
        }
        document.getElementById("searchbar").focus();
      },
      approve: function (guest, isMale, index) {
        let db = firebase.database();
        console.log("Approving: " + guest.name);
        if (isMale) {
          let addr = 'events/' + this.$route.params.id + '/males';
          this.malesApproval.splice(index, 1);

          db.ref(addr + '_approval/' + guest.id).once("value", function (snapshot) {
            let male = snapshot.val();
            db.ref(addr + '/' + guest.id).set(male);
            db.ref(addr + '_approval/' + guest.id).remove();
          });
        } else {
          let addr = 'events/' + this.$route.params.id + '/females';
          this.femalesApproval.splice(index, 1);

          db.ref(addr + '_approval/' + guest.id).once("value", function (snapshot) {
            let female = snapshot.val();
            db.ref(addr + '/' + guest.id).set(female);
            db.ref(addr + '_approval/' + guest.id).remove();
          });
        }
      },
      add: function (guest, isMale) {
        let db = firebase.database();
        let vm = this;
        console.log("adding: " + guest.name);
        if (isMale) {
          let addr = 'events/' + this.$route.params.id + '/males';

          db.ref('bros/' + vm.key+ '/list/males/' + guest.id).once("value", function (snapshot) {
            let male = snapshot.val();
            db.ref(addr + '/' + guest.id).set(male);
            vm.malesAdded++;
          });
        } else {
          let addr = 'events/' + this.$route.params.id + '/females';

          db.ref('bros/' + vm.key+ '/list/females/' + guest.id).once("value", function (snapshot) {
            let female = snapshot.val();
            db.ref(addr + '/' + guest.id).set(female);
            vm.femalesAdded++;
          });
        }
      },
      remove: function (guest, isMale, index, approvalList) {
        let db = firebase.database();
        let vm = this;

        let del = confirm("Do you want to delete: " + guest.name + "?");
        if(!del) {
          return
        }

        console.log("Removing guest: " + guest.name);

        if (approvalList) {
          if (isMale) {
            let addr = 'events/' + this.$route.params.id + '/males_approval/';
            this.malesApproval.splice(index, 1);

            db.ref(addr + guest.id).remove();
          } else {
            let addr = 'events/' + this.$route.params.id + '/females_approval/';
            this.femalesApproval.splice(index, 1);

            db.ref(addr + guest.id).remove();
          }
        } else {
          if (isMale) {
            let addr = 'events/' + this.$route.params.id + '/males/';
            this.males.splice(index, 1);

            db.ref(addr + guest.id).remove();
            vm.malesAdded--;
          } else {
            let addr = 'events/' + this.$route.params.id + '/females/';
            this.females.splice(index, 1);

            db.ref(addr + guest.id).remove();
            vm.femalesAdded--;
          }
          db.ref('bros/' + vm.key + '/events/' + vm.party_id).set({
            males: vm.malesAdded,
            females: vm.femalesAdded
          });
        }
      },
      addMale: function (nameInput, brotherVouch, checkedIn, addedByName, addedByUID) {
        this.input = '';
        let vm = this;
        let names = nameInput.split(',');

        let addr = 'events/' + this.$route.params.id + '/males';
        let db = firebase.database();
        let hitLimit = false;

        if(!brotherVouch && vm.isFrontDoor) {
          alert("You need to add a brother to vouch for the guest(s)")
          this.input = nameInput
          return
        } else if(brotherVouch) {
          addedByName = brotherVouch
        }

        names.every(function (name) {
          name = name.replace(/[~!@#$%^&*()_|+\-=?;:",.<>\{\}\[\]\\\/]/gi, '').replace(/[0-9]/g, '').trim();

          if (vm.blacklist.includes(name.toLowerCase())) {
            alert(name + " is on the blacklist! They will not be added to the guest list.");
          } else if (vm.males.some(e => e.name.toLowerCase() === name.toLowerCase())) {
            console.log(name + " has already been added.");
          } else if (!name || name === undefined || name === "" || name.length === 0) {
            console.log("Name was empty, didn't add");
          } else {
            if ((vm.malesAdded >= vm.maleLimit || vm.generalAdded >= vm.generalLimit) && !vm.social) {
              hitLimit = true;
              let newMaleId = db.ref().push().key;
              db.ref(addr + '_approval/' + newMaleId).set({
                name: name,
                checkedIn: checkedIn,
                addedByName: addedByName,
                addedByUID: addedByUID
              });
            } else {
              let newMaleId = db.ref().push().key;
              db.ref(addr + '/' + newMaleId).set({
                name: name,
                checkedIn: checkedIn,
                addedByName: addedByName,
                addedByUID: addedByUID
              });
              db.ref('bros/' + vm.key + '/events/' + vm.party_id).set({
                males: vm.malesAdded,
                females: vm.femalesAdded
              });
            }
          }
          return true;
        });
        if (hitLimit) alert("You hit your maximum for male guests, they've been added to the approval list")
      },
      addFemale: function (nameInput, brotherVouch, checkedIn, addedByName, addedByUID) {
        this.input = '';
        let vm = this;
        let names = nameInput.split(',');

        let db = firebase.database();
        let addr = 'events/' + this.$route.params.id + '/females';
        let hitLimit = false;

        if(!brotherVouch && vm.isFrontDoor) {
          alert("You need to add a brother to vouch for the guest(s)")
          this.input = nameInput
          return
        } else if(brotherVouch) {
          addedByName = brotherVouch
        }

        names.every(function (name) {
          name = name.replace(/[~!@#$%^&*()_|+\-=?;:",.<>\{\}\[\]\\\/]/gi, '').replace(/[0-9]/g, '').trim();

          if (vm.blacklist.includes(name.toLowerCase())) {
            alert(name + " is on the blacklist! They will not be added to the guest list.");
          } else if (vm.females.some(e => e.name.toLowerCase() === name.toLowerCase())) {
            console.log(name + " has already been added.");
          } else if (!name || name === undefined || name === "" || name.length === 0) {
            console.log("Name was empty, didn't add");
          } else {
            if ((vm.femalesAdded >= vm.femaleLimit || vm.generalAdded >= vm.generalLimit) && !vm.social) {
              hitLimit = true;
              let newFemaleId = db.ref().push().key;
              db.ref(addr + '_approval/' + newFemaleId).set({
                name: name,
                checkedIn: checkedIn,
                addedByName: addedByName,
                addedByUID: addedByUID
              });
            } else {
              let newFemaleId = db.ref().push().key;
              db.ref(addr + '/' + newFemaleId).set({
                name: name,
                checkedIn: checkedIn,
                addedByName: addedByName,
                addedByUID: addedByUID
              });

              db.ref('bros/' + vm.key + '/events/' + vm.party_id).set({
                males: vm.malesAdded,
                females: vm.femalesAdded
              });
            }
          }
          return true;
        });
        if (hitLimit) alert("You hit your maximum for female guests, they've been added to the approval list")
      },
      downloadSpreadsheet: function() {
        let vm = this;
        let fileName = vm.party_name.replace(/\s/g,'') + '.xlsx'
        console.log(fileName)
        let malesSheet = XLSX.utils.json_to_sheet(vm.males);
        let femalesSheet = XLSX.utils.json_to_sheet(vm.females);
        let workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, malesSheet, "Males");
        XLSX.utils.book_append_sheet(workbook, femalesSheet, "Females");
        workbook.Props = {};
        workbook.Props.Title = vm.party_name;
        workbook.Custprops = {};
        workbook.Custprops["Event Date"] = vm.party_date;
        workbook.Custprops["Event Type"] = vm.party_type;

        XLSX.write(workbook, {Props:{Author:vm.name}, bookSST:true, type: 'base64'});

        XLSX.writeFile(workbook, fileName)
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
