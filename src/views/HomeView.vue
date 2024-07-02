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
    <button @click="connectToPeer">get peerid</button>
    <button @click="videoCall">call</button>
    <button @click="answerCall">answer</button>
    <input v-model="peerConnect" type="text" />
  </div>

  <video width="200" height="200" autoplay="true" id="video-call"></video>
  <video width="300" height="300" autoplay="true" id="video-answer-call"></video>
  <audio autoplay="true" id="audio-answer-call"></audio>
  <audio autoplay="true" id="audio-call"></audio>
</template>

<script setup lang="ts">
import { computed, onMounted, onUpdated, ref, nextTick } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { employeeRoleListName } from '@/common/constant'
import { ArrowRightBold } from '@element-plus/icons-vue'
import router from '@/router'
// import peer from '@/common/plugin/peer'

const authStore = useAuthStore()
const fullName = computed(() => {
  return `${authStore.userLoggedIn.firstName} ${authStore.userLoggedIn.lastName}`
})
const peerConnect = ref('')
const peerConnection = ref({} as RTCPeerConnection)
const videoContainer = ref<HTMLVideoElement>()
const answerVideoContainer = ref<HTMLVideoElement>()

function connectToPeer() {
  // const conn = peer.connect(peerConnect.value)
  // conn.on('open', () => {
  //   conn.send('hi!')
  // })
}

function goToLink(url: string) {
  router.push(url)
}

function answerCall() {}

function videoCall() {
  // const getMedia = navigator.mediaDevices.getUserMedia({ video: true, audio: true })
  // getMedia.then(
  //   (stream) => {
  //     const videoId = document.getElementById('video-call') as HTMLVideoElement
  //     if (videoId) {
  //       videoId.srcObject = stream
  //     }
  //     const call = peer.call(peerConnect.value, stream)
  //     call.on('stream', (localStream) => {
  //       console.log('localStream', localStream)
  //       // Show stream in some <video> element.
  //       const videoRemoteId = document.getElementById('video-answer-call') as HTMLVideoElement
  //       if (videoRemoteId) {
  //         videoRemoteId.srcObject = stream
  //       }
  //       // videoContainer.value!.srcObject = remoteStream
  //     })
  //   },
  //   (err) => {
  //     console.error('Failed to get local stream', err)
  //   }
  // )
}
// }

// Create PeerConnection function
// function createPeerConnection() {
//   // Initialize PeerConnection
//   peerConnection.value = new RTCPeerConnection()

//   // On ICE candidate event
//   peerConnection.value.onicecandidate = (event) => {
//     if (event.candidate) {
//       console.log(`Sending ICE candidate to remote peer: ${JSON.stringify(event.candidate)}`)
//       peerConnection.value.createOffer(JSON.stringify({ ice: event.candidate }))
//     }
//   }

//   // On track event
//   peerConnection.value.ontrack = (event) => {
//     console.log('Remote stream received!')
//     answerVideoContainer.value!.srcObject = event.streams[0]
//   }
// }

onMounted(() => {
  // console.log('peer homeview', peer)
  // peer.on('connection', (conn) => {
  //   console.log('fasdf', conn)
  //   conn.on('data', (data) => {
  //     console.log('data connected to other')
  //     // Will print 'hi!'
  //     console.log(data)
  //   })
  //   conn.on('open', () => {
  //     console.log('open connected to other')
  //     conn.send('hello!')
  //   })
  // })
  // setTimeout(() => {
  //   peer.on('error', (err) => {
  //     console.log(err)
  //   })
  //   peer.on('call', (call) => {
  //     console.log('receive call', call)
  // navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then(
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
  //   })
  // }, 1000)
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
