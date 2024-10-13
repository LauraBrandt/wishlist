<script setup>
import { storeToRefs } from 'pinia'
import { useAuthStore } from '../stores/auth'
import CredentialsBody from '../components/CredentialsBody.vue'

const authStore = useAuthStore()
const { authErrorMessage } = storeToRefs(authStore)
const { sendPasswordReset } = authStore
</script>

<template>
  <CredentialsBody
    title="Reset Password"
    email-only
    submit-button-text="Send Password Reset Link"
    :error-message="authErrorMessage"
    @submit="sendPasswordReset"
  >
    <template #redirect>
      <div>
        Don't have an account?
        <router-link to="/register">Register here</router-link>
      </div>
      <div>
        <router-link to="/login">Login</router-link>
      </div>
    </template>
  </CredentialsBody>
</template>
