import React from 'react'
import { useNavigate, useLocation } from 'react-router-dom'

const Project = () => {

  const location = useLocation();
  console.log("Project location state:", location.state);

  return (
    <main className="h-screen w-screen flex">
      <section className='left h-full flex flex-col min-w-72 bg-slate-200'>
        <header className='flex justify-end p-2 px-4 w-full bg-green-400'>
          <button className='p-2'>
            <i className="ri-group-line"></i>
          </button>
        </header>

        <div className="conversation-area flex flex-grow flex-col ">
          <div className="message-box flex-grow flex flex-col relative">
            <div className='incoming'>
            <small>test@gmail.com</small>
              lorem ipsum dolor sit amet consectetur.
            </div>

            <div className="inputField w-full flex p-2 border-t  absolute left-0 bottom-0">
              <input className='w-full p-2 px-4 border-none outline-none rounded-3xl mr-1' type="text" placeholder="Type your message here..." />
              <button className='flex-grow px-3 bg-white rounded-3xl'>
                <i className="ri-send-plane-fill"></i>
              </button>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}

export default Project
