import React, { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import defaultAvatar from '../assets/defaultAvatar.jpg';

const Project = () => {

  const location = useLocation();

  const [isSidePanelOpen, setIsSidePanelOpen] = useState(false);

  return (
    <main className="h-screen w-screen flex">
      <section className='left relative h-full flex flex-col min-w-80 bg-slate-200'>
        <header className='flex justify-end p-2 px-4 w-full bg-green-400'>
          <button className='p-2' onClick={() => setIsSidePanelOpen(!isSidePanelOpen)}>
            <i className="ri-group-line text-xl"></i>
          </button>
        </header>

        <div className="conversation-area flex flex-grow flex-col ">
          <div className="message-box flex-grow flex flex-col relative">
            <div className='message max-w-60 flex flex-col p-2 bg-red-200 w-fit rounded-md m-1'>
              <small className='opacity-65 text-xs'>test@gmail.com</small>
              <p className='text-sm'>lorem ipsum dolor sit amet consectetur.</p>
            </div>
            <div className='ml-auto message max-w-60 flex flex-col p-2 bg-red-200 w-fit rounded-md m-1'>
              <small className='opacity-65 text-xs'>test@gmail.com</small>
              <p className='text-sm'>lorem ipsum dolor sit amet consectetur.</p>
            </div>

            <div className="inputField w-full flex p-2 border-t  absolute left-0 bottom-0">
              <input className='w-full p-2 px-4 border-none outline-none rounded-3xl mr-1' type="text" placeholder="Type your message here..." />
              <button className='flex-grow px-3 bg-white rounded-3xl'>
                <i className="ri-send-plane-fill text-xl"></i>
              </button>
            </div>
          </div>
        </div>

        <div className={`sidePanel w-full h-full flex flex-col gap-2 bg-transparent backdrop-blur-md transition-all absolute ${isSidePanelOpen ? '-translate-x-0' : '-translate-x-full'} top-0`}>
          <header className='flex justify-end p-2 px-4 bg-green-500'>
            <button className='p-2' onClick={() => setIsSidePanelOpen(false)}>
              <i className="ri-close-line text-xl" ></i>
            </button>
          </header>

          <div className='users flex flex-col gap-1 p-2'>
            {[1,2,3].map((_, idx) => (
              <div key={idx} className='user flex items-center gap-3 bg-white/80 rounded-lg px-2 py-1 mb-1 shadow-sm cursor-pointer hover:shadow-lg hover:transition-shadow hover:translate-x-1 hover:duration-400 hover:transition-all'>
                <div className='w-12 h-12 rounded-full overflow-hidden bg-slate-800 flex-shrink-0'>
                  <img src={defaultAvatar} alt='user' className='w-full h-full object-cover' />
                </div>
                <div className='flex flex-col'>
                  <span className='font-medium text-gray-800 text-sm'>User Name</span>
                  <span className='text-xs text-gray-500'>user@email.com</span>
                </div>
              </div>
            ))}
          </div>
          
        </div>

      </section>
    </main>
  )
}

export default Project
