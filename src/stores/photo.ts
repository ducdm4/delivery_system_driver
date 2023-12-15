import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import type { KeyValue } from '@/common/interfaces'
import { addNewPhoto, getPhotoByIdAPI } from '@/api/photoAPI'

export const usePhotoStore = defineStore('photo', () => {
  const profileImage = ref('')

  function mutationProfile(url: string) {
    profileImage.value = url
  }

  async function getPhotoById(data: KeyValue) {
    const res = await getPhotoByIdAPI(data)
    if (res.isSuccess) {
      return res.data
    }
    return false
  }

  async function uploadNewPhoto(data: KeyValue) {
    const res = await addNewPhoto(data)
    if (res.isSuccess) {
      return res.data
    }
    return false
  }

  return { getPhotoById, uploadNewPhoto, mutationProfile, profileImage }
})
