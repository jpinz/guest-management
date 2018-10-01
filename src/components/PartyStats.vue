<template>
  <section class="section">
    <h1 class="title has-text-centered">{{party_name}}</h1>
    <h4 class="subtitle has-text-centered is-4">{{party_date}} - {{party_type}}</h4>
    <br/><br/>
    <h2 class="subtitle has-text-centered is-2">COMING SOON</h2>

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
        paid_bill: false,
        userKey: -1,
        party_name: '',
        party_id: this.$route.params.id.toString(),
        party_date: '',
        party_type: '',
        party_closed: false,
      }
    },
    created () {
      let db = firebase.database()
      let user = this.$store.state.user
      let vm = this

      if (user !== null) {
        vm.userId = this.$store.state.uid
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


    },
    computed: {}
    ,
    methods: {
      capitalize: function (str) {
        return str.charAt(0).toUpperCase() + str.slice(1)
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
