<template>
  <CommonPage title="Account">
    <template #main>
      <div>
        <el-upload
          class="proof-uploader w-[120px] h-[120px]"
          :show-file-list="false"
          :auto-upload="false"
          @change="handleSelectImage"
        >
          <img
            v-if="photoStore.profileImage"
            :src="photoStore.profileImage"
            class="avatar h-[120px] w-[120px] object-contain"
          />
          <el-icon v-else class="proof-uploader-icon"><Plus /></el-icon>
        </el-upload>
      </div>
    </template>
  </CommonPage>
</template>

<script setup lang="ts">
import type { KeyValue } from '@/common/interfaces'
import CommonPage from '../../components/common/CommonPage.vue'
import { usePhotoStore } from '@/stores/photo'
import { useUserStore } from '@/stores/user'
import type { UploadFile } from 'element-plus'

const photoStore = usePhotoStore()
const userStore = useUserStore()

async function handleSelectImage(file: UploadFile) {
  console.log('fsadf')
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
