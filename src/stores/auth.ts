import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { login, verifyUser } from '@/api/authAPI'
import type { KeyValue } from '@/common/interfaces'

export const useAuthStore = defineStore('auth', () => {
  const count = ref(0)
  const userLoggedIn = ref({} as KeyValue)

  const doubleCount = computed(() => count.value * 2)

  async function doLogin(data: KeyValue) {
    const res = await login(data)
    if (res.isSuccess) {
      userLoggedIn.value = res.data.user
      localStorage.setItem(import.meta.env.VITE_PUBLIC_API_KEY, res.data.tokens.accessToken)
      return true
    }
    return false
  }

  async function verify() {
    const res = await verifyUser()
    if (res.isSuccess) {
      userLoggedIn.value = res.data
      return true
    }
    return false
  }

  return { count, doubleCount, verify, doLogin, userLoggedIn }
})
