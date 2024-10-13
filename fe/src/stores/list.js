import axios from 'axios'
import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { useAuthStore } from './auth'
import { beURL } from '../../config'

const authStore = useAuthStore()
const { getAuthHeader } = authStore

export const useListStore = defineStore('list', () => {
  const lists = ref([])
  const selectedListId = ref(null)

  const selectedList = computed(() => {
    const list = lists.value.find(list => list.id === selectedListId.value)
    return { ...list }
  })

  function setLists(payload) {
    lists.value = [...(payload || [])]

    if (lists.value.length > 0 && selectedListId.value === null) {
      selectedListId.value = lists.value[0].id
    }
  }

  function setSelectedList(listId) {
    selectedListId.value = listId
  }

  async function fetchLists() {
    const header = await getAuthHeader()
    axios.get(`${beURL}/lists`, header)
      .then(response => {
        setLists(response.data)
      })
      .catch(error => {
        console.log('fetch lists error:', error.response.data.message || error.response.data.error)
      });
  }

  return { lists, selectedListId, selectedList, setLists, setSelectedList, fetchLists }
})