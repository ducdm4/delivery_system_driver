import type { KeyValue } from '@/common/interfaces'
import { useAPI } from '../common/fetch'

export async function userUpdateSelfInfoAPI(payload: KeyValue) {
  const response = await useAPI(
    {
      url: `users/self`,
      header: {
        'Content-Type': 'application/json'
      },
      method: 'PUT',
      data: JSON.stringify(payload)
    },
    true
  )
  return response
}

export async function updateNotificationTokenAPI(token: string) {
  const response = await useAPI(
    {
      url: `users/notification`,
      header: {
        'Content-Type': 'application/json'
      },
      method: 'PUT',
      data: JSON.stringify({ token })
    },
    true
  )
  return response
}

export async function updatePasswordAPI(data: KeyValue) {
  const response = await useAPI(
    {
      url: `users/change-password`,
      header: {
        'Content-Type': 'application/json'
      },
      method: 'PUT',
      data: JSON.stringify(data)
    },
    true
  )
  return response
}
