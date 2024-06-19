import io from 'socket.io-client'

export const socket = io("https://chatting-application-backend.vercel.app/", {
  autoConnect: false,
})
