<template>
  <RouterView />

  <nav v-if="authStore.userLoggedIn?.id">
    <div>
      <RouterLink to="/"
        ><el-icon size="25"><House /></el-icon
      ></RouterLink>
    </div>
    <div>
      <RouterLink to="/notifications"
        ><el-icon size="25"><Bell /></el-icon
      ></RouterLink>
    </div>
    <div>
      <RouterLink to="/more"
        ><el-icon size="25"><More /></el-icon
      ></RouterLink>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import { onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useAuthStore } from './stores/auth'
import router from './router'
import { useRoute } from 'vue-router'
import { usePhotoStore } from './stores/photo'
import { useBroadcastChannel } from '@vueuse/core'
import type { KeyValue } from './common/interfaces'

const verified = ref(false)
const authStore = useAuthStore()
const photoStore = usePhotoStore()
const { data, close } = useBroadcastChannel({
  name: 'delivery-system-channel'
})

onBeforeUnmount(() => {
  close()
})

watch(data, async () => {
  const received = data.value as KeyValue
  if (received) {
    if (received.name === 'login') {
      if (received.data.isSuccess) {
        authStore.mutationUserLogin(received.data.data)
        await handleAfterLogin(received.data.data.user)
        router.push('/')
      }
    }
  }
})

async function handleAfterLogin(res: KeyValue) {
  console.log('res', res)
  if (res.profilePicture) {
    const resProfile = await photoStore.getPhotoById({ id: res.profilePicture.id })
    if (resProfile) {
      photoStore.mutationProfile(URL.createObjectURL(resProfile))
    }
  }
}

onMounted(async () => {
  const token = localStorage.getItem(import.meta.env.VITE_PUBLIC_API_KEY)
  const route = useRoute()
  if (!authStore.userLoggedIn.id && token) {
    const res = await authStore.verify()
    if (res) verified.value = true
    if (!verified.value) {
      router.push('/login')
    } else if (verified.value) {
      if (route.fullPath === '/login') {
        router.push('/')
      } else {
        await handleAfterLogin(res)
      }
    }
  }
})
</script>

<style scoped lang="scss">
nav {
  @apply fixed bottom-0 w-full grid-cols-3 grid w-full bg-white h-16 border-t-2;
  div {
    @apply flex items-center justify-center text-lg;
  }
}
</style>
