<script setup>
import { computed, onMounted, ref } from 'vue'
import BaseButton from '../elements/BaseButton.vue'
import BaseModal from '../elements/BaseModal.vue'

const props = defineProps({
  item: { type: Object, required: true },
  hasEditAccess: { type: Boolean, default: false },
  hasViewAccess: { type: Boolean, default: false },
  isLastItemBeingAdded: { type: Boolean, default: false },
})

const isEditing = ref(false)
const isNew = computed(() => !props.item.id)
const itemNameForEdit = ref('')
const itemDescriptionForEdit = ref('')
const confirmModalActive = ref(false)

defineExpose({
  itemNameForEdit,
  itemDescriptionForEdit,
})

onMounted(() => {
  if (isNew.value) {
    isEditing.value = true
  }
})

const emit = defineEmits(['cancel-add', 'save-add', 'save', 'delete', 'mark-bought'])

function startEditing() {
  itemNameForEdit.value = props.item.name
  itemDescriptionForEdit.value = props.item.description
  isEditing.value = true
}

function cancelEditing() {
  if (isNew.value) {
    emit('cancel-add')
  } else {
    isEditing.value = false
    itemNameForEdit.value = ''
    itemDescriptionForEdit.value = ''
  }
}

function saveEditing() {
  if (isNew.value) {
    emit('save-add')
  } else {
    emit('save', { name: itemNameForEdit.value,  description: itemDescriptionForEdit.value })
    isEditing.value = false
    itemNameForEdit.value = ''
    itemDescriptionForEdit.value = ''
  }
}

function confirmDeleteNote() {
  if (props.item.id) {
    confirmModalActive.value = true
  } else {
    emit('delete')
  }
}

function markBought(e) {
  emit('mark-bought', e.target.checked)
}

const config = ref({
  attribution: false,
  charCounterMax: 1000,
  charCounterCount: false,
  heightMin: 100,
  placeholderText: 'Add description/link (optional)',
  wordCounterCount: false,
})
</script>

<template>
  <div class="item-container">
    <div v-if="isEditing && hasEditAccess" class="item__edit">
      <input v-model="itemNameForEdit" placeholder="Enter Item" class="item__edit-name-input" />
      <froala
        v-model:value="itemDescriptionForEdit"
        :tag="'textarea'"
        :config="config"
      />
      <div v-if="isLastItemBeingAdded || !isNew" class="item__edit__button-container">
        <BaseButton
          label="Cancel"
          is-small
          is-outlined
          class="item__edit__button"
          @click="cancelEditing"
        />
        <BaseButton
          label="Save"
          is-small
          class="item__edit__button"
          @click="saveEditing"
        />
      </div>
    </div>
    <div v-else class="item__view">
      <div class="item__view__row">
        <div v-if="hasViewAccess" class="item__view__bought-checkbox-container">
          <input
            type="checkbox"
            :name="`bought_${item.id}`"
            :checked="item.is_bought"
            class="item__view__bought-checkbox"
            @input="markBought"
          >
        </div>
        <div class="item__view__item-container" :class="{'item__view__--bought': item.is_bought}">
          <div class="item__view__name-container">
            <p class="item__view__name">{{ item.name }}</p>
            <div v-if="hasEditAccess" class="item__view__button-container">
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
          </div>
          <froalaView :value="item.description" class="item__view__description-container--desktop" />
        </div>
      </div>
      <div
        v-if="item.description"
        class="item__view__description-container--mobile"
        :class="{'item__view__--bought': item.is_bought}"
      >
        <froalaView :value="item.description" />
      </div>
    </div>
    <BaseModal
      v-model:active="confirmModalActive"
      title="Delete Item"
      aria-label="delete item confirmation modal"
    >
      Are you sure you want to delete <strong>{{ item.name }}</strong>?
      <template #footer>
        <div/>
        <BaseButton
          label="Delete Item"
          is-delete
          @click="emit('delete')"
        />
      </template>
    </BaseModal>
  </div>
</template>

<style scoped>
.item-container {
  margin: 1rem 0;
  position: relative;
}

.item__edit-name-input {
  border-radius: 6px;
  border: 1px solid rgb(204, 204, 204);
  width: 100%;
  margin-bottom: 0.5rem;
  padding: 0.5rem;
  font-size: 1.1rem;
}

.item__edit__button-container {
  text-align: right;
  margin-top: 0.5rem;
}

.item__edit__button {
  margin-left: 0.5rem;
}

.item__view__row {
  display: flex;
}

.item__view__bought-checkbox-container {
  flex-grow: 0;
  flex-shrink: 0;
  display: flex;
  justify-content: center;
  width: 3.75rem;
  margin-right: 0.5rem;
}

.item__view__bought-checkbox {
  margin-top: 0.25rem;
  width: 2rem;
  height: 2rem;
  cursor: pointer;
}

input[type=checkbox].item__view__bought-checkbox {
  accent-color: var(--lb-c-violet);
}

.item__view__--bought {
  text-decoration: line-through;
}

.item__view__name-container {
  display: flex;
  align-items: center;
}

.item__view__name {
  font-weight: 500;
}

.item__view__description-container--desktop {
  display: block;
}

.item__view__description-container--mobile {
  display: none;
}

.item__view__button-container {
  margin-left: 1rem;
}

@media only screen and (max-width: 950px) {
  .item__view__bought-checkbox-container {
    width: auto;
    margin-right: 1rem;
  }

  .item__view__bought-checkbox {
    width: 1.5rem;
    height: 1.5rem;
    margin-top: 0;
  }

  .item__view__description-container--desktop {
    display: none;
  }
  
  .item__view__description-container--mobile {
    display: block;
    margin-top: 0.5rem;
    padding-bottom: 0.5rem;
  }
}
</style>
