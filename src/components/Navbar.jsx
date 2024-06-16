import React from 'react'
import { socket } from '../socket'

const Navbar = (props) => {
  const handleClick = () => {
    socket.emit('userDisconnected', {name:props.data.name, id:socket.id})
  }
  
  return (
    <section className='flex bg-slate-800 text-white m-1 rounded-lg justify-between'>
        <div className="logo w-1/4 flex mx-4">
            <h1 className='text-2xl my-3 font-semibold crimson text-green-500 cursor-pointer'><span className='text-green-500'>&lt;</span>TalkHub<span className='text-green-500'>&#47;&gt;</span></h1>
        </div>
        
        <div className="authentication w-[30%] text-white flex items-center justify-between">
          {props.data.connected?<>
            <h1 className='redressed text-lg text-red-600 mx-2'><span className='crimson text-white'>Connected: </span> {props.data.name}</h1>
            <button onClick={handleClick} className='my-2 mx-4 border-2 border-white rounded-3xl px-5 py-[6px] text-sm hover:bg-blue-700 transition-all duration-500'>Disconnect</button>
          </>:""}
        </div>
    </section>
  )
}

export default Navbar