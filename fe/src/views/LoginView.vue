<script setup>
import { storeToRefs } from 'pinia'
import { useAuthStore } from '../stores/auth'
import CredentialsBody from '../components/CredentialsBody.vue'

const authStore = useAuthStore()
const { authErrorMessage } = storeToRefs(authStore)
const { login, signInWithGoogle } = authStore
</script>

<template>
  <CredentialsBody
    title="Login"
    submit-button-text="Sign In"
    :error-message="authErrorMessage"
    @submit="login"
    @signInWithGoogle="signInWithGoogle"
  >
    <template #redirect>
      Don't have an account?
      <router-link to="/register">Register here</router-link>
    </template>
  </CredentialsBody>
</template>
