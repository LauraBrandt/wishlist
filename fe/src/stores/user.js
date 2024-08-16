import axios from 'axios'
import { ref } from 'vue'
import { defineStore } from 'pinia'
import { beURL } from '../../config'

export const useUserStore = defineStore('user', () => {
  const user = ref(null)

  function setUser(payload) {
    user.value = payload
  }
  
  function fetchUser() {
    axios.get(`${beURL}/users/logged-in`)
      .then(response => {
        setUser(response.data)
      })
      .catch(error => {
        console.log('fetch user error', error)
      });
  }

  return { user, fetchUser }
})