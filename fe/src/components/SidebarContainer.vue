<script setup>
import { ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useAuthStore } from '../stores/auth'
import { useListStore } from '../stores/list'
import BaseButton from '../elements/BaseButton.vue'
import CreateUpdateListModal from './CreateUpdateListModal.vue';

const authStore = useAuthStore()
const { firebaseUser } = storeToRefs(authStore)

const listStore = useListStore()
const { lists, selectedListId } = storeToRefs(listStore)
const { setSelectedList } = listStore

const createUpdateListModalActive = ref(false)
const listToEdit = ref(null)

function showCreateUpdateListModal(list) {
  createUpdateListModalActive.value = true
  listToEdit.value = list
}

function isMyList(list) {
  return list.owner_id === firebaseUser.value.uid
}
</script>

<template>
  <aside  class="sidebar-container">
    <div class="title-container">
      <h1 class="title">Lists</h1>
      <BaseButton
        label="Add List"
        @click="showCreateUpdateListModal()"
      />
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
          <BaseButton
            v-if="isMyList(list)"
            is-text-button
            label="update list"
            @click="showCreateUpdateListModal(list)"
          >
            <FAIcon :icon="['fas', 'pencil']" transform="grow-2" />
          </BaseButton>
        </li>
      </ul>
    </div>
    <CreateUpdateListModal
      v-model:modalActive="createUpdateListModalActive"
      :list="listToEdit"
    />
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
  justify-content: space-between;
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
  display: flex;
  padding-right: 0.75rem;
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