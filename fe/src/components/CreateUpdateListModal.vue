<script setup>
import { computed, ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useAuthStore } from '../stores/auth'
import { useListStore } from '../stores/list'
import BaseButton from '../elements/BaseButton.vue'
import BaseModal from '../elements/BaseModal.vue'
import api from '../api'

const authStore = useAuthStore()
const { firebaseUser } = storeToRefs(authStore)

const listStore = useListStore()
const { lists, selectedListId } = storeToRefs(listStore)
const { fetchLists, setSelectedList } = listStore

const modalActive = defineModel('modalActive')

const emit = defineEmits(['update:modalActive'])

const props = defineProps({
  list: { type: Object, default: null }
})

const isEditing = computed(() => !!props.list)

const title = computed(() => {
  if (isEditing.value) {
    return 'Edit List'
  }
  return 'Create New List'
})

const saveButtonLabel = computed(() => {
  if (isEditing.value) {
    return 'Save Changes'
  }
  return 'Create List'
})

const name = ref('')
const ownerCanView = ref(false)

watch(modalActive, () => {
  if (modalActive.value) {
    if (isEditing.value) {
      name.value = props.list.name
      ownerCanView.value = props.list.owner_can_view
    } else {
      name.value = firebaseUser.value.displayName
      ownerCanView.value = false
    }
  }
})

const invalid = computed(() => !name.value)

async function saveList() {
  const url = `/lists${props.list ? `/${props.list.id}` : ''}`
  const listToSave = { name: name.value, owner_can_view: ownerCanView.value }
  const result = await api.post(url, listToSave)
  if (!result.error) {
    fetchLists()
    modalActive.value = false
  }
}

const confirmDeleteModalActive = ref(false)
function confirmDelete() {
  confirmDeleteModalActive.value = true
}

async function deleteList() {
  const url = `/lists/${props.list.id}`
  const result = await api.delete(url)
  if (!result.error) {
    fetchLists()
    if (props.list.id === selectedListId.value) {
      setSelectedList(lists.value[0].id)
    }
    confirmDeleteModalActive.value = false
    modalActive.value = false
  }
}
</script>

<template>
  <div>
    <BaseModal
      v-model:active="modalActive"
      :title="title"
    >
      <label for="name" class="name-label">List Name</label>
      <input
        v-model="name"
        type="text"
        name="name"
        class="name-input"
      />
      <div class="checkbox-container">
        <div>
          <input
            v-model="ownerCanView"
            type="checkbox"
            id="ownerCanView"
            name="ownerCanView"
            class="checkbox-input"
            :disabled="isEditing"
          >
        </div>
        <label for="ownerCanView" class="checkbox-label" :class="{'checkbox-label--disabled': isEditing}">
          Let me view what others have bought and noted on this list.
          <span class="checkbox-warning">Note: This cannot be changed after saving. Other users will know if this setting is enabled.</span>
        </label>
      </div>
      <template #footer>
        <div/>
        <div>
          <BaseButton
            v-if="isEditing"
            label="Delete List"
            is-delete
            is-outlined
            class="delete-button"
            @click="confirmDelete"
          />
          <BaseButton
            :label="saveButtonLabel"
            :disabled="invalid"
            @click="saveList"
          />
        </div>
      </template>
    </BaseModal>
    <BaseModal
      v-model:active="confirmDeleteModalActive"
      title="Delete List"
      aria-label="delete list confirmation modal"
    >
      Are you sure you want to delete this list?
      <template #footer>
        <div/>
        <BaseButton
          label="Delete List"
          is-delete
          @click="deleteList"
        />
      </template>
    </BaseModal>
  </div>
</template>

<style scoped>
.list-card {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border: 1px solid var(--color-border);
  border-radius: 6px;
  padding: 0.5rem 1rem;
  margin-bottom: 1rem;
}

.list-name {
  font-family: var(--header-font);
  font-weight: 500;
}

.add-button {
  margin-top: 0.5rem;
}

.name-label {
  display: block;
  font-family: var(--header-font);
  font-weight: 600;
  margin-bottom: 0.5rem;
}

.name-input {
  display: block;
  width: 75%;
  font-size: 1rem;
  margin-bottom: 2rem;
  padding: 0.5rem 0.75rem;
}

.checkbox-container {
  display: flex;
}

input[type=checkbox].checkbox-input {
  accent-color: var(--lb-c-violet);
  width: 1.25rem;
  height: 1.25rem;
  cursor: pointer;
  margin-right: 0.5rem;
}

.checkbox-label--disabled {
  opacity: 0.7;
}

.checkbox-warning {
  color: var(--lb-c-red);
}

.delete-button {
  margin-right: 1rem;
}
</style>
