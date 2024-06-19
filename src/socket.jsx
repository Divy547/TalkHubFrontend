import io from 'socket.io-client'

export const socket = io("http://localhost:3001" || "https://chatting-application-backend.vercel.app/", {
  autoConnect: false,
})
