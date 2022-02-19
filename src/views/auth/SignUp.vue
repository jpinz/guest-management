<script lang="ts">
import { defineComponent, ref } from "vue";
import { handleSignup } from "@/utils/auth/useAuth";
export default defineComponent({
  name: "Auth",
  setup() {
    const email = ref("");
    const password = ref("");
    return {
      email,
      password,
      handleSignup,
    };
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
      <i-button @click="handleSignup({ email, password })"> Submit </i-button>
    </i-form-group>
  </i-form>
</template>
