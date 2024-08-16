import axios from 'axios'
import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { beURL } from '../../config'

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

  function fetchLists() {
    axios.get(`${beURL}/lists`)
      .then(response => {
        setLists(response.data)
      })
      .catch(error => {
        console.log('fetch lists error', error)
      });
  }

  return { lists, selectedListId, selectedList, setLists, setSelectedList, fetchLists }
})