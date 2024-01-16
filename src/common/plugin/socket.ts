import { io } from 'socket.io-client'

// "undefined" means the URL will be computed from the `window.location` object
const URL = `${import.meta.env.VITE_PUBLIC_API_URL}:${import.meta.env.VITE_PUBLIC_API_PORT}`

export const socket = io(URL, {
  autoConnect: true
})
