<script lang="ts">
import { defineComponent, ref } from "vue";

import store from "@/store";

export default defineComponent({
  name: "Login",
  setup() {
    const email = ref("");
    const password = ref("");
    const signIn = (email: string, password: string) => {
      // dispatch the sign in action
      store.dispatch("signInAction", { email, password });
    };

    return { email, password, signIn };
  },
});
</script>

<template>
  <i-form>
    <i-form-group>
      <i-form-label>Email</i-form-label>
      <i-input v-model="email" placeholder="user@guest.social" />
    </i-form-group>

    <i-form-group>
      <i-form-label>Password</i-form-label>
      <i-input v-model="password" />
    </i-form-group>

    <i-form-group>
      <i-button @click="signIn(email, password)"> Submit </i-button>
      <i-button type="submit"> Forgot Password </i-button>
    </i-form-group>
  </i-form>
</template>
