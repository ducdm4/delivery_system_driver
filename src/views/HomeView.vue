<template>
  <div class="welcome-header">
    <p>Welcome back!</p>
    <p>{{ fullName }}</p>
    <p>{{ employeeRoleListName[authStore.userLoggedIn.role] }}</p>
    <p>{{ authStore.userLoggedIn.employeeInfo?.station.name }}</p>
  </div>

  <div class="p-3">
    <el-card class="mt-2">
      <div class="flex justify-between items-center">
        <span class="text-lg">Check your manifest</span>
        <el-button @click="goToLink('/manifest')" type="success" :icon="ArrowRightBold" circle />
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { employeeRoleListName } from '@/common/constant'
import { ArrowRightBold } from '@element-plus/icons-vue'
import router from '@/router'

const authStore = useAuthStore()
const fullName = computed(() => {
  return `${authStore.userLoggedIn.firstName} ${authStore.userLoggedIn.lastName}`
})

function goToLink(url: string) {
  router.push(url)
}
</script>

<style lang="scss" scoped>
.welcome-header {
  @apply bg-green-600 p-4;
  p:first-child {
    @apply text-3xl font-bold text-white;
  }
  p:nth-child(2) {
    @apply mt-4 text-3xl font-bold text-gray-200 mb-4;
  }
  p:nth-child(3),
  p:nth-child(4) {
    @apply text-lg text-white;
  }
}
</style>
