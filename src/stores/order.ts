import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import type { KeyValue } from '@/common/interfaces'
import {
  collectorCancelOrderAPI,
  collectorConfirmOrderAPI,
  getCurrentManifestAPI,
  getNewManifestAPI,
  shipperCancelOrderAPI,
  shipperPickedOrderAPI,
  shipperShippedOrderAPI
} from '@/api/orderAPI'

export const useOrderStore = defineStore('order', () => {
  const currentManifest = ref({} as KeyValue)

  const currentManifestList = computed(() => {
    if (currentManifest.value?.orders?.length) {
      const removeArr = currentManifest.value?.orderProcessed.map((item: { id: number }) => item.id)
      return currentManifest.value.orders.filter((item: { id: number }) => {
        return !removeArr.includes(item.id)
      })
    }
    return []
  })

  async function getCurrentManifest() {
    const res = await getCurrentManifestAPI()
    if (res.isSuccess) {
      currentManifest.value = res.data
      return true
    }
    return false
  }

  async function getNewManifest() {
    const res = await getNewManifestAPI()
    if (res.isSuccess) {
      currentManifest.value = res.data
    }
    return false
  }

  async function collectorCancelOrder(payload: KeyValue) {
    const res = await collectorCancelOrderAPI(payload)
    return res.isSuccess
  }

  async function collectorConfirmOrder(payload: KeyValue) {
    const res = await collectorConfirmOrderAPI(payload)
    return res.isSuccess
  }

  function removeOrderFromManifest(id: number) {
    currentManifest.value.orderProcessed.push(
      currentManifest.value.orders.find((x: KeyValue) => x.id === id)
    )
  }

  async function shipperPickedOrder(payload: KeyValue) {
    const res = await shipperPickedOrderAPI(payload)
    return res.isSuccess
  }

  async function shipperCancelOrder(payload: KeyValue) {
    const res = await shipperCancelOrderAPI(payload)
    return res.isSuccess
  }

  async function shipperShippedOrder(payload: KeyValue) {
    const res = await shipperShippedOrderAPI(payload)
    return res.isSuccess
  }

  return {
    currentManifest,
    currentManifestList,
    getCurrentManifest,
    getNewManifest,
    collectorCancelOrder,
    removeOrderFromManifest,
    collectorConfirmOrder,
    shipperPickedOrder,
    shipperCancelOrder,
    shipperShippedOrder
  }
})
