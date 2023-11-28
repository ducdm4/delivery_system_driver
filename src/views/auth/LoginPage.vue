<template>
  <div class="login-page">
    <h1>Delivery System</h1>
    <h2>Driver</h2>

    <el-card class="box-card">
      <template #header>
        <div class="card-header">
          <span class="font-bold text-lg">Login</span>
          <el-button class="button" text>Forgot password</el-button>
        </div>
      </template>
      <div>
        <div>
          <el-input v-model="loginInfo.email" size="large" placeholder="Email" clearable />
          <p class="text-sm text-red-500 ml-2">{{ errorInfo.email }}</p>
        </div>

        <div>
          <el-input
            v-model="loginInfo.password"
            size="large"
            type="password"
            placeholder="Password"
            clearable
            show-password
            class="mt-4"
          />
          <p class="text-sm text-red-500 ml-2">{{ errorInfo.password }}</p>
        </div>

        <div class="w-full text-center mt-6">
          <el-button @click="submit()" type="primary" class="!px-10 !h-10">Sign in</el-button>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { validateEmail, validatePassword } from '@/common/functions'
import { ref } from 'vue'
import { useAuthStore } from '@/stores/auth'
import router from '@/router'

const storeAuth = useAuthStore()

const loginInfo = ref({
  email: '',
  password: ''
})
const errorInfo = ref({
  email: '',
  password: ''
})

async function submit() {
  if (validate()) {
    const res = await storeAuth.doLogin(loginInfo.value)
    if (res) {
      router.push('/')
    }
  }
}

function validate() {
  const data = loginInfo.value
  let check = true
  if (!validateEmail(data.email)) {
    errorInfo.value.email = 'Please input correct email'
    check = false
  } else {
    errorInfo.value.email = ''
  }

  if (!validatePassword(data.password)) {
    errorInfo.value.password = 'Please input correct password'
    check = false
  } else {
    errorInfo.value.password = ''
  }
  return check
}
</script>

<style scoped lang="scss">
.login-page {
  @apply p-4;
  h1 {
    @apply text-center text-4xl font-bold pt-10 text-green-500;
  }
  h2 {
    @apply text-center text-2xl font-bold text-gray-500 mt-6;
  }

  .box-card {
    @apply mt-10;
    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
  }
}
</style>
