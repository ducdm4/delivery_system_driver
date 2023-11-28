<template>
  <RouterView />

  <nav v-if="authStore.userLoggedIn.id">
    <div><RouterLink to="/">Home</RouterLink></div>
    <div><RouterLink to="/about">More</RouterLink></div>
  </nav>
</template>

<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import { onMounted, ref, watch } from 'vue'
import { useAuthStore } from './stores/auth'
import router from './router'
import { useRoute } from 'vue-router'

const verified = ref(false)
const authStore = useAuthStore()

onMounted(async () => {
  const token = localStorage.getItem(import.meta.env.VITE_PUBLIC_API_KEY)
  const route = useRoute()
  if (!authStore.userLoggedIn.id && token) {
    verified.value = await authStore.verify()
    if (!verified.value) {
      router.push('/login')
    } else if (verified.value && route.fullPath === '/login') {
      router.push('/')
    }
  }
})
</script>

<style scoped lang="scss">
nav {
  @apply fixed bottom-0 w-full grid grid-cols-2 justify-between bg-white h-16 border-t-2;
  div {
    @apply flex items-center justify-center text-lg;
  }
}
</style>
