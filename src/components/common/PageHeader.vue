<template>
  <div class="h-16 bg-green-500 fixed w-full top-0 z-30">
    <div class="pl-4 flex items-center float-left w-[60px] h-full">
      <el-button @click="goBack" :icon="ArrowLeftBold" circle />
    </div>
    <div
      class="text-center flex float-left items-center justify-center w-[calc(100vw-120px)] h-full"
    >
      <span class="font-semibold text-2xl text-white">{{ title }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import router from '@/router'
import { ArrowLeftBold } from '@element-plus/icons-vue'

const props = defineProps<{
  title: string
}>()

function goBack() {
  router.back()
}
</script>
