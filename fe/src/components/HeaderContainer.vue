<script setup>
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router';
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth'
import BaseButton from '../elements/BaseButton.vue'

const router = useRouter()

const isLoggedIn = ref(false)

let auth
onMounted(() => {
  auth = getAuth()
  onAuthStateChanged(auth, user => {
    if (user) {
      isLoggedIn.value = true
    } else {
      isLoggedIn.value = false
    }
  })
})

const logout = () => {
  signOut(auth)
    .then(() => {
      router.push('/login')
    }).catch(err => {
      console.log('Error logging out', err)
    })
}
</script>

<template>
  <div class="header-container">
    <div class="title-container">
      <router-link to="/" class="title-router">
        <h1 class="title">Wish Lists</h1>
      </router-link>
    </div>
    <div class="button-container">
      <template v-if="isLoggedIn">
        <BaseButton label="Sign out" @click="logout" />
      </template>
      <template v-else>
        <router-link to="/login">
          <BaseButton label="Sign in" class="login-button" />
        </router-link>
        <router-link to="/register">
          <BaseButton label="Sign up" />
        </router-link>
      </template>
    </div>
  </div>
</template>

<style scoped>
.header-container {
  background-color: var(--lb-c-cream);
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  border-bottom: 1px solid var(--color-border);
}

.title-container {
  flex: 1;
  text-align: center;
}

.title-router {
  color: black;
  text-decoration: none;
}

.title {
  font-size: 2rem;
  font-family: var(--title-font);
}

.button-container {
  margin-right: 1.5rem;
}

.login-button {
  margin-right: 0.75rem;
}

@media only screen and (max-width: 950px) {
  .title {
    font-size: 1.5rem;
  }

  .button-container {
    display: none;
  }
}
</style>