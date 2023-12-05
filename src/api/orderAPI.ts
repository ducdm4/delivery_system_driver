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

export async function shipperPickedOrderAPI(payload: KeyValue) {
  const response = await useAPI(
    {
      url: `orders/shipperConfirmed/${payload.trackingId}`,
      header: {
        'Content-Type': 'application/json'
      },
      method: 'PATCH'
    },
    true
  )
  return response
}

export async function shipperCancelOrderAPI(payload: KeyValue) {
  const response = await useAPI(
    {
      url: `orders/shipperCancel/${payload.trackingId}`,
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

export async function shipperShippedOrderAPI(payload: KeyValue) {
  const response = await useAPI(
    {
      url: `orders/shipperShipped/${payload.trackingId}`,
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
