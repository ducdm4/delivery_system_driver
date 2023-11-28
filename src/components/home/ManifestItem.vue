<template>
  <p class="text-md font-semibold">{{ item.senderName }}</p>
  <p class="text-[20px] text-gray-500 mt-2 font-semibold">
    {{ fullTextAddress }}
  </p>
  <p class="mt-2 text-red-600">
    Number of parcel: <span class="text-lg font-semibold">{{ item.parcels.length }}</span>
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
    <el-button @click="callPhone(item.senderPhone)" type="primary" :icon="Cellphone" circle />
    <el-button @click="direction" type="info" :icon="Location" circle />
    <el-button @click="openDialogPickup(PICKUP_TYPE.PICKUP)" type="success" class="w-30"
      >Pickup</el-button
    >
    <el-button @click="openDialogPickup(PICKUP_TYPE.CANCEL)" type="danger" class="w-30"
      >Cancel</el-button
    >
  </div>
</template>

<script setup lang="ts">
import type { KeyValue } from '@/common/interfaces'
import router from '@/router'
import { onMounted, watch, ref, computed } from 'vue'
import { usePhotoStore } from '@/stores/photo'
import { Cellphone, Location } from '@element-plus/icons-vue'
import { PICKUP_TYPE } from '@/common/constant'

const props = defineProps<{
  item: KeyValue
}>()
const imageList = ref([] as Array<string>)
const photoStore = usePhotoStore()
const emit = defineEmits(['openPickupDialog'])

onMounted(async () => {
  for (let i = 0; i < props.item.parcels.length; i++) {
    const photoRes = await photoStore.getPhotoById({ id: props.item.parcels[i].photo.id })
    if (photoRes) {
      imageList.value.push(URL.createObjectURL(photoRes))
    } else {
      imageList.value.push('')
    }
  }
})

const fullTextAddress = computed(() => {
  let res = []
  if (props.item.pickupAddress.building) {
    res.push(props.item.pickupAddress.building)
  }
  if (props.item.pickupAddress.detail) {
    res.push(props.item.pickupAddress.detail)
  }
  res.push(props.item.pickupAddress.street.name)
  res.push(props.item.pickupAddress.ward.name)
  res.push(props.item.pickupAddress.district.name)
  res.push(props.item.pickupAddress.city.name)
  return res.join(', ')
})

function callPhone(number: string) {
  window.open(`tel:${number}`)
}

function direction() {
  window.open(`http://maps.google.com/?q=${fullTextAddress.value}"`)
}

function openDialogPickup(type: number) {
  emit('openPickupDialog', props.item, type)
}
</script>
