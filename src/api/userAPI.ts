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
