<script setup>
import { storeToRefs } from 'pinia'
import { useAuthStore } from '../stores/auth'
import CredentialsBody from '../components/CredentialsBody.vue'

const authStore = useAuthStore()
const { authErrorMessage } = storeToRefs(authStore)
const { register, signInWithGoogle } = authStore
</script>

<template>
  <CredentialsBody
    title="Create an account"
    submit-button-text="Sign Up"
    include-name
    :error-message="authErrorMessage"
    @submit="register"
    @signInWithGoogle="signInWithGoogle"
  >
    <template #redirect>
      Already have an account?
      <router-link to="/login">Sign in here</router-link>
    </template>
  </CredentialsBody>
</template>
