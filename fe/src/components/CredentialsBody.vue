<script setup>
import { ref } from 'vue'
import BaseButton from '../elements/BaseButton.vue'
import GoogleSignInButton from '../elements/GoogleSignInButton.vue'

defineProps({
  title: { type: String, required: true },
  submitButtonText: { type: String, required: true },
  errorMessage: { type: String, default: '' },
})

const email = ref('')
const password = ref('')

const emit = defineEmits(['submit', 'signInWithGoogle'])
</script>

<template>
  <div class="login-wrapper">
    <h1 class="title">{{ title }}</h1>
    <div class="login-box">
      <div class="input-row">
        <label for="email">Email</label>
        <input
          v-model="email"
          type="text"
          placeholder="Email"
          name="email"
        />
      </div>
      <div class="input-row">
        <label for="password">Password</label>
        <input
          v-model="password"
          type="password"
          placeholder="Password"
          name="password"
        />
      </div>
      <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
      <BaseButton
        :label="submitButtonText"
        class="login-button"
        @click="emit('submit', { email, password })"
      />
      <div class="separator-1">OR</div>
      <GoogleSignInButton @click="emit('signInWithGoogle')" />
      <div class="separator-2"/>
      <div>
        <slot name="redirect" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.login-wrapper {
  width: 100%;
  height: 100%;
  flex: 1;
  background-color: var(--lb-c-blue);
  overflow: auto;
}

.title {
  font-family: var(--title-font);
  font-size: 2.5rem;
  width: 600px;
  margin: 2rem auto 0 auto;
}

.login-box {
  border: 1px solid var(--color-border);
  border-radius: 8px;
  padding: 2rem 2.5rem;
  background-color: var(--vt-c-white);
  margin: 1rem auto 2rem auto;
  width: 600px;

  --color-input: rgb(118, 118, 118);
}

.input-row {
  margin-bottom: 1rem;
}

.input-row label {
  display: block;
  font-family: var(--header-font);
  font-weight: 600;
  margin-bottom: 0.5rem;
}

.input-row input {
  display: block;
  width: 100%;
  height: 3rem;
  font-size: 1rem;
  padding-left: 0.75rem;
  padding-right: 0.75rem;
  line-height: 1.5rem;
}

.error-message {
  color: var(--lb-c-red);
}

.login-button {
  display: block;
  width: 100%;
  height: 40px;
  margin: 1.5rem auto;
  font-size: 1rem;
  font-weight: 500;
  border-radius: 4px;
}

.separator-1 {
  font-family: var(--header-font);
  font-size: 0.75rem;
  line-height: 1rem;
  height: 1rem;
  display: flex;
  margin: 1.5rem 0;
  color: var(--color-input);
}

.separator-1::before {
  border-bottom: 1px solid var(--color-border);
  content: "";
  display: block;
  flex: 1 1 0%;
  height: 1px;
  margin-bottom: 0.5rem;
  margin-left: 0rem;
  margin-right: 0.5rem;
  margin-top: 0.5rem;
}

.separator-1::after {
  border-bottom: 1px solid var(--color-border);
  content: "";
  display: block;
  flex: 1 1 0%;
  height: 1px;
  margin-bottom: 0.5rem;
  margin-left: 0.5rem;
  margin-right: 0rem;
  margin-top: 0.5rem;
}

.separator-2 {
  margin: 1.75rem 0 1rem 0;
  border-bottom: 1px solid var(--color-border);
}

@media only screen and (max-width: 950px) {
  .title {
    font-size: 2rem;
    width: 86%;
    margin-top: 1.5rem;
  }

  .login-box {
    width: 86%;
    padding: 1rem 1.25rem;
  }
}
</style>
