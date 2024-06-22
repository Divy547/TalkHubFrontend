import io from 'socket.io-client'

export const socket = io("https://chattingapplicationbackend.onrender.com", {
  autoConnect: false,
})
