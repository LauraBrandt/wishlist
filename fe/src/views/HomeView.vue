<script setup>
import { onMounted, ref } from 'vue'
import { useListStore } from '../stores/list'
import { useUserStore } from '../stores/user'
import HeaderContainer from '../components/HeaderContainer.vue'
import SidebarContainer from '../components/SidebarContainer.vue'
import TopnavContainer from '../components/TopnavContainer.vue'
import ListContainer from '../components/ListContainer.vue'

const { fetchUser } = useUserStore()
const { fetchLists } = useListStore()

onMounted(() => {
  fetchUser()
  fetchLists()
})

const topnavContainer = ref(null)

function closeTopnavMenu() {
  if (topnavContainer.value) {
    topnavContainer.value.closeMenu()
  }
}
</script>

<template>
  <div class="main-wrapper">
    <header class="header-wrapper">
      <HeaderContainer />
    </header>
    <div class="body-wrapper">
      <SidebarContainer />
      <TopnavContainer ref="topnavContainer" />
      <ListContainer @close-topnav-menu="closeTopnavMenu" />
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
