import type { KeyValue } from '@/common/interfaces'
import { useAPI } from '../common/fetch'

export async function login(userInfo: KeyValue) {
  console.log('ducdm')
  const response = await useAPI(
    {
      url: `auth/login`,
      header: {
        'Content-Type': 'application/json'
      },
      data: JSON.stringify(userInfo),
      method: 'POST'
    },
    false
  )
  return response
}

export async function verifyUser() {
  const response = await useAPI(
    {
      url: `auth/verify`,
      method: 'POST'
    },
    true
  )
  return response
}

export async function getSelfProfile() {
  const response = await useAPI(
    {
      url: `users/self`,
      method: 'GET'
    },
    true
  )
  return response
}
