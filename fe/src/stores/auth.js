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
  sendPasswordResetEmail,
} from 'firebase/auth'
import { useRouter } from 'vue-router'

export const useAuthStore = defineStore('auth', () => {
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
        switch (err.code) {
          case 'auth/email-already-in-use':
            authErrorMessage.value = 'There is already an account with this email address'
            break
          case 'auth/invalid-email':
            authErrorMessage.value = 'Password not strong enough'
            break
          case 'auth/weak-password':
            authErrorMessage.value = 'Email or password was incorrect'
            break
          default:
            authErrorMessage.value = err.code
            break
        }
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
            break
          case 'auth/user-not-found':
            authErrorMessage.value = 'No account with that email was found'
            break
          case 'auth/invalid-password':
            authErrorMessage.value = 'Email or password was incorrect'
            break
          case 'auth/invalid-credential':
            authErrorMessage.value = 'Email or password was incorrect'
            break
          case 'auth/wrong-password':
            authErrorMessage.value = 'Email or password was incorrect'
            break
          case 'auth/user-disabled':
            authErrorMessage.value = 'This account has been disabled'
            break
          default:
            authErrorMessage.value = err.code
            break
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
        switch (err.code) {
          case 'auth/account-exists-with-different-credential':
            authErrorMessage.value = 'There is already an account with this email address'
            break
          case 'auth/user-not-found':
            authErrorMessage.value = 'No account with that email was found'
            break
          case 'auth/popup-blocke':
            authErrorMessage.value = 'Your browser has blocked the login popup'
            break
          default:
            authErrorMessage.value = err.code
            break
        }
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

  function sendPasswordReset({ email }) {
    authErrorMessage.value = ''
    sendPasswordResetEmail(auth, email)
      .then(() => {
        router.push('/login')
      }).catch(err => {
        switch (err.code) {
          case 'auth/invalid-email':
            authErrorMessage.value = 'Invalid email'
            break
          case 'auth/user-not-found':
            authErrorMessage.value = 'There is no user corresponding to this email address'
            break
          case 'auth/missing-continue-uri':
            authErrorMessage.value = 'No continue uri provided'
            break
          case 'auth/invalid-continue-uri':
            authErrorMessage.value = 'Continue uri is invalid'
            break
          case 'auth/unauthorized-continue-uri':
            authErrorMessage.value = 'Continue uri is unauthorized'
            break
          default:
            authErrorMessage.value = err.code
            break
        }
      })
  }

  function setIsLoggedIn() {
    onAuthStateChanged(auth, () => {
      setFirebaseUserFromCurrentUser()
    })
  }

  async function getAuthHeader() {
    const token = await auth.currentUser.getIdToken()
    return {
      headers: {
        Authorization: `Bearer ${token}`,
      }
    }
  }

  return {
    firebaseUser,
    authErrorMessage,
    isLoggedIn,
    setIsLoggedIn,
    register,
    login,
    signInWithGoogle,
    logout,
    changeDisplayName,
    getAuthHeader,
    sendPasswordReset,
  }
})