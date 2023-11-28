<template>
  <el-card>
    <template #header>
      <div class="flex justify-between">
        <div class="text-lg font-semibold text-green-500">CURRENT MANIFEST</div>
        <el-button
          v-if="!orderStore.currentManifestList?.length"
          @click="getNewManifest"
          type="primary"
          round
          >Create manifest</el-button
        >
      </div>
    </template>
    <p v-if="!orderStore.currentManifestList?.length" class="text-yellow-500">
      You don't have any manifest, please create one!
    </p>
    <div class="order-container" v-else>
      <div
        v-for="(order, index) in orderStore.currentManifestList"
        :key="`${customKey}-${index}`"
        class="border rounded mb-4 p-3"
      >
        <ManifestItem @openPickupDialog="openPickupDialog" :item="order"></ManifestItem>
      </div>
    </div>
  </el-card>

  <el-dialog
    v-model="isOpenDialogPickup"
    :title="popupInfo.title"
    width="95%"
    :before-close="handleClosePickupDialog"
  >
    <div class="flex items-center justify-center">
      <el-upload
        class="proof-uploader w-[180px] h-[180px]"
        :show-file-list="false"
        auto-upload="false"
        @change="handleSelectImage"
      >
        <img
          v-if="imagePickupUrl"
          :src="imagePickupUrl"
          class="avatar h-[180px] w-[180px] object-contain"
        />
        <el-icon v-else class="proof-uploader-icon"><Plus /></el-icon>
      </el-upload>
    </div>
    <p class="text-center text-lg mt-4 font-semibold">{{ popupInfo.title2 }}</p>
    <el-select
      v-if="popupInfo.type === PICKUP_TYPE.CANCEL"
      v-model="popupInfo.cancelNote"
      class="mt-4 w-full"
      placeholder="Select"
    >
      <el-option v-for="item in reasonList" :key="item" :label="item" :value="item" />
    </el-select>
    <template #footer>
      <span class="dialog-footer">
        <slide-unlock
          ref="vueslideunlock"
          :auto-width="true"
          :circle="true"
          :disabled="false"
          :noanimate="true"
          :height="40"
          :text="popupInfo.slide"
          success-text="Submitted"
          name="slideunlock"
          @completed="submitPickup()"
        />
      </span>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { useOrderStore } from '@/stores/order'
import { usePhotoStore } from '@/stores/photo'
import { onMounted, watch, ref } from 'vue'
import ManifestItem from '@/components/home/ManifestItem.vue'
import type { KeyValue } from '@/common/interfaces'
import SlideUnlock from 'vue-slide-unlock'
import type { UploadFile } from 'element-plus'
import { PICKUP_TYPE } from '@/common/constant'
import { ElNotification } from 'element-plus'

const orderStore = useOrderStore()
const photoStore = usePhotoStore()
const isOpenDialogPickup = ref(false)
const dialogData = ref({} as KeyValue)
const vueslideunlock = ref()
const imagePickupUrl = ref('')
const popupInfo = ref({
  type: PICKUP_TYPE.PICKUP,
  title: 'Confirm PICKUP',
  title2: 'Proof of PICKUP',
  slide: 'ORDER PICKED',
  cancelNote: "Can't call customer. Comeback later",
  image: {} as KeyValue
})
const reasonList = [
  "Can't call customer. Comeback later",
  'Customer not at the address. Comeback later',
  'Parcel not match description. Comeback later'
]
const customKey = ref(0)

onMounted(() => {
  orderStore.getCurrentManifest()
})

async function getNewManifest() {
  await orderStore.getNewManifest()
}

function openPickupDialog(item: KeyValue, type: number) {
  if (type === PICKUP_TYPE.PICKUP) {
    popupInfo.value = {
      type: PICKUP_TYPE.PICKUP,
      title: 'Confirm PICKUP',
      title2: 'Proof of PICKUP',
      slide: 'ORDER PICKED',
      cancelNote: '',
      image: {}
    }
  } else {
    popupInfo.value = {
      type: PICKUP_TYPE.CANCEL,
      title: 'Confirm CANCEL',
      title2: 'Proof of CANCEL',
      slide: 'CANCEL THIS ORDER',
      cancelNote: "Can't call customer. Comeback later",
      image: {}
    }
  }
  dialogData.value = item
  isOpenDialogPickup.value = true
}

function handleClosePickupDialog() {
  isOpenDialogPickup.value = false
  dialogData.value = {}
  imagePickupUrl.value = ''
  vueslideunlock.value.reset()
}

async function submitPickup() {
  let formData = new FormData()
  formData.append('image', popupInfo.value.image as Blob)
  const resPhoto = await photoStore.uploadNewPhoto(formData)
  if (resPhoto) {
    const payload: KeyValue = {
      trackingId: dialogData.value.uniqueTrackingId,
      data: {
        proofImageId: resPhoto.photoInfo.id,
        manifestId: orderStore.currentManifest.id,
        proofNote: ''
      }
    }
    let res = false
    if (popupInfo.value.type === PICKUP_TYPE.PICKUP) {
      res = await orderStore.collectorConfirmOrder(payload)
    } else {
      payload.proofNote = popupInfo.value.cancelNote
      res = await orderStore.collectorCancelOrder(payload)
    }
    if (res) {
      orderStore.removeOrderFromManifest(dialogData.value.id)
      handleClosePickupDialog()
      const text = popupInfo.value.type === PICKUP_TYPE.PICKUP ? 'confirmed' : 'cancelled'
      ElNotification({
        title: `Order ${text}`,
        message: `Order successfully ${text}`,
        type: 'success'
      })
      customKey.value++
    }
  }
}

function handleSelectImage(file: UploadFile) {
  imagePickupUrl.value = URL.createObjectURL(file.raw!)
  popupInfo.value.image = file.raw!
}
</script>

<style lang="scss" scoped>
.order-container {
  max-height: 350px;
  overflow: auto;
}
</style>

<style lang="scss">
.proof-uploader .el-upload {
  border: 1px dashed var(--el-border-color);
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: var(--el-transition-duration-fast);
}

.proof-uploader .el-upload:hover {
  border-color: var(--el-color-primary);
}

.el-icon.proof-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  text-align: center;
}
</style>
