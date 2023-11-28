import type { APIInfo, FailedResponse, KeyValue, SuccessResponse } from './interfaces'
import { imageType } from './constant'
import { ElNotification } from 'element-plus'
import router from '../router'

export async function useAPI(apiInfo: APIInfo, isAuthorized = true): Promise<KeyValue> {
  const baseHeader: KeyValue = {}
  if (isAuthorized)
    baseHeader['Authorization'] = `Bearer ${localStorage.getItem(
      import.meta.env.VITE_PUBLIC_API_KEY as string
    )}`
  const returnData = {
    statusCode: 200,
    data: {} as KeyValue,
    message: '',
    isSuccess: true
  }
  try {
    const apiInit: KeyValue = {
      method: apiInfo.method,
      headers: {
        ...baseHeader,
        ...apiInfo.header
      }
    }
    apiInit.body = apiInfo.data
    const response = await fetch(
      `${import.meta.env.VITE_PUBLIC_API_URL}:${import.meta.env.VITE_PUBLIC_API_PORT}/${
        apiInfo.url
      }`,
      apiInit
    )
    if (imageType.findIndex((x) => x === response.headers.get('Content-Type')) > -1) {
      returnData.data = await response.blob()
    } else {
      const result = await response.json()
      if (!response.ok) {
        const res = result as FailedResponse
        handleError(res)
        returnData.isSuccess = false
        returnData.statusCode = res.statusCode
        returnData.message = res.message
      } else {
        const res = result as SuccessResponse
        returnData.data = res.data
      }
    }
  } catch (e) {
    returnData.isSuccess = false
    returnData.message = 'Unknown Error'
  }
  return returnData
}

async function handleError(res: FailedResponse) {
  if (res.statusCode === 401) {
    router.push('/login')
  } else {
    const message = res.message || 'Something went wrong!'
    ElNotification({
      title: 'Error',
      message: message,
      type: 'error'
    })
  }
}
