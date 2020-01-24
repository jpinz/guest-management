<template>
  <section>
    <template slot-scope="props">
      <b-table-column field="name" label="Name">{{ props.row.name }}</b-table-column>

      <b-table-column field="addedByName" label="Added By">{{ props.row.addedByName }}</b-table-column>

      <b-table-column field="checkedIn" label="Check In" v-if="props.row.checkedIn == -1">
        <button
          v-if="props.row.isMale"
          v-on:click="checkIn(props.row, false)"
          class="button is-info"
          :disabled="social == false || !isFrontDoor"
        >Check in</button>
        <button
          v-else
          v-on:click="checkIn(props.row, false)"
          class="button is-danger"
          :disabled="social == false || !isFrontDoor"
        >Check in</button>
      </b-table-column>

      <b-table-column
        field="checkedIn"
        label="Check In"
        v-if="props.row.checkedIn != -1 && !isFrontDoor"
      >
        <button
          v-if="props.row.isMale"
          v-on:click="checkIn(props.row, true)"
          class="button is-info"
          :disabled="social == false "
        >{{props.row.checkedIn}}</button>
        <button
          v-else
          v-on:click="checkIn(props.row, true)"
          class="button is-danger"
          :disabled="social == false"
        >{{props.row.checkedIn}}</button>
      </b-table-column>

      <b-table-column field="checkedIn" label="Check In" v-else>
        <span v-if="props.row.isMale" class="tag is-info is-medium">{{props.row.checkedIn}}</span>
        <span v-else class="tag is-danger is-medium">{{props.row.checkedIn}}</span>
      </b-table-column>

      <b-table-column
        label="Remove"
        v-if="!isFrontDoor && (social || props.row.addedByUID === key)"
      >
        <button v-on:click="remove(props.row)" class="button is-link">Delete</button>
      </b-table-column>
    </template>
  </section>
</template>

<script>
export default {
  name: "Guest",
  props: {
    isFrontDoor: {
      type: Boolean,
      required: true
    },
    social: {
      type: Boolean,
      required: true
    },
    guest: {
      type: Object,
      required: true
    },
    checkIn: {
      type: Function,
      required: true
    },
    remove: {
      type: Function,
      required: true
    }
  },
  data() {
    return {
      key: this.$store.state.uid
    };
  },
  methods: {
    remove: function(guest) {
      this.$emit("remove", guest);
    },
    checkIn: function(guest, checkOut) {
      this.$emit("checkIn", guest, checkOut);
    }
  }
};
</script>