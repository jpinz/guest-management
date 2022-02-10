<script lang="ts">
import { defineComponent } from 'vue'
export default defineComponent({
  // type inference enabled
  props: {
    name: String,
    msg: { type: String, required: true }
  },
  data() {
    return {
        username: {},
        password: {},
    }
  },
  mounted() {
    this.username
    this.password
  }
})
</script>

<template>
<i-form>
    <i-form-group>
        <i-form-label>Input</i-form-label>
        <i-input v-model="username" placeholder="Type something.." />
    </i-form-group>

    <i-form-group>
        <i-form-label>Textarea</i-form-label>
        <i-input v-model="password" placeholder="Write a comment.." />
    </i-form-group>

    <i-form-group>
        <i-button type="submit">
            Submit
        </i-button>
                <i-button type="submit">
            Submit
        </i-button>
    </i-form-group>
</i-form>

</template>
