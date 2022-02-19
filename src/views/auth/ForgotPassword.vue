<script lang="ts">
import { defineComponent, ref } from "vue";
import {
  handleLogin,
  handleOAuthLogin,
  handlePasswordReset,
} from "@/utils/auth/useAuth";
export default defineComponent({
  name: "Auth",
  setup() {
    const email = ref("");
    const password = ref("");
    return {
      email,
      password,
      handleLogin,
      handleOAuthLogin,
      handlePasswordReset,
    };
  },
});
</script>

<template>
  <i-form>
    <i-form-group>
      <i-form-label>Input</i-form-label>
      <i-input v-model="email" placeholder="Type something.." />
    </i-form-group>

    <i-form-group>
      <i-form-label>Textarea</i-form-label>
      <i-input v-model="password" placeholder="Write a comment.." />
    </i-form-group>

    <i-form-group>
      <i-button @click="handleLogin({ email, password })"> Submit </i-button>
      <i-button type="submit"> Forgot Password </i-button>
    </i-form-group>
  </i-form>
</template>
