<script setup>
import { useRouter } from 'vue-router'
import { ref } from 'vue'
import {
  getAuth,
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
} from 'firebase/auth'
import CredentialsBody from '../components/CredentialsBody.vue'

const router = useRouter()

const errorMessage = ref('')

const register = ({ email, password }) => {
  const auth = getAuth()
  createUserWithEmailAndPassword(auth, email, password).then(() => {
    router.push('/')
  }).catch(err => {
    console.log('Problem with registration', err)
  })
}

const signInWithGoogle = () => {
  const provider = new GoogleAuthProvider()
  signInWithPopup(getAuth(), provider).then(result => {
    router.push('/')
  }).catch(err => {
    console.log('Google sign in error', err)
  })
}
</script>

<template>
  <CredentialsBody
    title="Create an account"
    submit-button-text="Sign Up"
    :error-message="errorMessage"
    @submit="register"
    @signInWithGoogle="signInWithGoogle"
  >
    <template #redirect>
      Already have an account?
      <router-link to="/login">Sign in here</router-link>
    </template>
  </CredentialsBody>
</template>
