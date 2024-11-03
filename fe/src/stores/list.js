import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import api from '../api'

export const useListStore = defineStore('list', () => {
  const lists = ref([])
  const selectedListId = ref(null)

  const selectedList = computed(() => {
    const list = lists.value.find(list => list.id === selectedListId.value)
    if (list) {
      return { ...list }
    }
    return null
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
    const result = await api.get('/lists')
    if (!result.error) {
      setLists(result.data)
    }
  }

  return { lists, selectedListId, selectedList, setLists, setSelectedList, fetchLists }
})