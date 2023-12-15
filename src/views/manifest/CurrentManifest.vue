<template>
  <CommonPage title="Manifest">
    <template #main>
      <el-card class="fixed w-full z-30 left-0 top-[4rem]">
        <template #header>
          <div class="flex justify-between">
            <div class="text-lg font-semibold text-green-500">CURRENT MANIFEST</div>
          </div>
        </template>
        <template v-if="!orderStore.currentManifestList?.length">
          <p class="text-yellow-500">You don't have any manifest, please create one!</p>
          <div class="text-center mt-4">
            <el-button
              v-if="!orderStore.currentManifestList?.length"
              @click="getNewManifest"
              type="primary"
              round
              >Create manifest</el-button
            >
          </div>
        </template>

        <div class="order-container" v-else>
          <p class="font-semibold text-lg text-gray-500">
            Processed: {{ orderStore.currentManifest?.orderProcessed.length }} /
            {{ orderStore.currentManifest?.orders.length }} order(s)
          </p>
          <div
            v-if="!isCollector && orderStore.currentManifestList?.length"
            class="text-center mt-5"
          >
            <el-button @click="isOpenDialogScanner = true" type="warning" :icon="Camera"
              >Add order by Barcode</el-button
            >
          </div>
        </div>
      </el-card>

      <div
        v-if="orderStore.currentManifestList?.length"
        :class="{ 'mt-36': isCollector, 'mt-48': !isCollector }"
      >
        <el-card
          v-for="(item, index) in orderStore.currentManifestList"
          :key="`${customKey}-${index}`"
          class="border rounded mb-4"
        >
          <ManifestItem
            @addParcelToBasket="addParcelProcess"
            @openProcessDialog="openProcessDialog"
            :item="item"
          ></ManifestItem>
        </el-card>
      </div>

      <el-dialog
        v-model="isOpenDialogProcess"
        :title="popupInfo.title"
        width="95%"
        :before-close="handleCloseProcessDialog"
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
          <el-option v-for="item in reasonListDisplay" :key="item" :label="item" :value="item" />
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
              @completed="submitProcess()"
            />
          </span>
        </template>
      </el-dialog>

      <el-dialog
        v-model="isOpenDialogScanner"
        title="Scan tracking ID"
        width="95%"
        :before-close="handleCloseScanDialog"
      >
        <StreamBarcodeReader
          v-if="isOpenDialogScanner"
          @decode="onDecode"
          @loaded="onLoaded"
        ></StreamBarcodeReader>
        <el-divider>Or input tracking ID</el-divider>
        <el-input v-model="barcodeScanned" placeholder="Please input" />
        <p class="text-red-500 ml-2 text-sm">{{ errorBarcodeScan }}</p>
        <div class="text-center mt-4">
          <el-button @click="addToBasket" size="large" type="primary">Add to basket</el-button>
        </div>
      </el-dialog>
    </template>
  </CommonPage>
</template>

<script setup lang="ts">
import { useOrderStore } from '@/stores/order'
import { usePhotoStore } from '@/stores/photo'
import { useAuthStore } from '@/stores/auth'
import { onMounted, watch, ref, computed } from 'vue'
import ManifestItem from '@/components/home/ManifestItem.vue'
import type { KeyValue } from '@/common/interfaces'
import SlideUnlock from 'vue-slide-unlock'
import type { UploadFile } from 'element-plus'
import { DROP_TYPE, PICKUP_TYPE, ROLE_LIST } from '@/common/constant'
import { ElNotification } from 'element-plus'
import CommonPage from '@/components/common/CommonPage.vue'
//@ts-ignore
import { StreamBarcodeReader } from 'vue-barcode-reader'
import { Camera } from '@element-plus/icons-vue'

