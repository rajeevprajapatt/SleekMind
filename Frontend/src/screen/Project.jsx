import React, { useEffect, useState, useContext } from 'react'
import { useLocation } from 'react-router-dom'
import defaultAvatar from '../assets/defaultAvatar.jpg';
import axios from '../config/axios';
import { initializeSocket, receiveMessage, sendMessage } from '../config/socket';
import { UserContext } from '../context/user-context'
import { useRef } from 'react';
const Project = () => {
  const location = useLocation();
  const [isSidePanelOpen, setIsSidePanelOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUserIds, setSelectedUserIds] = useState([]);
  const [users, setUsers] = useState([]);
  const [projectUsers, setProjectUsers] = useState([]);
  const [project, setProject] = useState(location.state.project)
  const [message, setMessage] = useState('');
  const { user } = useContext(UserContext);
  const messageBox = useRef();

  // Fetch project users and all users
  useEffect(() => {
    initializeSocket(project._id);

    receiveMessage('project-message', data => {
      console.log(data);
      appendIncomingMessage(data)
    })

    axios.get(`projects/getProject/${location.state.project._id}`)
      .then((res) => {
        console.log(res.data.project.users);
        const users = res.data.project.users;

        const currentUserId = JSON.parse(localStorage.getItem("user"))?._id;
        const currentUser = users.find(user => user._id === currentUserId);
        const otherProjectUsers = users.filter(user => user._id !== currentUserId).sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
        setProjectUsers([currentUser, ...otherProjectUsers])
      })
      .catch(console.log);
    axios.get("/users/all").then(res => setUsers(res.data.users)).catch(console.log);
  }, [location.state.project._id]);

  // Remove project users from all users
  useEffect(() => {
    if (users.length > 0 && projectUsers.length > 0) {

      console.log("All users: ", users);
      console.log("Project Users: ", projectUsers)

      setUsers(prevUsers => prevUsers.filter(user => !projectUsers.some(pu => pu._id === user._id)));
    }
  }, [users.length, projectUsers.length]);

  const handleToggleUserSelect = (userId) => {
    setSelectedUserIds((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId]
    );
  };

  const handleAddCollaborators = () => {
    axios.put("/projects/addUser", {
      projectId: location.state.project._id,
      users: selectedUserIds
    }).then((res) => {
      // Update projectUsers state with new users
      if (res.data.project && res.data.project.users) {
        setProjectUsers(res.data.project.users);
        // Remove newly added users from users list
        setUsers(prevUsers => prevUsers.filter(user => !selectedUserIds.includes(user._id)));
      }
    }).catch(console.log);
    setIsModalOpen(false);
    setSelectedUserIds([]);
  };

  const send = () => {
    console.log(user);
    sendMessage("project-message", {
      message,
      sender: user._id
    })
    appendOutgoingMessage(message);
    setMessage("");
  }
  

  function appendIncomingMessage(messageObject) {
    const messageBox = document.querySelector(".message-box");

    const message = document.createElement('div');
    message.classList.add('message', 'max-w-66', 'flex', 'flex-col', 'p-2', 'bg-red-200', 'w-fit', 'rounded-md', 'm-1')
    message.innerHTML = `
      <small className='opacity-65 text-xs'>${messageObject.user.name || messageObject.user.email}</small>
      <p className='text-sm'>${messageObject.message}</p>
      `
    messageBox.appendChild(message)
  }

  function appendOutgoingMessage(msg) {
    const messageBox = document.querySelector(".message-box");

    const message = document.createElement('div');
    message.classList.add('message', 'ml-auto', 'max-w-66', 'flex', 'flex-col', 'p-2', 'bg-red-200', 'w-fit', 'rounded-md', 'm-1')
    message.innerHTML = `
      <small className='opacity-65 text-xs'>${user.name || user.email}</small>
      <p className='text-sm'>${msg}</p>
      `
    messageBox.appendChild(message)
  }

  return (
    <main className="h-screen w-screen flex">
      <section className='left relative h-full flex flex-col min-w-96 bg-slate-200'>
        <header className='flex justify-between items-center p-2 px-4 w-full bg-green-400'>
          <button className='flex gap-1' onClick={() => setIsModalOpen(true)}>
            <i className="ri-user-add-line mr-1 "></i>
            <p>Add Collaborator</p>
          </button>
          <button className='p-2' onClick={() => setIsSidePanelOpen(!isSidePanelOpen)}>
            <i className="ri-group-line "></i>
          </button>
        </header>
        <div className="conversation-area flex flex-grow flex-col relative overflow-hidden">
          <div ref={messageBox}
            className="message-box flex flex-col gap-1 overflow-y-auto px-2 py-2 h-full pb-20">
            <div className='message max-w-66 flex flex-col p-2 bg-red-200 w-fit rounded-md m-1'>
              <small className='opacity-65 text-xs'>test@gmail.com</small>
              <p className='text-sm'>lorem ipsum dolor sit amet consectetur.</p>
            </div>
            <div className='ml-auto message max-w-66 flex flex-col p-2 bg-red-200 w-fit rounded-md m-1'>
              <small className='opacity-65 text-xs'>test@gmail.com</small>
              <p className='text-sm'>lorem ipsum dolor sit amet consectetur.</p>
            </div>
            <div className="inputField w-full flex p-2 border-t absolute left-0 bottom-0">
              <input className='w-full p-2 px-4 border-none outline-none rounded-3xl mr-1' type="text" placeholder="Type your message here..."
                value={message} onChange={(e) => setMessage(e.target.value)}
              />
              <button onClick={send} className='flex-grow px-3 bg-white rounded-3xl' >
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
            {projectUsers.map((user) => (
              <div key={user._id} className='user flex items-center gap-3 bg-white/80 rounded-lg px-2 py-1 mb-1 shadow-sm cursor-pointer hover:shadow-lg hover:translate-x-1 duration-700 hover:transition-all'>
                <div className='w-12 h-12 rounded-full overflow-hidden bg-slate-800 flex-shrink-0'>
                  <img src={defaultAvatar} alt='user' className='w-full h-full object-cover' />
                </div>
                <div className='flex flex-col'>
                  <span className='font-medium text-gray-800 text-sm'>{user.fullName ? user.fullName : user.email}</span>
                  <span className='text-xs text-gray-500'>{user.email}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
        {/* Modal for user selection */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
            <div className="bg-white rounded-lg shadow-lg w-full max-w-md mx-2 p-4 flex flex-col">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold">Select Users</h2>
                <button onClick={() => setIsModalOpen(false)} className="text-gray-500 hover:text-gray-800">
                  <i className="ri-close-line text-2xl"></i>
                </button>
              </div>
              <div className="flex flex-col gap-2 max-h-80 overflow-y-auto">
                {users.length === 0 ? (
                  <p className='text-center text-gray-500'>No users available</p>) : (
                  users.map(user => (
                    <div
                      key={user._id}
                      onClick={() => handleToggleUserSelect(user._id)}
                      className={`flex items-center gap-3 px-3 py-2 rounded-lg border cursor-pointer hover:bg-blue-100 transition-all ${selectedUserIds.includes(user._id)
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 bg-white'
                        }`}
                    >
                      <div className='w-10 h-10 rounded-full overflow-hidden bg-slate-800 flex-shrink-0'>
                        <img src={defaultAvatar} alt={user.name} className='w-full h-full object-cover' />
                      </div>
                      <div className='flex flex-col items-start'>
                        <span className='font-medium text-gray-800 text-sm'>{user.name}</span>
                        <span className='text-xs text-gray-500'>{user.email}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
              <button
                className="mt-4 bg-green-500 text-white px-4 py-2 rounded-lg font-semibold disabled:opacity-50"
                onClick={handleAddCollaborators}
                disabled={selectedUserIds.length === 0}
              >
                Add Collaborators
              </button>
              <p className='flex justify-center item-center text-sm text-green-500'>Total selected : {selectedUserIds.length}</p>
            </div>
          </div>
        )}
      </section>
    </main>
  )
}

export default Project
