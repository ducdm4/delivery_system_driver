<template>
  <div class="welcome-header">
    <p>Welcome back!</p>
    <p>{{ fullName }}</p>
    <p>{{ employeeRoleListName[authStore.userLoggedIn.role] }}</p>
    <p>{{ authStore.userLoggedIn.employeeInfo?.station.name }}</p>
  </div>

  <div class="p-3">
    <CurrentManifest class="mt-4"></CurrentManifest>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { employeeRoleListName } from '@/common/constant'
import CurrentManifest from '@/components/home/CurrentManifest.vue'

const authStore = useAuthStore()
const fullName = computed(() => {
  return `${authStore.userLoggedIn.firstName} ${authStore.userLoggedIn.lastName}`
})
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
