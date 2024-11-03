<script setup>
import { computed, ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useListStore } from '../stores/list'
import { useAuthStore } from '../stores/auth'
import AllItems from './AllItems.vue'
import AllNotes from './AllNotes.vue'
import BaseButton from '../elements/BaseButton.vue'
import CreateUpdateListModal from './CreateUpdateListModal.vue';

const listStore = useListStore()
const { selectedList } = storeToRefs(listStore)

const authStore = useAuthStore()
const { firebaseUser } = storeToRefs(authStore)

const isMyList = computed(() => selectedList.value?.owner_id === firebaseUser.value.uid)
const canViewListStatus = computed(() => !isMyList.value || selectedList.value?.owner_can_view)

const emit = defineEmits(['close-topnav-menu'])

function closeTopnavMenu() {
  emit('close-topnav-menu')
}

const createUpdateListModalActive = ref(false)

function showCreateUpdateListModal() {
  createUpdateListModalActive.value = true
}
</script>

<template>
  <main class="list-container" @click.stop="closeTopnavMenu">
    <template v-if="selectedList">
      <h1 class="title">{{ selectedList?.name }}</h1>
      <div class="list-body">
        <AllItems
          :is-my-list="isMyList"
          :can-view-list-status="canViewListStatus"
          class="items"
        />
        <AllNotes
          v-if="canViewListStatus"
          class="notes"
        />
      </div>
    </template>
    <div v-else class="empty-container">
      <h1 class="empty-title">No lists exist...yet</h1>
      <BaseButton
        label="Add List"
        @click="showCreateUpdateListModal()"
      />
      <CreateUpdateListModal
        v-model:modalActive="createUpdateListModalActive"
      />
    </div>
  </main>
</template>

<style scoped>
.list-container {
  height: 100%;
  width: 100%;
  padding: 2rem;
  overflow-y: auto;
  position: relative;
  z-index: 1;
}

.title {
  font-family: var(--title-font);
  font-size: 3rem;
  margin-bottom: 1.5rem;
}

.list-body {
  display: flex;
}

.items {
  flex: 1;
  padding-right: 2rem;
}

.notes {
  flex: 0 0 350px;
  padding-right: 1rem;
}

.empty-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 5rem 2rem;
}

.empty-title {
  font-family: var(--header-font);
  font-weight: 600;
  font-size: 1.5rem;
  margin-bottom: 1rem;
}

@media only screen and (max-width: 950px) {
  .list-container {
    padding: 1.5rem;
  }

  .title {
    display: none;
  }

  .list-body {
    flex-direction: column;
  }

  .items {
    flex: 1;
    padding: 0;
    padding-bottom: 2rem;
  }

  .notes {
    flex: 1;
    padding: 0;
    padding-bottom: 4rem;
  }
}
</style>
