import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import type { KeyValue } from '@/common/interfaces'
import { userUpdateSelfInfoAPI } from '@/api/userAPI'

export const useUserStore = defineStore('user', () => {
  async function userUpdateSelfInfo(payload: KeyValue) {
    const res = await userUpdateSelfInfoAPI(payload)
    return res.isSuccess
  }

  return {
    userUpdateSelfInfo
  }
})
