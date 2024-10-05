import { ref } from 'vue'
import { defineStore } from 'pinia'
import {
  getAuth,
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
} from 'firebase/auth'
import { useRouter } from 'vue-router'

export const useAuthStore = defineStore('auth', () => {
  const user = ref(null)
  const isLoggedIn = ref(false)
  const authErrorMessage = ref('')
  
  const auth = getAuth()
  const router = useRouter()
  
  const register = ({ email, password }) => {
    authErrorMessage.value = ''
    createUserWithEmailAndPassword(auth, email, password).then((response) => {
      router.push('/')
    }).catch(err => {
      console.log('Problem with registration', err)
    })
  }

  const login = ({ email, password }) => {
    authErrorMessage.value = ''
    signInWithEmailAndPassword(auth, email, password).then(() => {
      router.push('/')
    }).catch(err => {
      switch (err.code) {
        case 'auth/invalid-email':
          authErrorMessage.value = 'Invalid email'
        case 'auth/user-not-found':
          authErrorMessage.value = 'No account with that email was found'
        case 'auth/invalid-password':
          authErrorMessage.value = 'Email or password was incorrect'
      }
    })
  }

  const signInWithGoogle = () => {
    authErrorMessage.value = ''
    const provider = new GoogleAuthProvider()
    signInWithPopup(auth, provider).then(result => {
      router.push('/')
    }).catch(err => {
      console.log('Google sign in error', err)
    })
  }

  const logout = () => {
    authErrorMessage.value = ''
    signOut(auth)
      .then(() => {
        router.push('/login')
      }).catch(err => {
        console.log('Error logging out', err)
      })
  }

  const setIsLoggedIn = () => {
    onAuthStateChanged(auth, user => {
      if (user) {
        isLoggedIn.value = true
      } else {
        isLoggedIn.value = false
      }
    })
  }

  return { user, authErrorMessage, isLoggedIn, setIsLoggedIn, register, login, signInWithGoogle, logout }
})