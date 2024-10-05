import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import {
  getAuth,
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
} from 'firebase/auth'
import { useRouter } from 'vue-router'

export const useAuthStore = defineStore('auth', () => {
  const user = ref(null)
  const firebaseUser = ref(null)
  const authErrorMessage = ref('')
  
  const auth = getAuth()
  const router = useRouter()

  const isLoggedIn = computed(() => !!firebaseUser.value)

  function setFirebaseUserFromCurrentUser() {
    if (auth.currentUser) {
      const { displayName, email, uid, accessToken } = auth.currentUser
      firebaseUser.value = { displayName, email, uid, accessToken }
    } else {
      firebaseUser.value = null
    }
  }
  
  function register({ email, password, name }) {
    authErrorMessage.value = ''
    createUserWithEmailAndPassword(auth, email, password).then((res1) => {
      changeDisplayName(name)
      router.push('/')
    }).catch(err => {
      if (err.code == 'auth/email-already-in-use') {
        authErrorMessage.value = 'Email already exists. Try logging in'
      } else {
        console.log('Problem with registration', err)
      }
    })
  }

  function login({ email, password }) {
    authErrorMessage.value = ''
    signInWithEmailAndPassword(auth, email, password)
      .then(() => {
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

  function signInWithGoogle() {
    authErrorMessage.value = ''
    const provider = new GoogleAuthProvider()
    signInWithPopup(auth, provider)
      .then(() => {
        router.push('/')
      }).catch(err => {
        console.log('Google sign in error', err)
      })
  }

  function logout() {
    authErrorMessage.value = ''
    signOut(auth)
      .then(() => {
        router.push('/login')
      }).catch(err => {
        console.log('Error logging out', err)
      })
  }

  function changeDisplayName(name) {
    updateProfile(auth.currentUser, {
      displayName: name,
    }).then(() => {
      setFirebaseUserFromCurrentUser()
    }).catch(err => {
      console.log('Error setting display name to', name, '-', err)
    });
  }

  function setIsLoggedIn() {
    onAuthStateChanged(auth, () => {
      setFirebaseUserFromCurrentUser()
    })
  }

  return {
    user,
    firebaseUser,
    authErrorMessage,
    isLoggedIn,
    setIsLoggedIn,
    register,
    login,
    signInWithGoogle,
    logout,
    changeDisplayName,
  }
})