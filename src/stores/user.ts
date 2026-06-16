import { defineStore } from 'pinia'
import { ref } from 'vue'
import { storage } from '@/utils/storage'

export const useUserStore = defineStore('user', () => {
  const token = ref(storage.get('token') || '')
  const userInfo = ref(storage.get('userInfo') || null)

  const setToken = (val: string) => {
    token.value = val
    storage.set('token', val)
  }

  const setUserInfo = (val: object) => {
    userInfo.value = val
    storage.set('userInfo', val)
  }

  const logout = () => {
    token.value = ''
    userInfo.value = null
    storage.remove('token')
    storage.remove('userInfo')
  }

  return {
    token,
    userInfo,
    setToken,
    setUserInfo,
    logout
  }
})
