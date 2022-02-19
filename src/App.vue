<template>
  <i-layout>
    <i-layout-content>
      <Navbar />
      <router-view></router-view>
    </i-layout-content>
  </i-layout>
</template>

<script lang="ts">
import Login from "@/views/auth/Login.vue";
// import PasswordReset from '@/components/PasswordReset.vue'
// import Loading from "@/components/Loading.vue";
import Navbar from "@/components/navigation/Navbar.vue";
import store from "@/store";
import { supabase } from "@/lib/supabase";
import { userSession, handleLogout } from "@/utils/auth/useAuth";
import { getParameterByName } from "@/lib/helpers";
export default {
  components: {
    Login,
    // PasswordReset,
    // Loading,
    Navbar,
  },
  computed: {
    showPasswordReset: function () {
      const requestType = getParameterByName("type", location.href);
      return requestType === "recovery";
    },
  },
  setup() {
    // we initially verify if a user is logged in with Supabase
    store.state.user = supabase.auth.user();
    // we then set up a listener to update the store when the user changes either by logging in or out
    supabase.auth.onAuthStateChange((event, session) => {
      if (event == "SIGNED_OUT") {
        store.state.user = null;
      } else {
        store.state.user = userSession.value?.user;
      }
    });
    return { userSession, handleLogout };
  },
};
</script>
