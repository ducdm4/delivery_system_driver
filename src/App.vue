<template>
  <RouterView />

  <KeepAlive>
    <nav v-if="authStore.userLoggedIn?.id">
      <div>
        <RouterLink to="/"
          ><el-icon size="25"><House /></el-icon
        ></RouterLink>
      </div>
      <div>
        <RouterLink to="/more"
          ><el-icon size="25"><More /></el-icon
        ></RouterLink>
      </div>
    </nav>
  </KeepAlive>

  <CallScreen v-if="callInfo.isShowDialog" />
</template>

<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import { onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useAuthStore } from './stores/auth'
import router from './router'
import { useRoute } from 'vue-router'
import { usePhotoStore } from './stores/photo'
import { useUserStore } from './stores/user'
import { useOrderStore } from './stores/order'
import { useBroadcastChannel } from '@vueuse/core'
import type { KeyValue } from './common/interfaces'
import { getMessaging, getToken, onMessage } from 'firebase/messaging'
import firebaseApp from '../src/common/plugin/firebase'
import { socket } from '../src/common/plugin/socket'
import CallScreen from '@/components/call/CallScreen.vue'
import peer from '@/common/plugin/peer'

const verified = ref(false)
const authStore = useAuthStore()
const photoStore = usePhotoStore()
const { data, close } = useBroadcastChannel({
  name: 'delivery-system-channel'
})
const userStore = useUserStore()
const orderStore = useOrderStore()
const callInfo = ref({ isShowDialog: false, trackingId: '' })
const callInstance = ref(null as any)

onBeforeUnmount(() => {
  close()
  socket.disconnect()
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

function getTokenNotification() {
  const messagingService = getMessaging(firebaseApp)
  getToken(messagingService, {
    vapidKey: import.meta.env.VITE_PUBLIC_VAPID_KEY as string
  })
    .then(async (currentToken: string) => {
      if (currentToken) {
        await userStore.updateNotificationToken(currentToken)
        onMessage(messagingService, (payload) => {
          new Notification(payload.notification?.title as string, {
            body: payload.notification?.body,
            icon: '/img/icons/android-launchericon-512-512.png'
          })
        })
      }
    })
    .catch((err: any) => {
      console.log('An error occurred while retrieving token. ', err)
    })
}

async function handleAfterLogin(res: KeyValue) {
  getTokenNotification()

  if (res.profilePicture) {
    const resProfile = await photoStore.getPhotoById({ id: res.profilePicture.id })
    if (resProfile) {
      photoStore.mutationProfile(URL.createObjectURL(resProfile))
    }
  }
  orderStore.getCurrentManifest()
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
      await handleAfterLogin(res)
      if (route.fullPath === '/login') {
        router.push('/')
      }
    }
  }

  if (socket.id) {
    socket.emit('shipperWaitingCall', { instanceId: socket.id })
  }

  socket.on('customerRequestCall', (data: KeyValue) => {
    if (
      orderStore.currentManifestList.findIndex(
        (x: KeyValue) => x.order.uniqueTrackingId === data.trackingId.toString()
      ) > -1
    ) {
      console.log('peer2', peer)
      callInfo.value.trackingId = data.trackingId
      socket.emit('shipperWantJoinCall', {
        instanceId: socket.id,
        roomName: data.roomName,
        peerId: peer.id
      })
    }
  })

  console.log('peerpeerpeer', peer)
  peer.on('call', (call) => {
    console.log('receive call', call)
    callInstance.value = call
    callInfo.value.isShowDialog = true
    const orderInfo = orderStore.currentManifestList.find(
      (x: KeyValue) => x.order.uniqueTrackingId === callInfo.value.trackingId.toString()
    )
    // navigator.mediaDevices.getUserMedia({ video: false, audio: true }).then(
    //   (stream) => {
    //     call.answer(stream) // Answer the call with an A/V stream.
    //     const videoId = document.getElementById('video-call') as HTMLVideoElement
    //     if (videoId) {
    //       videoId.srcObject = stream
    //     }
    //     call.on('stream', (remoteStream) => {
    //       // Show stream in some <video> element.
    //       const videoRemoteId = document.getElementById('video-answer-call') as HTMLVideoElement
    //       if (videoRemoteId) {
    //         videoRemoteId.srcObject = remoteStream
    //       }
    //     })
    //   },
    //   (err) => {
    //     console.error('Failed to get local stream', err)
    //   }
    // )
  })

  console.log('socket', socket.id)
})
</script>

<style scoped lang="scss">
nav {
  @apply fixed bottom-0 w-full grid-cols-2 grid w-full bg-white h-16 border-t-2;
  div {
    @apply flex items-center justify-center text-lg;
  }
}
</style>
