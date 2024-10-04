<script setup>
import { useRouter } from 'vue-router'
import { ref } from 'vue'
import {
  getAuth,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
} from 'firebase/auth'
import CredentialsBody from '../components/CredentialsBody.vue'

const router = useRouter()

const errorMessage = ref('')

const login = ({ email, password }) => {
  const auth = getAuth()
  signInWithEmailAndPassword(auth, email, password).then(() => {
    router.push('/')
  }).catch(err => {
    switch (err.code) {
      case 'auth/invalid-email':
       errorMessage.value = 'Invalid email'
      case 'auth/user-not-found':
        errorMessage.value = 'No account with that email was found'
      case 'auth/invalid-password':
        errorMessage.value = 'Email or password was incorrect'
    }
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
    title="Login"
    submit-button-text="Sign In"
    :error-message="errorMessage"
    @submit="login"
    @signInWithGoogle="signInWithGoogle"
  >
    <template #redirect>
      Don't have an account?
      <router-link to="/register">Register here</router-link>
    </template>
  </CredentialsBody>
</template>
