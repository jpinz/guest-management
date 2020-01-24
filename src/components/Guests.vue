<template>
  <b-table :data="guests" :columns="columns">
    <Guest />

    <template slot="empty">
      <section class="section">
        <div class="content has-text-grey has-text-centered">
          <p>
            <b-icon icon="emoticon-sad" size="is-large"></b-icon>
          </p>
          <p>Nothing here.</p>
        </div>
      </section>
    </template>
  </b-table>
</template>

<script>
import firebase from "firebase";
import moment from "moment";
import getSortKey from "../utils/sortKeyGen";
import Guest from "@/components/Guest";

export default {
  name: "Guests",
  props: {
    isMale: {
      type: String,
      required: true
    },
    isFrontDoor: {
      type: Boolean,
      required: true
    },
    social: {
      type: Boolean,
      required: true
    },
    // columns: {
    //   type: Array,
    //   required: true
    //   // Delete column :visible="!isFrontDoor && social"
    // },
    guests: {
        type: Array,
        required: true
    }
  }
};
</script>