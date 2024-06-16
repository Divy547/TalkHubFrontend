import { useEffect, useState, useRef } from 'react'
import Navbar from './components/Navbar'
import './App.css'
import { socket } from './socket'

function App() {
  const [IsConnected, setIsconnected] = useState(false)
  const [inRoom, setInRoom] = useState(false)
  const [currentRoom, setCurrentRoom] = useState("")
  const [currentRoomCreater, setCurrentRoomCreater] = useState("")
  const [name, setName] = useState("NoName")
  const [rooms, setRoom] = useState([])

  const messageRef = useRef()
  const allMessages = useRef()
  const inputRef = useRef()
  const roomNameRef = useRef()
  const joinRoomRef = useRef()
  const roomUser = useRef()
  

  const handleClick = () => {
    socket.connect()
    socket.emit('new-user-joined', inputRef.current.value)
    setName(inputRef.current.value)
    setIsconnected(true)
  }

  const createRoom = () => {
    setInRoom(true)
    let RoomName = roomNameRef.current.value
    setCurrentRoomCreater(name)
    setCurrentRoom(RoomName)
    socket.emit('roomCreation', {RoomName, name})
  }

  const joinRoom = (e) => {
    //Joining-Room
    setCurrentRoomCreater(e.target.id)
    setInRoom(true)
    setCurrentRoom(e.target.name)
    socket.emit('Joining-Room', {rName:e.target.name, name:name, id:socket.id})
    
  }
  const leaveRoom = (e) => {
    
    allMessages.current.innerHTML = ""
    socket.emit('leave-room', {name:name, roomName:currentRoom, id:socket.id})
    setInRoom(false)
    setCurrentRoom("")
  }

  const sendMessage = () => {
    socket.emit('UserMessage', { message: messageRef.current.value, name: name, roomName: currentRoom})
    messageRef.current.value = ""
  }

  function Form() {
    return (
      <>
        <input type="text" placeholder='Name' ref={inputRef} />
        <button onClick={handleClick}>ClickToConnect</button>
      </>
    )
  }


  useEffect(() => {
    socket.on('message', data => {
      if (data.id == socket.id) {

        let div = document.createElement('div')
        let p = document.createElement('p') 
        div.classList.add('messageSen')
        p.innerHTML = `${data.name}: ${data.message}`
        div.appendChild(p)
        allMessages.current.appendChild(div)

      } else {
        let div = document.createElement('div')
        let p = document.createElement('p')
        div.classList.add('messageRec')
        p.innerHTML = `${data.name}: ${data.message}`
        div.appendChild(p)
        allMessages.current.appendChild(div)
      }
    })
    
    socket.on('users', users => {

      let userContainer = document.querySelector('.onlineUsers')
      
      userContainer.innerHTML = ""
      let userNames = Object.values(users)
      for (let i = 0; i < userNames.length; i++) {
        let name = userNames[i]
        let div = document.createElement('div')
        div.classList.add('userSectionContainer')

        let html = `<p>${name}</p><span>Online</span>`
        div.innerHTML = html
        userContainer.appendChild(div)
      }
    })


    socket.on('disconnection', users => {
      let userContainer = document.querySelector('.onlineUsers')
      if (users.id == socket.id) {
        setIsconnected(false)
        userContainer.innerHTML = ""
      } else {
        let userNames = Object.values(users.users)
        
        userContainer.innerHTML = ""
        for (let i = 0; i < userNames.length; i++) {
          let name = userNames[i]
          let div = document.createElement('div')
          div.classList.add('userSectionContainer')
          let html = `<p>${name}</p><span>Online</span>`
          div.innerHTML = html
          userContainer.appendChild(div)
        }
      }
    })

    socket.on('new-room-connection', data=>{
      if(data.id != socket.id){
        alert(`${data.name} joined the Group!`)
      }
      roomUser.current.innerHTML = ""
      let users = Object.values(data.cUiR)
      for (let i = 0; i < users.length; i++) {
        let name = users[i]
        let span = document.createElement('span')
        let html = `${name} | `
        span.innerHTML = html
        roomUser.current.appendChild(span)
      }
    })


    socket.on('leftRoom', data=>{
      alert(`${data.name} left the Group!`)
      roomUser.current.innerHTML = ""
      let users = Object.values(data.cUiR)
      for (let i = 0; i < users.length; i++) {
        let name = users[i]
        let span = document.createElement('span')
        let html = `${name} | ` 
        span.innerHTML = html
        roomUser.current.appendChild(span)
      }
    })

  }, [socket]);
  
  socket.on('newRoom', data=>{
    setRoom([...rooms, data])
  })

  function Form() {
    return (
      <>
        <div className="boxForm flex h-[88vh] justify-center items-center">
          <div className="form h-80 w-[300px] flex flex-col justify-center p-4">

            <input type="text" placeholder='Name' ref={inputRef} className=' outline-none text-base text-slate-900 py-[7px] px-5 rounded-3xl bg-slate-200 placeholder-slate-900 m-2  font-extralight crimson' required:true />
            <input type="text" placeholder='Age' className=' outline-none text-base text-slate-900 py-[7px] px-5 rounded-3xl bg-slate-200 placeholder-slate-900 m-2  font-extralight crimson' />
            <button onClick={handleClick} className='bg-green-600  text-white text-sm  m-2 px-1 py-2 w-[50%] rounded-3xl hover:bg-green-500 crimson'>ClickToConnect</button>
          </div>
        </div>
      </>
    )
  }

  return (
    <>
      <Navbar data={{ name: name, connected: IsConnected }} />

      {IsConnected == false ? <Form /> : <>
        <section className='main flex'>
          <div className="communication w-[40%] m-1">
            <div className="messages flex flex-col h-[470px] max-h-[470px] overflow-y-scroll" ref={allMessages}>
            {inRoom == false?<><p className='text-center text-lg mt-10'>Join Or Create A Room.</p></>:""}
            </div>
            <div className="sendStuff flex ">
              <input type="text" placeholder='EnterMessage' ref={messageRef} className='w-[100%] outline-none text-base text-slate-900 py-2 px-5 rounded-3xl bg-slate-200 placeholder-slate-900 my-2  font-extralight crimson' />
              <button onClick={sendMessage} className='bg-green-600  text-white  m-2 px-5 py-[4px] rounded-3xl hover:bg-green-500 crimson'>Send</button>
            </div>
          </div>
          <div className="roomHandling bg-green-750 w-[30%] m-1">
            <div className="creation h-[45%] flex flex-col m-2">
              {inRoom == false?<>
                <p className='m-4 text-slate-900 text-lg'>Create a Group</p>
                <input type="text" placeholder='RoomName' ref={roomNameRef} className='blackShadow my-2 mx-3 outline-none text-base text-slate-900 py-[7px] px-5 rounded-3xl bg-slate-200 placeholder-slate-500 font-extralight'/>
                <button onClick={createRoom} className='greenBtn bg-green-500 border-[1px] my-3 mx-[13px] text-green-950 text-base border-transparent py-[6px] w-max px-[16px] rounded-3xl'>CreateRoom</button>
              </>:<>
                <div className="leavingRoom">
                  <p className='my-2 mx-[14px] text-slate-900 text-lg'>Currently in Group: {currentRoom} by {currentRoomCreater}</p>
                  <button onClick={leaveRoom} className='redBtn bg-red-500 border-[1px] my-2 mx-[13px] text-red-950 text-base border-transparent py-[6px] w-max px-[16px] rounded-3xl'>LeaveRoom</button>
                </div>
                <div className="usersInRoom flex">
                  <p className='my-2 ml-[14px] mr-1 text-slate-900 text-lg'>In Group: </p>
                  <p className="my-2 ml-[14px] mr-1 text-slate-900" ref={roomUser}></p>
                </div>
              </>}
            </div>

            <div className="joining h-[270px] max-h-[270px] m-2 overflow-y-scroll">
              {inRoom?<>
                <p className='text-center text-lg mt-10'>Leave the current room to join a new Group.</p>
              </>:<>
                <p className='my-[10px] mx-[14px] text-slate-900 text-lg'>Join a Group</p>
                {rooms.map((room)=>{
                  return(
                    <div className="room" key={room.RoomName}>
                      <p>{room.RoomName}: {room.name}</p>
                      <button name={room.RoomName} id = {room.name} onClick={joinRoom} ref={joinRoomRef}>Join</button>
                    </div>
                  )
                })}
              </>}
            </div>
          </div>

          <div className="onlineUsers w-[30%]  m-1 max-h-[525px] overflow-y-scroll">
            <h1 className='font-bold text-slate-600 crimson text-lg mx-3 my-2'>Current Users</h1>
          </div>

        </section>
      </>}
    </>
  )
}

export default App
