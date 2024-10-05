<script setup>
import { onMounted } from 'vue'
import { useAuthStore } from './stores/auth'
import HeaderContainer from './components/HeaderContainer.vue'

const authStore = useAuthStore()
const { setIsLoggedIn } = authStore

onMounted(() => {
  setIsLoggedIn()
})
</script>

<template>
  <div class="main-wrapper">
    <header class="header-wrapper">
      <HeaderContainer />
    </header>
    <div class="body-wrapper">
      <router-view/>
    </div>
  </div>
</template>

<style scoped>
.main-wrapper {
  height: 100vh;
}

.header-wrapper {
  height: 60px;
}

.body-wrapper {
  height: calc(100vh - 60px);
  display: flex;
}

@media only screen and (max-width: 950px) {
  .header-wrapper {
    height: 50px;
    z-index: 2;
  }

  .body-wrapper {
    height: calc(100vh - 50px);
    flex-direction: column;
  }
}
</style>
