<script setup>
import { ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useListStore } from '../stores/list'

const listStore = useListStore()
const { lists, selectedListId, selectedList } = storeToRefs(listStore)
const { setSelectedList } = listStore

const isExpanded = ref(false)

function toggleMenu() {
  isExpanded.value = !isExpanded.value
}

function closeMenu() {
  if (isExpanded.value) {
    isExpanded.value = false
  }
}

function selectList(list) {
  setSelectedList(list.id)
  closeMenu()
}

defineExpose({
  closeMenu,
})
</script>

<template>
  <nav class="topnav-container">
    <div class="nav-container">
      <div class="title-container">
        <h1 class="title">{{ selectedList?.name }}</h1>
      </div>
      <div class="dropdown-button-container">
        <button
          class="dropdown-button"
          aria-label="expand menu"
          @click="toggleMenu"
        >
          <FAIcon :icon="['fas', 'bars']" />
        </button>
      </div>
    </div>
    <Transition name="slide-down">
      <div v-if="isExpanded" class="menu-container">
        <ul class="menu-items">
          <li class="menu-item menu-item--empty"/>
          <li
            v-for="list in lists"
            :key="list.id"
            class="menu-item"
            :class="{'menu-item--selected': list.id === selectedListId}"
          >
            <button
              class="menu-item-button"
              @click="selectList(list)"
            >
              {{ list.name }}
            </button>
          </li>
          <li class="menu-item menu-item--empty"/>
        </ul>
      </div>
    </Transition>
  </nav>
</template>

<style scoped>
.topnav-container {
  display: none;
  height: 60px;
  position: relative;
  z-index: 10;
}

@media only screen and (max-width: 950px) {
  .topnav-container {
    display: block;
  }
}

.nav-container {
  display: flex;
  align-items: center;
  height: 60px;
  width: 100%;
  background-color: var(--lb-c-blue);
  padding: 0 1.5rem;
  box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.07);
  position: relative;
  z-index: 10; 
}

.title-container {
  flex-grow: 1;
}

.title {
  font-family: var(--title-font);
  font-size: 1.75rem;
}

.dropdown-button-container {
  flex-grow: 0;
  flex-shrink: 0;
}

.dropdown-button {
  background-color: transparent;
  color: #222222;
  border: none;
  font-size: 1.25rem;
  padding: 0.25rem 0.5rem;
  cursor: pointer;
}

.menu-container {
  padding: 0;
  position: absolute;
  background-color: var(--lb-c-blue);
  z-index: 9;
  top: 60px;
  left: 0;
  right: 0;
  border-radius: 0 0 20px 20px;
  max-height: calc(100vh - 110px);
  overflow-y: auto;
}

.slide-down-enter-active {
  transition: all 0.3s ease-out;
}

.slide-down-leave-active {
  transition: all 0.4s ease-in;
}

.slide-down-enter-from,
.slide-down-leave-to {
  transform: translateY(-30px);
  max-height: 0;
  opacity: 0;
  overflow: hidden;
}

.slide-down-enter-to,
.slide-down-leave-from {
  overflow: hidden;
  max-height: 500px;
}

.menu-items {
  list-style-type: none;
  padding: 0;
}

.menu-item {
  background-color: rgba(255, 255, 255, 0.1);
}

.menu-item--selected {
  background-color: rgba(255, 255, 255, 0.25);
}

.menu-item--empty {
  padding: 0.5rem
}

.menu-item-button {
  padding: 0.75rem 1rem 0.75rem 2rem;
  border: none;
  background-color: transparent;
  font-size: 1rem;
  font-family: var(--header-font);
  font-weight: 500;
  color: #222222;
  width: 100%;
  height: 100%;
  text-align: left;
  cursor: pointer;
}
</style>