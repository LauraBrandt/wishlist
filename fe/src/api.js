import axios from 'axios'
import { useAuthStore } from './stores/auth'
import { beURL } from './../config'

const authStore = useAuthStore()
const { getAuthHeader } = authStore

export default {
  get: async (url) => {
    try {
      const fullUrl = `${beURL}${url}`
      const header = await getAuthHeader()
      const { data } = await axios.get(fullUrl, header)
      return { data, error: null }
    } catch(error) {
      console.log('GET error:', error.response.data.message || error.response.data.error)
      return { data: null, error }
    }
  },
  post: async (url, postBody) => {
    try {
      const fullUrl = `${beURL}${url}`
      const header = await getAuthHeader()
      const { data } = await axios.post(fullUrl, postBody, header)
      return { data, error: null }
    } catch(error) {
      console.log('POST error:', error.response.data.message || error.response.data.error)
      return { data: null, error }
    }
  },
  delete: async (url) => {
    try {
      const fullUrl = `${beURL}${url}`
      const header = await getAuthHeader()
      const { data } = await axios.delete(fullUrl, header)
      return { data, error: null }
    } catch(error) {
      console.log('DELETE error:', error.response.data.message || error.response.data.error)
      return { data: null, error }
    }
  },
}
