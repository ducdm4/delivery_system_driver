import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { verifyUser, login } from '@/api/authAPI'
import type { KeyValue } from '@/common/interfaces'

export const useAuthStore = defineStore('auth', () => {
  const count = ref(0)
  const userLoggedIn = ref({} as KeyValue)

  async function mutationUserLogin(data: KeyValue) {
    userLoggedIn.value = data.user
    console.log('userLoggedIn.value', userLoggedIn.value)
    localStorage.setItem(import.meta.env.VITE_PUBLIC_API_KEY, data.tokens.accessToken)
  }

  async function doLogin(data: KeyValue) {
    const res = await login(data)
    if (res.isSuccess) {
      userLoggedIn.value = res.data.user
      localStorage.setItem(import.meta.env.VITE_PUBLIC_API_KEY, res.data.tokens.accessToken)
      return res.data.user
    }
    return false
  }

  async function logout() {
    localStorage.removeItem(import.meta.env.VITE_PUBLIC_API_KEY)
    userLoggedIn.value = {}
    return true
  }

  async function verify() {
    const res = await verifyUser()
    if (res.isSuccess) {
      userLoggedIn.value = res.data
      return res.data
    }
    return null
  }

  return { count, verify, mutationUserLogin, userLoggedIn, logout, doLogin }
})
