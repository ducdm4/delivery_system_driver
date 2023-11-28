import { useAPI } from '../common/fetch'
import type { KeyValue } from '@/common/interfaces'

export const addNewPhoto = async (data: KeyValue) => {
  const response = await useAPI(
    {
      url: 'photos',
      method: 'POST',
      data
    },
    true
  )
  return response
}

export const getPhotoByIdAPI = async (data: KeyValue) => {
  const response = await useAPI({
    url: `photos/${data.id}`,
    method: 'GET'
  })
  return response
}
