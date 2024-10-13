<script setup>
import { computed, ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useListStore } from '../stores/list'
import { useAuthStore } from '../stores/auth'
import BaseButton from '../elements/BaseButton.vue'
import SingleNote from './SingleNote.vue'
import api from '../api'

const listStore = useListStore()
const { selectedList, selectedListId } = storeToRefs(listStore)
const { fetchLists } = listStore

const authStore = useAuthStore()
const { firebaseUser } = storeToRefs(authStore)

const notes = computed(() => selectedList.value?.notes || [])
const tempNotes = ref([...notes.value])
const hasUnsavedNote = computed(() => tempNotes.value.some(note => !note.id))

watch(
  notes,
  () => {
    tempNotes.value = [...notes.value]
  },
  { immediate: true },
)

function addNote() {
  tempNotes.value.push({
    user_id: firebaseUser.value.uid,
    user_name: firebaseUser.value.displayName,
    text: '',
  })
}

async function saveNoteAtIndex(index, noteText) {
  const note = tempNotes.value[index]
  const url = `/lists/${selectedListId.value}/notes${note.id ? `/${note.id}` : ''}`
  const noteToSave = { text: noteText }
  const result = await api.post(url, noteToSave)
  if (!result.error) {
    fetchLists()
  }
}

async function deleteNoteAtIndex(index) {
  const note = tempNotes.value[index]
  if (note.id) {
    const url = `/lists/${selectedListId.value}/notes/${note.id}`
    const result = await api.delete(url)
    if (!result.error) {
      fetchLists()
    }
  } else {
    tempNotes.value.splice(index, 1)
  }
}
</script>

<template>
  <section>
    <h2 class="section-header">Notes</h2>
    <div>
      <div v-for="(note, index) in tempNotes" :key="note.id">
        <SingleNote
          :note="note"
          @save="saveNoteAtIndex(index, $event)"
          @delete="deleteNoteAtIndex(index)"
        />
      </div>
      <div v-if="tempNotes.length === 0" class="empty-state">
        There are no notes for this list.
      </div>
    </div>
    <div v-if="!hasUnsavedNote">
      <BaseButton
        label="Add Note"
        class="add-button"
        @click="addNote"
      />
    </div>
  </section>
</template>

<style scoped>
.section-header {
  font-family: var(--header-font);
  font-weight: 600;
  font-size: 1.25rem;
}

.add-button {
  margin-top: 0.5rem;
}

.empty-state {
  font-style: italic;
  color: grey;
  margin-top: 0.5rem;
  margin-bottom: 1rem;
}
</style>
