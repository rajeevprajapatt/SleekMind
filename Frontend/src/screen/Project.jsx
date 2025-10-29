import { useEffect, useState, useContext } from 'react'
import { useLocation } from 'react-router-dom'
import defaultAvatar from '../assets/defaultAvatar.jpg';
import axios from '../config/axios';
import { initializeSocket, sendMessage } from '../config/socket';
import { UserContext } from '../context/user-context'
import { useRef } from 'react';
import chatBotImage from '../assets/Chat bot.gif';
import SplitText from '../animations/SplitText';
import Conversation from '../assets/Conversation.gif';
import bgImage from '../assets/5072612.jpg'
import Editor from "@monaco-editor/react";
// import { set } from 'mongoose';

const Project = () => {
  const location = useLocation();
  const messageBox = useRef();
  const socketRef = useRef(null);
  const { user } = useContext(UserContext);

  const [users, setUsers] = useState([]);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [projectUsers, setProjectUsers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUserIds, setSelectedUserIds] = useState([]);
  const [isSidePanelOpen, setIsSidePanelOpen] = useState(false);
  const [project] = useState(location.state.project);
  const [AiGeneratedFiles, setAiGeneratedFiles] = useState([]);
  const [currentFile, setCurrentFile] = useState({});
  const [tempSelectedFile, setTempSelectedFile] = useState([]);
  const [aiLoading, setAiLoading] = useState(false);

  const userId = JSON.parse(localStorage.getItem("user"))?._id;

  console.log("Current File:", currentFile);

  //Initialize socket & Fetch messages                      
  useEffect(() => {
    const socket = initializeSocket(project._id);
    socketRef.current = socket;

    socket.on("connect", () => {
      console.log("Socket connected!", socket.id);
    });

    axios.get(`/chats/${location.state.project._id}`)
      .then(response => {
        setMessages(response.data)
        setAiGeneratedFiles(response.data
          .filter(msg => msg.message.hasOwnProperty("fileTree")))
        // .map(msg => msg.message));
        // setAiLoading(false);
      })
      .catch(error =>
        console.log(error)
      )

    //Receive message
    socket.on("project-message", newMessage => {
      if (newMessage) {
        setMessages(prev => [...prev, newMessage]);
        if (newMessage.message.hasOwnProperty("fileTree")) {
          setAiGeneratedFiles(prev => [...prev, newMessage]);
        }
        setAiLoading(false);
      }
    });

    return () => {
      socket.off("project-message");
      socket.disconnect();
    };
  }, [location.state.project._id]);

  //Fetch project users
  useEffect(() => {
    axios.get(`projects/getProject/${location.state.project._id}`)
      .then((res) => {
        const users = res.data.project.users;
        const currentUserId = JSON.parse(localStorage.getItem("user"))?._id;
        const currentUser = users.find(user => user._id === currentUserId);
        const otherProjectUsers = users.filter(user => user._id !== currentUserId).sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
        setProjectUsers([currentUser, ...otherProjectUsers])
      })
      .catch(console.log);

    //Fetch all users
    axios.get("/users/all").then(res => setUsers(res.data.users)).catch(console.log);
  }, [location.state.project._id]);

  // Remove project users from all users
  useEffect(() => {
    if (users.length > 0 && projectUsers.length > 0) {
      setUsers(prevUsers => prevUsers.filter(user => !projectUsers.some(pu => pu._id === user._id)));
    }
  }, [users.length, projectUsers.length]);

  //Scroll chat message to bottom
  useEffect(() => {
    if (messageBox.current) {
      setTimeout(() => {
        messageBox.current.scrollTo({
          top: messageBox.current.scrollHeight,
          behavior: 'smooth',
        });
      }, 100);
    }
  }, [messages]);

  //Select users
  const handleToggleUserSelect = (userId) => {
    setSelectedUserIds((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId]
    );
  };

  // Add collaborators
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
    window.location.reload();
  };

  const handleSendMessage = () => {
    if (!socketRef.current) return;
    if (!message.trim()) return;

    if (message.includes("@ai")) {
      setAiLoading(true);
    }

    socketRef.current.emit("project-message", {
      message,
      sender: user._id,
      projectId: project._id
    });
    setMessage("");
  }

  // Monaco Editor Theme
  const handleEditorMount = (editor, monaco) => {
    monaco.editor.defineTheme("vscode-dark-modern", {
      base: "vs-dark",
      inherit: true,
      rules: [
        { token: "", background: "1e1e1e" },
        { token: "comment", foreground: "6A9955" },
        { token: "keyword", foreground: "C586C0" },
        { token: "string", foreground: "CE9178" },
        { token: "number", foreground: "B5CEA8" },
        { token: "function", foreground: "DCDCAA" },
        { token: "type", foreground: "4EC9B0" },
      ],
      colors: {
        "editor.background": "#1E1E1E",
        "editor.foreground": "#D4D4D4",
        "editorLineNumber.foreground": "#858585",
        "editorCursor.foreground": "#AEAFAD",
        "editor.selectionBackground": "#264F78",
        "editor.inactiveSelectionBackground": "#3A3D41",
        "editor.lineHighlightBackground": "#2A2D2E",
        "editorWidget.background": "#252526",
        "editorHoverWidget.background": "#252526",
        "editorSuggestWidget.background": "#252526",
        "editorSuggestWidget.border": "#454545",
        "editorIndentGuide.background": "#404040",
        "editorIndentGuide.activeBackground": "#707070",
        "sideBar.background": "#252526",
        "statusBar.background": "#007ACC",
        "panel.background": "#1E1E1E",
      },
    });

    // Apply it AFTER defining
    monaco.editor.setTheme("vscode-dark-modern");
  };

  const handleContentUpdate = (value = "") => {
    if (!currentFile?.fileId) return;

    setCurrentFile(prev => ({
      ...prev,
      content: value
    }));

    axios.put("/chats/UpdateMessage", {
      fileId: currentFile.fileId,
      fileName: currentFile.fileName,
      content: value,
    })
      .then((res) => {
        console.log("Updated:", res.data);
      })
      .catch((err) => {
        console.error("Failed to update file:", err);
      });
  }

  return (
    <main className={`h-screen w-screen flex bg-cover bg-center`} style={{ backgroundImage: `url(${bgImage})` }}>
      <section className='left relative h-full flex flex-col min-w-96 mr-2'>
        <header className='flex justify-between items-center rounded-tr-xl shadow-md p-2 px-4 w-full bg-[#433bff] text-white backdrop-blur-2xl border-b-2 border-[#433bff]'>
          <button className='flex gap-1' onClick={() => setIsModalOpen(true)}>
            <i className="ri-user-add-line mr-1 "></i>
            <p>Add Collaborator</p>
          </button>
          <button className='p-2' onClick={() => setIsSidePanelOpen(!isSidePanelOpen)}>
            <i className="ri-group-line "></i>
          </button>
        </header>
        <div className="conversation-area flex flex-grow flex-col relative overflow-hidden backdrop-blur-sm" >
          <div ref={messageBox}
            className={`message-box flex flex-col ${messages.length > 0 ? "" : "justify-center"} gap-1 overflow-y-auto px-2 py-2 h-full pb-20 rounded-br-xl border-r-2 border-[#433bff]`}>
            {messages.length === 0 &&
              <div className='flex flex-col justify-center items-center'>
                <p className="text-center text-xl text-gray-500">Start conversation now with<br /> your team & AI</p>
                <img src={Conversation} width="300"></img>
                <p className='text-center text-sm text-gray-500'>Type a message with @ai to chat with AI assistant</p>
              </div>
            }

            {messages.map((msg, index) => {
              const isSender = msg.sender._id === userId;
              const isAI = msg.sender._id === "000000000000000000000001";
              return (
                <div
                  key={index}
                  className={`message flex flex-col p-2 w-fit rounded-md m-1 break-words text-sm
                      ${isAI ? "max-w-80 bg-[#dedcff]/50 backdrop-blur-sm text-black"
                      : isSender
                        ? "ml-auto max-w-80 bg-[#433bff] text-white"
                        : "max-w-80 bg-[#DBDBDB]  text-black"
                    }`}
                >
                  {/* Sender Info */}
                  <small
                    className={`opacity-65 text-xs mb-1 ${isSender ? "ml-auto" : ""
                      }`}
                  >
                    {msg.sender.fullName || msg.sender.email}
                  </small>

                  {/* Message Text */}
                  {isAI ? (
                    <p className={`${isSender ? "ml-auto" : ""}`}>
                      {msg.message.text}
                    </p>
                  ) : (
                    <p className={`${isSender ? "ml-auto" : ""}`}>
                      {msg.message.text}
                    </p>
                  )}
                </div>
              )
            })}

            {aiLoading &&
              <div className={`max-w-80 flex flex-col p-3 px-4 bg-[#dedcff]/50 backdrop-blur-sm w-fit rounded-md m-1 break-words text-sm`}>
                <p className={`text-white`}>
                  <TypingIndicator />
                </p>
              </div>
            }

            <div className="inputField w-full flex p-2 absolute left-0 bottom-0 border-2 border-[#433bff] rounded-br-xl backdrop-blur-sm">
              <input className='w-full p-3 px-4 border-none outline-none rounded-l-md bg-[#E5EBEE]' type="text" placeholder="Type your message here..."
                value={message} onChange={(e) => setMessage(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey && message.trim()) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
              />
              <button
                onClick={handleSendMessage}
                className='flex-grow px-3 bg-[#E5EBEE] rounded-r-md hover:bg-gray-200 transition-colors'
                aria-label="Send message"
              >
                <i className="ri-send-plane-2-fill text-xl"></i>
              </button>
            </div>
          </div>
        </div>
        <div className={`sidePanel w-full h-full flex flex-col gap-2 bg-transparent rounded-tr-xl backdrop-blur-md duration-500 transition-all absolute ${isSidePanelOpen ? '-translate-x-0' : '-translate-x-full'} top-0`}>
          <header className='flex justify-end p-2 px-4 bg-[#433bff] rounded-tr-xl text-white'>
            <button className='p-2' onClick={() => setIsSidePanelOpen(false)}>
              <i className="ri-close-line text-xl" ></i>
            </button>
          </header>
          <div className='users flex flex-col gap-1 p-2'>
            {projectUsers.map((user) => (
              <div key={user._id} className='user flex items-center gap-3 bg-white/80 border border-slate-400 rounded-lg px-2 py-1 mb-1 shadow-sm cursor-pointer hover:shadow-lg hover:translate-x-1 duration-700 hover:transition-all'>
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
      </section>

      <section className='right flex-grow h-full flex'>
        <div className={`explorer ${AiGeneratedFiles && AiGeneratedFiles.length === 0 ? "hidden" : ""} h-full bg-[#181818] max-w-64 min-w-52 border-[#433bff] overflow-y-auto border border-white/10 rounded-tl-xl rounded-bl-xl`}>
          <div className={`folder h-[7.8%] p-4 sticky top-0 z-10 flex items-center text-md bg-[#4ade33] text-white font-semibold transition-all duration-500`}>Files</div>
          <div className='w-full h-[92.2%] backdrop-blur-sm overflow-y-auto no-scrollbar'>
            {AiGeneratedFiles && AiGeneratedFiles.length > 0 && AiGeneratedFiles.map((aiFile, idx) => (
              <div className='folder flex flex-col  bg-[#181818] border-b border-white/10' key={idx}>
                <div className='w-full p-2 px-4 bg-[#181818] border-b border-white/10 text-white '>
                  <p className='text-sm font-medium'><i className="ri-folder-5-line"></i><span className='capitalize'> {aiFile.message[`folder-name`] || `Folder ${AiGeneratedFiles.indexOf(aiFile) + 1}`}</span></p>
                </div>
                {Object.keys(aiFile).length > 0 && Object.keys(aiFile.message.fileTree).map((fileName, index) => (
                  <div className='file-tree w-full' key={fileName}>
                    <div className='tree-element p-1.5 px-9 flex text-white items-center gap-2 w-full cursor-pointer hover:bg-[#37373d] hover:transform hover:translate-x-1 duration-300 overflow-y-auto '
                      onClick={() => {
                        if (fileName === 'buildCommand' || fileName === 'runCommand' || fileName === 'startCommand' || fileName === 'testCommand') {
                          setCurrentFile({
                            content: JSON.stringify(aiFile.message.fileTree[fileName]),
                            fileId: aiFile._id,
                            fileName: fileName
                          })
                        }
                        else {
                          setCurrentFile({
                            content: aiFile.message.fileTree[fileName].content
                              ? aiFile.message.fileTree[fileName].content
                              : aiFile.message.fileTree[fileName],
                            fileId: aiFile._id,
                            fileName: fileName
                          })
                        }

                        setFolder(aiFile.message.folderName || `Folder ${AiGeneratedFiles.indexOf(aiFile) + 1}`);
                      }}
                    >
                      <p className='text-sm '>{fileName}</p>
                    </div>
                  </div>
                ))
                }
              </div>
            ))}
          </div>
        </div>
        {currentFile && Object.keys(currentFile).length > 0 ? (
          <div className='code-editor w-full h-full overflow-y-auto m-0 backdrop-blur-sm bg-white/10'>
            <div className='top flex h-[7.8%] items-center bg-[#433bff] text-white text-md sticky top-0 z-10 w-full border-b-2 border-[#433bff]'>
              {/* <button>download</button> */}
              {tempSelectedFile && tempSelectedFile.length > 0 && tempSelectedFile.map((file) => (
                Object.keys(file).length > 0 && Object.keys(file).map((fileName, index) => (
                  <div className='file-name flex items-center gap-2 cursor-pointer hover:bg-green-400' key={index}>
                    <p className='text-md cursor-pointer p-4' onClick={() => setCurrentFile(file[fileName])} key={index}>{fileName}</p>
                  </div>
                ))
              ))}
            </div>
            <div className='bottom h-[92.2%] w-full bg-gray-900/40 backdrop-blur-md border border-white/10  overflow-hidden shadow-lg'>
              {currentFile && (
                <Editor
                  height="100%"
                  width="100%"
                  onMount={handleEditorMount}
                  defaultLanguage="javascript"
                  value={currentFile.content}
                  onChange={handleContentUpdate}
                  options={{
                    minimap: { enabled: true },
                    fontSize: 14,
                    wordWrap: "on",
                    automaticLayout: true
                  }}
                />
              )}
            </div>
          </div>
        ) : (
          <div className='flex flex-col bg-[#181818] items-center justify-center w-full h-full text-gray-500'>
            <div className=''><SplitText
              text={
                <>
                  <span className="text-[#433bff]">Use AI Assistant to generate files <br /> and start coding</span>
                </>
              }
              className="pt-16 pb-5 text-2xl md:text-4xl"
              delay={80}
              duration={0.6}
              ease="power3.out"
              splitType="chars"
              from={{ opacity: -6, y: -40 }}
              to={{ opacity: 1, y: 0 }}
              threshold={0.1}
              rootMargin="-100px"
              textAlign="center"
            /></div>
            <div><button onClick={() => navigate("#")} className='bg-[#433bff] text-white flex justify-center gap-1 p-3 px-7 rounded-md delay-200'>See how it works</button>
            </div>
            <div className='mt-4 flex justify-center items-center'><img width='80%' src={chatBotImage}></img></div>
          </div>
        )}
      </section>

      {/* Modal for user selection */}
      {
        isModalOpen && (
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
                className="mt-4 bg-[#433bff] text-white px-4 py-2 rounded-lg font-semibold disabled:opacity-50"
                onClick={handleAddCollaborators}
                disabled={selectedUserIds.length === 0}
              >
                Add Collaborators
              </button>
              <p className='flex justify-center item-center text-sm text-[#433bff] pt-2'>Total selected : {selectedUserIds.length}</p>
            </div>
          </div>
        )
      }
    </main>
  )
}

const TypingIndicator = () => {
  return (
    <div className="flex items-center justify-center gap-1">
      <span className="w-2 h-2 bg-black rounded-full animate-bounce [animation-delay:-0.38s]"></span>
      <span className="w-2 h-2 bg-black rounded-full animate-bounce [animation-delay:-0.20s]"></span>
      <span className="w-2 h-2 bg-black rounded-full animate-bounce"></span>
    </div>
  );
};


export default Project
