<template>
  <div class="relative p-4 w-[100vw] h-[calc(100vh-62px)]">
    <div class="rounded bg-white p-4 border">
      <div
        v-for="(item, index) in menuList"
        @click="goToLink(item.path)"
        :key="index"
        class=""
        :class="{
          'border-b pb-4': index < menuList.length - 1,
          'pt-4': index > 0
        }"
      >
        <p class="text-xl font-semibold">{{ item.title }}</p>
        <p class="text-gray-500 mt-2 text-sm">{{ item.desc }}</p>
      </div>
    </div>
    <el-button
      @click="logout"
      class="w-[calc(100vw-2rem)] font-semibold absolute bottom-4"
      type="warning"
      size="large"
      >LOGOUT</el-button
    >
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '@/stores/auth'
import router from '@/router'

const authStore = useAuthStore()
const menuList = [
  {
    title: 'Manifest',
    desc: 'Check your manifest here',
    path: '/manifest'
  },
  {
    title: 'My Account',
    desc: 'Change your personal information',
    path: '/account'
  }
]

function goToLink(url: string) {
  router.push(url)
}

function logout() {
  authStore.logout()
  router.push('/login')
}
</script>
