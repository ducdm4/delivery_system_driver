import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import type { KeyValue } from '@/common/interfaces'
import { updateNotificationTokenAPI, updatePasswordAPI, userUpdateSelfInfoAPI } from '@/api/userAPI'

export const useUserStore = defineStore('user', () => {
  async function userUpdateSelfInfo(payload: KeyValue) {
    const res = await userUpdateSelfInfoAPI(payload)
    return res.isSuccess
  }

  async function updateNotificationToken(token: string) {
    const res = await updateNotificationTokenAPI(token)
    return res.isSuccess
  }

  async function updatePassword(data: KeyValue) {
    const res = await updatePasswordAPI(data)
    return res.isSuccess
  }

  return {
    userUpdateSelfInfo,
    updateNotificationToken,
    updatePassword
  }
})
