<script setup>
import { computed, onMounted, ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useAuthStore } from '../stores/auth'
import BaseButton from '../elements/BaseButton.vue'
import BaseModal from '../elements/BaseModal.vue'

const { user } = storeToRefs(useAuthStore())

const props = defineProps({
  note: { type: Object, required: true },
})

const isEditing = ref(false)
const noteTextForEdit = ref('')
const confirmModalActive = ref(false)

const isMyNote = computed(() => {
  const noteUserId =  props.note.user.id
  const myUserId = user.value?.id
  return noteUserId === myUserId
})

onMounted(() => {
  if (!props.note.id) {
    isEditing.value = true
  }
})

const emit = defineEmits(['save', 'delete'])

function startEditing() {
  noteTextForEdit.value = props.note.text
  isEditing.value = true
}

function cancelEditing() {
  emit('delete')
  isEditing.value = false
  noteTextForEdit.value = ''
}

function saveEditing() {
  emit('save', noteTextForEdit.value)
  isEditing.value = false
  noteTextForEdit.value = ''
}

function confirmDeleteNote() {
  if (props.note.id) {
    confirmModalActive.value = true
  } else {
    emit('delete')
  }
}

const config = ref({
  attribution: false,
  charCounterMax: 500,
  charCounterCount: false,
  heightMin: 100,
  wordCounterCount: false,
  toolbarButtons: [
    ['bold', 'italic', 'underline', 'strikeThrough', 'formatOL', 'formatUL', 'paragraphFormat', 'insertLink', 'clearFormatting'],
  ],
  toolbarButtonsXS: {
    moreText: {
      buttons: ['bold', 'italic', 'underline', 'strikeThrough'],
      buttonsVisible: 4,
    },
    moreParagraph: {
      buttons: ['paragraphFormat', 'formatOL', 'formatUL'],
    },
    moreMisc: {
      buttons: ['insertLink'],
    },
  },
})
</script>

<template>
  <div class="note-container">
    <div v-if="isEditing && isMyNote" class="note__edit">
      <froala
        v-model:value="noteTextForEdit"
        :tag="'textarea'"
        :config="config"
      />
      <div class="note__edit__button-container">
        <BaseButton
          label="Cancel"
          is-small
          is-outlined
          class="note__edit__button"
          @click="cancelEditing"
        />
        <BaseButton
          label="Save"
          is-small
          class="note__edit__button"
          @click="saveEditing"
        />
      </div>
    </div>
    <div v-else class="note__view" :class="{'note__view--with-buttons': isMyNote}">
      <div v-if="isMyNote" class="note__view__button-container">
        <BaseButton
          is-text-button
          label="edit"
          @click="startEditing"
        >
          <FAIcon :icon="['fas', 'pencil']" />
        </BaseButton>
        <BaseButton
          is-text-button
          is-delete
          label="delete"
          @click="confirmDeleteNote"
        >
          <FAIcon :icon="['fas', 'xmark']" />
        </BaseButton>
      </div>
      <froalaView :value="note.text"></froalaView>
      <div class="note__view__author">- {{ note.user.name }}</div>
    </div>
    <BaseModal
      v-model:active="confirmModalActive"
      title="Delete Note"
      aria-label="delete note confirmation modal"
    >
      Are you sure you want to delete this note?
      <template #footer>
        <div/>
        <BaseButton
          label="Delete Note"
          is-delete
          @click="emit('delete')"
        />
      </template>
    </BaseModal>
  </div>
</template>


<style scoped>
.note-container {
  margin: 1rem 0;
  position: relative;
}

.note__edit__button-container {
  text-align: right;
  margin-top: 0.5rem;
}

.note__edit__button {
  margin-left: 0.5rem;
}

.note__view {
  border: 1px solid var(--color-border);
  border-radius: 8px;
  padding: 1.25rem;
}

.note__view--with-buttons {
  padding-top: 2.5rem;
}

.note__view__button-container {
  position: absolute;
  right: 0.5rem;
  top: 0.5rem;
}

.note__view__author {
  text-align: right;
  font-weight: 500;
}

@media only screen and (max-width: 950px) {
  .note__view {
    padding: 1rem;
  }

  .note__view--with-buttons {
    padding-top: 2.5rem;
  }
}
</style>

<style>
.note-container .fr-toolbar .fr-btn-grp {
  margin: 0.25rem;
}

.note-container .fr-toolbar .fr-command.fr-btn {
  height: auto;
  line-height: 1;
  margin: 0.25rem;
}

.note-container .fr-toolbar .fr-command.fr-btn .fr-svg {
  height: auto;
  line-height: 1;
  margin: 0;
}

.note-container .fr-toolbar .fr-command.fr-btn.fr-dropdown.fr-selection .fr-svg {
  margin-right: 0.5rem;
}

.note-container .fr-toolbar .fr-command.fr-btn.fr-dropdown:after {
  top: 11px;
}

.note-container .fr-command.fr-btn.fr-options {
  width: 0.25rem;
}
</style>
