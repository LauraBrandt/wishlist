<script setup>
import axios from 'axios'
import { computed, ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useListStore } from '../stores/list'
import { useUserStore } from '../stores/user'
import BaseButton from '../elements/BaseButton.vue'
import SingleNote from './SingleNote.vue'
import { beURL } from '../../config'

const listStore = useListStore()
const { selectedList, selectedListId } = storeToRefs(listStore)
const { fetchLists } = listStore

const userStore = useUserStore()
const { user } = storeToRefs(userStore)

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
    user: {
      id: user.value.id,
      name: user.value.name,
    },
    text: '',
  })
}

function saveNoteAtIndex(index, noteText) {
  const note = tempNotes.value[index]
  
  const url = `${beURL}/lists/${selectedListId.value}/notes${note.id ? `/${note.id}` : ''}`
  const noteToSave = { text: noteText }
  axios.post(url, noteToSave)
    .then(() => {
      fetchLists()
    })
    .catch(error => {
      console.log('save note error', error)
    });
}

function deleteNoteAtIndex(index) {
  const note = tempNotes.value[index]
  if (note.id) {
    const url = `${beURL}/lists/${selectedListId.value}/notes/${note.id}`
    axios.delete(url)
      .then(() => {
        fetchLists()
      })
      .catch(error => {
        console.log('delete note error', error)
      });
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