const orderStore = useOrderStore()
const photoStore = usePhotoStore()
const authStore = useAuthStore()
const isOpenDialogProcess = ref(false)
const isOpenDialogScanner = ref(false)
const dialogData = ref({} as KeyValue)
const vueslideunlock = ref()
const imagePickupUrl = ref('')
const popupInfo = ref({
  type: PICKUP_TYPE.PICKUP as number,
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
const reasonListDrop = [
  "Can't contact customer. Comeback later",
  'Customer not at the address. Comeback later',
  'Recipient refuse to get the order'
]
const customKey = ref(0)
const barcodeScanned = ref('')
const errorBarcodeScan = ref('')

onMounted(async () => {
  await orderStore.getCurrentManifest()
})

const reasonListDisplay = computed(() => {
  return isCollector.value ? reasonList : reasonListDrop
})

const isCollector = computed(() => {
  return authStore.userLoggedIn.role === ROLE_LIST.COLLECTOR
})

async function getNewManifest() {
  const res = await orderStore.getNewManifest()
  if (res) {
    await orderStore.getCurrentManifest()
  } else {
    ElNotification({
      title: `Failed`,
      message: `There is no order available at this time, please try again later`,
      type: 'error'
    })
  }
}

function onLoaded(e: any) {}

function onDecode(e: any) {
  barcodeScanned.value = e
  addToBasket()
}

function openProcessDialog(item: KeyValue, type: number) {
  if (isCollector.value) {
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
  } else {
    if (type === DROP_TYPE.DROP) {
      popupInfo.value = {
        type: DROP_TYPE.DROP,
        title: 'Confirm SHIPPED',
        title2: 'Proof of SHIPPED',
        slide: 'ORDER SHIPPED',
        cancelNote: '',
        image: {}
      }
    } else {
      popupInfo.value = {
        type: DROP_TYPE.CANCEL,
        title: 'Confirm CANCEL',
        title2: 'Proof of CANCEL',
        slide: 'CANCEL THIS ORDER',
        cancelNote: "Can't call customer. Comeback later",
        image: {}
      }
    }
  }

  dialogData.value = item
  isOpenDialogProcess.value = true
}

function handleCloseProcessDialog() {
  isOpenDialogProcess.value = false
  imagePickupUrl.value = ''
  vueslideunlock.value.reset()
}

function handleCloseScanDialog() {
  isOpenDialogScanner.value = false
  barcodeScanned.value = ''
}

async function addToBasket() {
  let check = true
  if (
    !barcodeScanned.value ||
    orderStore.currentManifestList.findIndex(
      (x: KeyValue) => x.order.uniqueTrackingId === barcodeScanned.value
    ) < 0
  ) {
    errorBarcodeScan.value = 'Barcode is not valid'
    check = false
  } else {
    errorBarcodeScan.value = ''
  }

  if (check) {
    errorBarcodeScan.value = ''
    const payload = {
      trackingId: barcodeScanned.value
    }
    addParcelProcess(payload)
  }
}

async function addParcelProcess(payload: KeyValue) {
  const res = await orderStore.shipperPickedOrder(payload)
  if (res) {
    await orderStore.getCurrentManifest()
    handleCloseScanDialog()
  }
}

async function submitProcess() {
  let formData = new FormData()
  formData.append('image', popupInfo.value.image as Blob)
  const resPhoto = await photoStore.uploadNewPhoto(formData)
  if (resPhoto) {
    const payload: KeyValue = {
      trackingId: dialogData.value.order.uniqueTrackingId,
      data: {
        proofImageId: resPhoto.photoInfo.id,
        manifestId: orderStore.currentManifest.id,
        proofNote: ''
      }
    }
    let res = false
    if (isCollector.value) {
      if (popupInfo.value.type === PICKUP_TYPE.PICKUP) {
        res = await orderStore.collectorConfirmOrder(payload)
      } else {
        payload.data.proofNote = popupInfo.value.cancelNote
        res = await orderStore.collectorCancelOrder(payload)
      }
    } else {
      if (popupInfo.value.type === DROP_TYPE.DROP) {
        res = await orderStore.shipperShippedOrder(payload)
      } else {
        payload.data.proofNote = popupInfo.value.cancelNote
        res = await orderStore.shipperCancelOrder(payload)
      }
    }

    if (res) {
      orderStore.removeOrderFromManifest(dialogData.value.order.id)
      handleCloseProcessDialog()
      const text = popupInfo.value.type === PICKUP_TYPE.PICKUP ? 'confirmed' : 'cancelled'
      const textDrop = popupInfo.value.type === DROP_TYPE.DROP ? 'shipped' : 'cancelled'

      ElNotification({
        title: `Order ${isCollector.value ? text : textDrop}`,
        message: `Order successfully ${isCollector.value ? text : textDrop}`,
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
:deep .overlay-element {
  position: absolute;
  top: 0;
  width: 100%;
  height: 100%;
  background: rgba(30, 30, 30, 0.5);
  -webkit-clip-path: polygon(
    0% 0%,
    0% 100%,
    20% 100%,
    20% 20%,
    80% 20%,
    80% 80%,
    20% 80%,
    20% 100%,
    100% 100%,
    100% 0%
  );
  clip-path: polygon(
    0% 0%,
    0% 100%,
    10% 100%,
    10% 20%,
    90% 20%,
    90% 80%,
    0% 80%,
    0% 100%,
    100% 100%,
    100% 0%
  );
}

:deep .laser {
  width: 80%;
  margin-left: 10%;
  background-color: tomato;
  height: 1px;
  position: absolute;
  top: 40%;
  z-index: 2;
  box-shadow: 0 0 4px red;
  animation: scanning-78045ee5 2s infinite;
}
.order-container {
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
