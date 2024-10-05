<script setup>
import { storeToRefs } from 'pinia'
import { useListStore } from '../stores/list'
import BaseButton from '../elements/BaseButton.vue'

const listStore = useListStore()
const { lists, selectedListId } = storeToRefs(listStore)
const { setSelectedList } = listStore
</script>

<template>
  <aside  class="sidebar-container">
    <div class="title-container">
      <h1 class="title">Lists</h1>
    </div>
    <div>
      <ul class="list-items">
        <li
          v-for="list in lists"
          :key="list.id"
          class="list-item"
          :class="{'list-item--selected': list.id === selectedListId}"
        >
          <button
            class="list-item-button"
            @click="setSelectedList(list.id)"
          >
            {{ list.name }}
          </button>
        </li>
      </ul>
    </div>
  </aside>
</template>

<style scoped>
.sidebar-container {
  height: 100%;
  width: 250px;
  background-color: var(--lb-c-blue);
  flex: 0 0 250px;
}

@media only screen and (max-width: 950px) {
  .sidebar-container {
    display: none;
  }
}

.title-container {
  padding: 1.5rem;
  display: flex;
  align-items: center;
}

.title {
  font-family: var(--header-font);
  font-weight: 600;
  font-size: 1.25rem;
}

.list-items {
  list-style-type: none;
  padding: 0;
}

.list-item {
  background-color: rgba(255, 255, 255, 0.1);
}

.list-item--selected {
  background-color: rgba(255, 255, 255, 0.25);
}

.list-item-button {
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