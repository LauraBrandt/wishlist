<script setup>
import { onMounted, ref } from 'vue'
import { useListStore } from '../stores/list'
import SidebarContainer from '../components/SidebarContainer.vue'
import TopnavContainer from '../components/TopnavContainer.vue'
import ListContainer from '../components/ListContainer.vue'

const { fetchLists } = useListStore()

onMounted(() => {
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
  <div class="home-wrapper">
    <SidebarContainer />
    <TopnavContainer ref="topnavContainer" />
    <ListContainer @close-topnav-menu="closeTopnavMenu" />
  </div>
</template>

<style scoped>
.home-wrapper {
  height: 100%;
  width: 100%;
  display: flex;
}

@media only screen and (max-width: 950px) {
  .home-wrapper {
    height: 100%;
    flex-direction: column;
  }
}
</style>
