<template>
  <p class="text-[20px] text-gray-800 font-semibold">
    {{ item.order.uniqueTrackingId }}
  </p>
  <p class="text-lg mt-2 font-semibold">{{ item.order.senderName }}</p>
  <p class="text-[20px] text-gray-500 font-semibold">
    {{ fullTextAddress }}
  </p>
  <p class="mt-2 text-red-600">
    Number of parcel: <span class="text-lg font-semibold">{{ item.order.parcels.length }}</span>
  </p>
  <div class="grid grid-cols-3 mt-2 gap-1">
    <el-image
      v-for="(img, idx) in imageList"
      :key="idx"
      :src="img"
      :zoom-rate="1.2"
      :max-scale="7"
      :min-scale="0.2"
      :preview-src-list="imageList"
      :initial-index="4"
      fit="cover"
    />
  </div>
  <div class="flex justify-center mt-5">
    <el-button @click="callPhone(item.order.senderPhone)" type="primary" :icon="Cellphone" circle />
    <el-button @click="direction" type="info" :icon="Location" circle />
    <template v-if="isCollector">
      <el-button @click="openDialogPickup(PICKUP_TYPE.PICKUP)" type="success" class="w-30"
        >Pickup</el-button
      >
      <el-button @click="openDialogPickup(PICKUP_TYPE.CANCEL)" type="danger" class="w-30"
        >Cancel</el-button
      >
    </template>

    <template v-if="!isCollector">
      <el-button
        v-if="item.status === ORDER_STATUS.ORDER_READY_TO_SHIP"
        @click="openDialogPickup(DROP_TYPE.DROP)"
        type="success"
        class="w-30"
        >Add to basket</el-button
      >
      <el-button
        v-if="item.status === ORDER_STATUS.ORDER_ON_THE_WAY_TO_RECEIVER"
        @click="openDialogPickup(DROP_TYPE.DROP)"
        type="success"
        class="w-30"
        >Shipped</el-button
      >
      <el-button
        v-if="item.status === ORDER_STATUS.ORDER_ON_THE_WAY_TO_RECEIVER"
        @click="openDialogPickup(DROP_TYPE.CANCEL)"
        type="danger"
        class="w-30"
        >Can't ship</el-button
      >
    </template>
  </div>
</template>

<script setup lang="ts">
import type { KeyValue } from '@/common/interfaces'
import router from '@/router'
import { onMounted, watch, ref, computed } from 'vue'
import { usePhotoStore } from '@/stores/photo'
import { Cellphone, Location } from '@element-plus/icons-vue'
import { PICKUP_TYPE, DROP_TYPE, ROLE_LIST, ORDER_STATUS } from '@/common/constant'
import { useAuthStore } from '@/stores/auth'

const props = defineProps<{
  item: KeyValue
}>()
const imageList = ref([] as Array<string>)
const photoStore = usePhotoStore()
const authStore = useAuthStore()
const emit = defineEmits(['openProcessDialog'])

onMounted(async () => {
  for (let i = 0; i < props.item.order.parcels.length; i++) {
    const photoRes = await photoStore.getPhotoById({ id: props.item.order.parcels[i].photo.id })
    if (photoRes) {
      imageList.value.push(URL.createObjectURL(photoRes))
    } else {
      imageList.value.push('')
    }
  }
})

const isCollector = computed(() => {
  return authStore.userLoggedIn.role === ROLE_LIST.COLLECTOR
})

const fullTextAddress = computed(() => {
  const key = isCollector.value ? 'pickupAddress' : 'dropOffAddress'
  let res = []
  if (props.item.order[key].building) {
    res.push(props.item.order[key].building)
  }
  if (props.item.order[key].detail) {
    res.push(props.item.order[key].detail)
  }
  res.push(props.item.order[key].street.name)
  res.push(props.item.order[key].ward.name)
  res.push(props.item.order[key].district.name)
  res.push(props.item.order[key].city.name)
  return res.join(', ')
})

function callPhone(number: string) {
  window.open(`tel:${number}`)
}

function direction() {
  window.open(`http://maps.google.com/?q=${fullTextAddress.value}"`)
}

function openDialogPickup(type: number) {
  emit('openProcessDialog', props.item, type)
}
</script>
