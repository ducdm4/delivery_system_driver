<template>
  <CommonPage title="Account">
    <template #main>
      <div class="flex justify-center">
        <el-upload
          class="main-profile w-[120px] h-[120px]"
          :show-file-list="false"
          :auto-upload="false"
          @change="handleSelectImage"
        >
          <img
            v-if="photoStore.profileImage"
            :src="photoStore.profileImage"
            class="avatar h-[120px] w-[120px] object-contain"
          />
          <el-icon v-else class="main-profile-icon"><Plus /></el-icon>
        </el-upload>
      </div>
      <div class="bg-white rounded-lg p-4 mt-4">
        <div class="info-row">
          First name: <span>{{ userProfile.firstName }}</span>
        </div>
        <div class="info-row">
          Last name: <span>{{ userProfile.lastName }}</span>
        </div>
        <div class="info-row mt-5">
          Email: <span>{{ userProfile.email }}</span>
        </div>
        <div class="info-row">
          Phone: <span>{{ userProfile.phone }}</span>
        </div>
        <div class="info-row mt-5">
          Station:
          <span>{{ userProfile.employeeInfo?.station.name }}</span>
        </div>
        <div class="info-row">
          Position:
          <span>{{ userProfile.role === ROLE_LIST.SHIPPER ? 'Shipper' : 'Collector' }}</span>
        </div>
      </div>
      <div class="flex justify-center mt-6">
        <el-button @click="changePassword" size="large" type="danger">Change password</el-button>
      </div>
    </template>
  </CommonPage>

  <el-dialog
    v-model="dialogInfo.isShow"
    title="Change password"
    width="98%"
    :before-close="beforeCloseDialog"
  >
    <div>
      <el-input
        size="large"
        v-model="dialogInfo.currentPassword"
        type="password"
        placeholder="Current password"
        show-password
      />
      <p v-if="dialogInfo.currentError" class="text-sm text-red-500 ml-1 mt-1">
        {{ dialogInfo.currentError }}
      </p>
      <el-input
        size="large"
        v-model="dialogInfo.newPassword"
        type="password"
        placeholder="New password"
        show-password
        class="mt-4"
      />
    </div>
    <template #footer>
      <span class="dialog-footer">
        <el-button size="large" :loading="loading" type="primary" @click="submitChangePassword"
          >Confirm</el-button
        >
      </span>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import type { KeyValue } from '@/common/interfaces'
import CommonPage from '../../components/common/CommonPage.vue'
import { usePhotoStore } from '@/stores/photo'
import { useUserStore } from '@/stores/user'
import { useAuthStore } from '@/stores/auth'
import type { UploadFile } from 'element-plus'
import { onMounted, ref, watch, watchEffect } from 'vue'
import { ROLE_LIST } from '@/common/constant'
import { validatePassword } from '@/common/functions'
import { ElNotification } from 'element-plus'

const photoStore = usePhotoStore()
const userStore = useUserStore()
const authStore = useAuthStore()

const userProfile = ref({} as KeyValue)
const dialogInfo = ref({
  isShow: false,
  currentPassword: '',
  newPassword: '',
  currentError: '',
  newError: ''
})
const loading = ref(false)

onMounted(() => {
  userProfile.value = authStore.userLoggedIn
})

watch(
  () => authStore.userLoggedIn,
  () => {
    userProfile.value = authStore.userLoggedIn
  },
  { deep: true }
)

function beforeCloseDialog() {
  dialogInfo.value = {
    isShow: false,
    currentPassword: '',
    newPassword: '',
    currentError: '',
    newError: ''
  }
}

async function submitChangePassword() {
  let check = true
  if (!validatePassword(dialogInfo.value.currentPassword)) {
    dialogInfo.value.currentError = 'Current password is not valid'
    check = false
  } else {
    dialogInfo.value.currentError = ''
  }

  if (!validatePassword(dialogInfo.value.newPassword)) {
    dialogInfo.value.newError = 'New password is not valid'
    check = false
  } else {
    dialogInfo.value.newError = ''
  }

  if (check) {
    loading.value = true
    const res = await userStore.updatePassword({
      oldPassword: dialogInfo.value.currentPassword,
      newPassword: dialogInfo.value.newPassword
    })
    loading.value = false
    console.log('res', res)
    if (res) {
      ElNotification({
        title: 'Success',
        message: 'Change password successful',
        type: 'success'
      })
      beforeCloseDialog()
    }
  }
}

function changePassword() {
  dialogInfo.value.isShow = true
}

async function handleSelectImage(file: UploadFile) {
  let formData = new FormData()
  formData.append('image', file.raw! as Blob)
  const resPhoto = await photoStore.uploadNewPhoto(formData)
  if (resPhoto) {
    const payload: KeyValue = {
      profilePicture: { id: resPhoto.photoInfo.id }
    }
    const resUser = await userStore.userUpdateSelfInfo(payload)
    if (resUser) {
      photoStore.mutationProfile(URL.createObjectURL(file.raw!))
    }
  }
}
</script>

<style lang="scss" scoped>
.info-row {
  @apply text-sm;
  span {
    @apply font-semibold ml-2;
  }
}
</style>
<style lang="scss">
.main-profile {
  border-radius: 50%;
  @apply overflow-hidden border border-gray-400 bg-white;
}
</style>
