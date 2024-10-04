<script setup>
import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useListStore } from '../stores/list'
import { useAuthStore } from '../stores/auth'
import AllItems from './AllItems.vue'
import AllNotes from './AllNotes.vue'

const listStore = useListStore()
const { selectedList, selectedListId } = storeToRefs(listStore)

const authStore = useAuthStore()
const { user } = storeToRefs(authStore)

const hasEditAccess = computed(() => user.value?.list_edit_accesses?.includes(selectedListId.value))
const hasViewAccess = computed(() => user.value?.list_view_accesses?.includes(selectedListId.value))

const emit = defineEmits(['close-topnav-menu'])

function closeTopnavMenu() {
  emit('close-topnav-menu')
}
</script>

<template>
  <main class="list-container" @click.stop="closeTopnavMenu">
    <h1 class="title">{{ selectedList?.name }}</h1>
    <div class="list-body">
      <AllItems
        :has-edit-access="hasEditAccess"
        :has-view-access="hasViewAccess"
        class="items"
      />
      <AllNotes
        v-if="hasViewAccess"
        class="notes"
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
