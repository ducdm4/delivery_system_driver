import type { KeyValue } from '@/common/interfaces'
import { useAPI } from '../common/fetch'

export async function getCurrentManifestAPI() {
  const response = await useAPI(
    {
      url: `manifests/current`,
      header: {
        'Content-Type': 'application/json'
      },
      method: 'GET'
    },
    true
  )
  return response
}

export async function getNewManifestAPI() {
  const response = await useAPI(
    {
      url: `manifests/new`,
      header: {
        'Content-Type': 'application/json'
      },
      method: 'GET'
    },
    true
  )
  return response
}

export async function collectorCancelOrderAPI(payload: KeyValue) {
  const response = await useAPI(
    {
      url: `orders/collectorCancel/${payload.trackingId}`,
      header: {
        'Content-Type': 'application/json'
      },
      method: 'PATCH',
      data: JSON.stringify(payload.data)
    },
    true
  )
  return response
}

export async function collectorConfirmOrderAPI(payload: KeyValue) {
  const response = await useAPI(
    {
      url: `orders/collectorConfirm/${payload.trackingId}`,
      header: {
        'Content-Type': 'application/json'
      },
      method: 'PATCH',
      data: JSON.stringify(payload.data)
    },
    true
  )
  return response
}
