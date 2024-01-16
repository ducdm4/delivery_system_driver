<template>
  <div
    id="background"
    class="fixed top-0 left-0 w-[100vw] h-[100vh] backdrop-brightness-75 flex justify-center items-center"
  >
    <div id="main-call-background" class="w-[90vw] bg-white p-4">
      <div class="flex justify-center items-baseline gap-1">
        <span class="text-center font-semibold text-xl"> Incoming Call </span>
        <span class="w-[10px]" ref="threeDot">.</span>
      </div>
      <p class="text-center text-gray-400">Your have a call request from customer</p>

      <div class="mt-10">
        <p class="text-center font-bold mb-6 text-lg">Delivery info</p>
        <p class="font-semibold text-red-500">
          <span class="text-sm text-gray-500">Tracking ID:</span> 23453523453425
        </p>
        <p class="font-semibold">
          <span class="text-sm text-gray-500">Recipient address:</span> so 21, nguyen huy tuong,
          thanh xuan trung, thanh xuan
        </p>
      </div>

      <div class="flex mt-10 justify-center gap-16 mb-4">
        <el-button type="success" size="large" :icon="PhoneFilled" circle />
        <el-button type="danger" size="large" :icon="CloseBold" circle />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { CloseBold, PhoneFilled } from '@element-plus/icons-vue'
import { onBeforeUnmount, onMounted, ref } from 'vue'

const threeDot = ref<InstanceType<typeof HTMLSpanElement> | null>(null)
const interval = ref(0)

onMounted(() => {
  interval.value = setInterval(() => {
    let text = threeDot.value!.innerText
    if (text.length < 3) {
      text += '.'
    } else {
      text = ''
    }
    threeDot.value!.innerText = text
  }, 500)
})

onBeforeUnmount(() => {
  if (interval.value) {
    clearInterval(interval.value)
  }
})
</script>
