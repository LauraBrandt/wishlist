<script setup>
import axios from 'axios'
import { computed, ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useAuthStore } from '../stores/auth'
import { useListStore } from '../stores/list'
import BaseButton from '../elements/BaseButton.vue'
import BaseModal from '../elements/BaseModal.vue'
import SingleItem from './SingleItem.vue'
import { beURL } from '../../config'

const NUM_ITEMS_INITIAL = 5

const authStore = useAuthStore()
const { getAuthHeader } = authStore

const listStore = useListStore()
const { selectedList, selectedListId } = storeToRefs(listStore)
const { fetchLists } = listStore

defineProps({
  isMyList: { type: Boolean, default: false },
  canViewListStatus: { type: Boolean, default: false },
})

const items = computed(() => selectedList.value?.items || [])
const tempItems = ref([...items.value])
const itemRefs = ref([])
const hasUnsavedItem = computed(() => tempItems.value.some(item => !item.id))

const addModalActive = ref(false)
const numItemsToAdd = ref(NUM_ITEMS_INITIAL)

const lastItemBeingAddedIndex = computed(() => tempItems.value.findLastIndex(item => !item.id))

watch(
  items,
  () => {
    tempItems.value = [...items.value]
  },
  { immediate: true },
)

function showNumItemsToAdd() {
  numItemsToAdd.value = NUM_ITEMS_INITIAL
  addModalActive.value = true
}

function addItems() {
  addModalActive.value = false
  const newItems = []
  for (let i = 0; i < numItemsToAdd.value; i += 1) {
    newItems.push({
      name: '',
      description: '',
    })
  }
  tempItems.value = [...tempItems.value, ...newItems]
}

function cancelAddItems() {
  tempItems.value = tempItems.value.filter(item => !!item.id)
}

async function saveAddedItems() {
  const newItems = []
  tempItems.value.forEach((item, index) => {
    if (!item.id) {
      const itemRef = itemRefs.value[index]
      const itemName = itemRef?.itemNameForEdit || ''
      const itemDescription = itemRef?.itemDescriptionForEdit || ''
      if (itemName || itemDescription) {
        newItems.push({
          name: itemName,
          description: itemDescription,
        })
      }
    }
  })
  const url = `${beURL}/lists/${selectedListId.value}/items`

  const header = await getAuthHeader()
  axios.post(url, newItems, header)
    .then(() => {
      fetchLists()
    })
    .catch(error => {
      console.log('save items error:', error.response.data.message || error.response.data.error)
    });
}

async function saveItemAtIndex(index, newItem) {
  const item = tempItems.value[index]
  const url = `${beURL}/lists/${selectedListId.value}/items${item.id ? `/${item.id}/update` : ''}`
  const itemToSave = {
    name: newItem.name,
    description: newItem.description,
  }

  const header = await getAuthHeader()
  axios.post(url, itemToSave, header)
    .then(() => {
      fetchLists()
    })
    .catch(error => {
      console.log('save item error:', error.response.data.message || error.response.data.error)
    });
}

async function deleteItemAtIndex(index) {
  const item = tempItems.value[index]
  if (item.id) {
    const url = `${beURL}/lists/${selectedListId.value}/items/${item.id}`

    const header = await getAuthHeader()
    axios.delete(url, header)
      .then(() => {
        fetchLists()
      })
      .catch(error => {
        console.log('delete item error:', error.response.data.message || error.response.data.error)
      });
  } else {
    tempItems.value.splice(index, 1)
  }
}

async function markBoughtItemAtIndex(index, isBought) {
  const item = tempItems.value[index]
  const url = `${beURL}/lists/${selectedListId.value}/items/${item.id}/is_bought`
  const toPost = {
    is_bought: isBought,
  }

  const header = await getAuthHeader()
  axios.post(url, toPost, header)
    .then(() => {
      fetchLists()
    })
    .catch(error => {
      console.log('mark bought error:', error.response.data.message || error.response.data.error)
    });
}
</script>

<template>
  <section>
    <h2 class="section-header">Items</h2>
     <div>
      <div v-if="canViewListStatus && tempItems.length > 0" class="bought-label">Is Already Bought?</div>
      <SingleItem
        v-for="(item, index) in tempItems"
        :key="item.id"
        ref="itemRefs"
        :item="item"
        :is-my-list="isMyList"
        :can-view-list-status="canViewListStatus"
        :is-last-item-being-added="lastItemBeingAddedIndex === index"
        @cancel-add="cancelAddItems"
        @save-add="saveAddedItems"
        @save="saveItemAtIndex(index, $event)"
        @delete="deleteItemAtIndex(index)"
        @mark-bought="markBoughtItemAtIndex(index, $event)"
      />
      <div v-if="tempItems.length === 0" class="empty-state">
        There are no items on this list.
      </div>
    </div>
    <div v-if="isMyList && !hasUnsavedItem">
      <BaseButton
        label="Add Items"
        class="add-button"
        @click="showNumItemsToAdd"
      />
    </div>
    <BaseModal
      v-model:active="addModalActive"
      title="Add Items to Wish List"
      aria-label="add items modal"
    >
      How many items would you like to add?
      <input v-model="numItemsToAdd" type="number" class="num-items-input" />
      <template #footer>
        <div/>
        <BaseButton
          label="Add Items"
          @click="addItems"
        />
      </template>
    </BaseModal>
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

.bought-label {
  font-size: 0.85rem;
  font-weight: 500;
  color: var(--lb-c-violet);
  margin-top: 0.75rem;
  margin-bottom: -0.5rem;
  width: 4rem;
  text-align: center;
  line-height: 1.25;
}

.num-items-input {
  display: block;
  margin-top: 1rem;
  font-size: 1.25rem;
  width: 70px;
  padding: 0.25rem;
}

.empty-state {
  font-style: italic;
  color: grey;
  margin-top: 0.5rem;
  margin-bottom: 1rem;
}

@media only screen and (max-width: 950px) {
  .bought-label {
    margin-bottom: 0;
    text-align: left;
  }
}
</style>
