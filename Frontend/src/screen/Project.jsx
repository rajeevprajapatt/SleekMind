import React, { useEffect, useState, useContext } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import defaultAvatar from '../assets/defaultAvatar.jpg';
import axios from '../config/axios';
import { initializeSocket } from '../config/socket';
import { UserContext } from '../context/user-context'
import { useRef } from 'react';
import chatBotImage from '../assets/Chat bot.png';
import SplitText from '../animations/SplitText';
import Conversation from '../assets/ChatConversation.png';
import bgImage from '../assets/5072612.jpg'
import Editor from "@monaco-editor/react";
import { X, Menu } from 'lucide-react'
import { Link } from 'react-router-dom'

const rightSideBarItems = [
  {
    icon: "ri-user-add-line", label: "Add Collaborator", action: "isModalOpen", isMd: true
  },
  {
    icon: "ri-group-line", label: "Project Users", action: "isSidePanelOpen", isMd: true
  },
  {
    icon: "ri-file-ai-line", label: "AI Files", action: "messageScreen", isMd: false
  },
  {
    icon: "ri-information-2-line", label: "Project Info", action: "projectInfoScreen", isMd: true
  }
]
const avatarUrl = "https://i.pravatar.cc/150?img=68";

const Project = () => {
  const location = useLocation();
  const navigate = useNavigate();
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
  const [isRightSidebarOpen, setIsRightSidebarOpen] = useState(false);
  const [project] = useState(location.state.project);
  const [AiGeneratedFiles, setAiGeneratedFiles] = useState([]);
  const [currentFile, setCurrentFile] = useState({});
  const [tempSelectedFile, setTempSelectedFile] = useState([]);
  const [aiLoading, setAiLoading] = useState(false);
  const [messageScreen, setMessageScreen] = useState(true);
  const [projectInfoScreen, setProjectInfoScreen] = useState(false);
  const userId = JSON.parse(localStorage.getItem("user"))?._id;
  const [deleteConfirmation, setDeleteConfirmation] = useState(false);

  function handleDeleteProject() {
    axios.delete(`/projects/deleteProject/${location.state.project._id}`).then(() => {
      navigate("/dashboard");
    }).catch(console.log);
  }

  //Initialize socket & Fetch messages                      
  useEffect(() => {
    const socket = initializeSocket(project._id);
    socketRef.current = socket;

    socket.on("connect", () => {
      // console.log("Socket connected!", socket.id);
    });

    axios.get(`/chats/${location.state.project._id}`)
      .then(response => {
        setMessages(response.data)
        setAiGeneratedFiles(response.data
          .filter(msg => msg.message.hasOwnProperty("fileTree")))
      })
      .catch(error =>
        console.log(error)
      )

    //Receive message
    socket.on("project-message", newMessage => {
      if (!newMessage) return;

      setMessages(prev => {
        const updated = [...prev, newMessage];

        // If incoming message contains generated files, append to AiGeneratedFiles
        if (newMessage?.message && Object.prototype.hasOwnProperty.call(newMessage.message, 'fileTree')) {
          setAiGeneratedFiles(prevFiles => {
            // avoid duplicates
            if (prevFiles.some(f => f._id === newMessage._id)) return prevFiles;
            return [...prevFiles, newMessage];
          });
        }

        return updated;
      });

      const isAI = String(newMessage.sender._id) === "000000000000000000000001";

      if (isAI) {
        setAiLoading(false); // ✅ stop ONLY when AI replies
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

  const handleSendMessage = () => {
    if (!socketRef.current) return;
    if (!message.trim()) return;

    if (message.includes("@ai")) {
      setTimeout(() => {
        setAiLoading(true);
      }, 1000); // show loading after 1.5 sec of sending message
      setTimeout(() => {
        setAiLoading(false);
      }, 20000); // 20 sec fallback
    }

    socketRef.current.emit("project-message", {
      message,
      sender: user._id,
      projectId: project._id
    });
    setMessage("");
  }

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
    <main className={`h-dvh w-screen flex flex-col md:flex-row bg-cover bg-center overflow-hidden`} style={{ backgroundImage: `url(${bgImage})` }}>
      <section className={`left relative md:flex flex-col flex h-full min-w-full md:min-w-96 mr-0 md:mr-2 ${messageScreen ? 'flex' : 'hidden'}`}>
        <header className='flex justify-between items-center md:rounded-tr-xl shadow-md p-2 px-4 w-full bg-[#433bff] text-white backdrop-blur-2xl border-b-2 border-[#433bff]'>
          <h1 className="text-3xl md:text-4xl text-logoColor whitespace-nowrap font-geom font-bold">
            <Link to="/">Sleek Mind</Link>
          </h1>
          <div className='p-2 flex justify-center items-center gap-2'>
            <button className='cursor-pointer' onClick={() => setIsRightSidebarOpen(!isRightSidebarOpen)}>
              <Menu className="" size={20} />
            </button>
          </div>
        </header>
        <div className="conversation-area flex flex-col grow relative overflow-hidden backdrop-blur-sm" >
          <div ref={messageBox}
            className={`message-box flex flex-col ${messages.length > 0 ? "" : "justify-center"} gap-1 overflow-y-auto px-2 py-2 h-full pb-20 rounded-br-xl border-r-2 border-[#433bff]`}>
            {messages.length === 0 &&
              <div className='flex flex-col justify-center items-center w-full'>
                {/* <p className="text-center text-xl text-gray-500">Start conversation now with<br /> your team & AI</p> */}
                <img src={Conversation} width="300"></img>
                {/* <p className='text-center text-sm text-gray-500'>Type a message with @ai to chat with AI assistant</p> */}
              </div>
            }
            {messages.map((msg, index) => {
              const isSender = msg.sender._id === userId;
              const isAI = msg.sender._id === "000000000000000000000001";
              return (
                <div
                  key={index}
                  className={`message flex flex-col p-2 w-fit rounded-md m-1 wrap-break-words text-sm
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

            {aiLoading && (
              <div className="message flex flex-col p-2 w-fit rounded-md m-1 bg-[#dedcff]/50 backdrop-blur-sm text-black">
                <small className="opacity-65 text-xs mb-1">
                  AI Assistant
                </small>
                <div className="flex items-center gap-2">
                  {/* <p className="text-sm">AI is responding</p> */}
                  <div className="flex gap-1">
                    <span className="w-2 h-2 bg-black rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                    <span className="w-2 h-2 bg-black rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                    <span className="w-2 h-2 bg-black rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                  </div>
                </div>
              </div>
            )}

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
                className='grow px-3 bg-[#E5EBEE] rounded-r-md hover:bg-gray-200 transition-colors'
                aria-label="Send message"
              >
                <i className="ri-send-plane-2-fill text-xl"></i>
              </button>
            </div>
          </div>
        </div>
        <div className={`sidePanel w-full h-full flex flex-col gap-2 bg-transparent rounded-tr-xl backdrop-blur-md duration-500 transition-all absolute ${isSidePanelOpen ? 'translate-x-0' : '-translate-x-full'} top-0`}>
          <header className='flex justify-end p-2 px-4 bg-[#433bff] rounded-tr-xl text-white'>
            <button className='p-2' onClick={() => setIsSidePanelOpen(false)}>
              <i className="ri-close-line text-xl" ></i>
            </button>
          </header>
          <div className='users flex flex-col gap-1 p-2'>
            {projectUsers.map((user) => (
              <div key={user._id} className='user flex items-center gap-3 bg-white/80 border border-slate-400 rounded-lg px-2 py-1 mb-1 shadow-sm cursor-pointer hover:shadow-lg hover:translate-x-1 duration-700 hover:transition-all'>
                <div className='w-12 h-12 rounded-full overflow-hidden bg-slate-800 shrink-0'>
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

      <section className={`right md:flex flex-row grow h-full bg-linear-to-b from-[#181818] to-[#1E1E1E] overflow-y-auto ${messageScreen ? 'hidden' : 'flex'}`}>
        <div className={`explorer ${AiGeneratedFiles && AiGeneratedFiles.length === 0 ? "hidden" : ""} h-full bg-linear-to-b from-[#2D3436] to-[#181818] md:min-w-48 max-w-64 min-w-38 overflow-y-auto border rounded-2xl md:rounded-tl-xl md:rounded-bl-xl`}>
          <div className={`folder h-[7.8%] p-4 sticky top-0 z-10 flex items-center justify-between text-md text-white  transition-all duration-500`}>
            <span className='font-semibold'>Files</span>
            <i className="ri-arrow-left-box-line text-lg md:hidden"
              onClick={() => {
                setMessageScreen(true);
              }}>
            </i>
          </div>
          <div className='w-full h-[92.2%] backdrop-blur-sm overflow-y-auto no-scrollbar'>
            {AiGeneratedFiles && AiGeneratedFiles.length > 0 && AiGeneratedFiles.map((aiFile, idx) => (
              <div className='folder flex flex-col border-white/10' key={idx}>
                <div className='w-auto p-2 px-2 md:px-4 mx-1 bg-linear-to-b from-[#212526] to-[#232323] rounded-lg text-white flex justify-between items-center'>
                  <p className='text-sm font-medium capitalize'>
                    {aiFile.message[`folder-name`] || `Folder ${AiGeneratedFiles.indexOf(aiFile) + 1}`}
                  </p>
                  <i className="ri-download-2-line cursor-pointer"></i>
                </div>
                {Object.keys(aiFile).length > 0 && Object.keys(aiFile.message.fileTree).map((fileName, index) => (
                  <div className='file-tree w-full' key={index}>
                    <div className={`tree-element p-1.5 px-6 flex items-center gap-2 w-full cursor-pointer hover:bg-[#37373d] hover:transform hover:translate-x-1 duration-300 overflow-y-auto no-scrollbar ${currentFile.fileName === fileName ? 'px-8 text-blue-400' : 'text-white'}`}
                      onClick={() => {
                        if (fileName === 'buildCommand' || fileName === 'runCommand' || fileName === 'startCommand' || fileName === 'testCommand' || fileName.includes('.txt')) {
                          setCurrentFile({
                            content: JSON.stringify(aiFile.message.fileTree[fileName]),
                            fileId: aiFile._id,
                            fileName: fileName
                          });

                          // add to tempSelectedFile uniquely
                          setTempSelectedFile(prev => {
                            const exists = prev.some(f => f.fileName === fileName);
                            if (exists) return prev;
                            return [...prev, {
                              content: JSON.stringify(aiFile.message.fileTree[fileName]),
                              fileId: aiFile._id,
                              fileName: fileName
                            }];
                          });
                        }
                        else {
                          setCurrentFile({
                            content: aiFile.message.fileTree[fileName].content
                              ? aiFile.message.fileTree[fileName].content
                              : aiFile.message.fileTree[fileName],
                            fileId: aiFile._id,
                            fileName: fileName
                          });

                          // add to tempSelectedFile uniquely
                          setTempSelectedFile(prev => {
                            const exists = prev.some(f => f.fileName === fileName);
                            if (exists) return prev;
                            return [...prev, {
                              content: aiFile.message.fileTree[fileName].content
                                ? aiFile.message.fileTree[fileName].content
                                : aiFile.message.fileTree[fileName],
                              fileId: aiFile._id,
                              fileName: fileName
                            }];
                          });
                        }
                      }}
                    >
                      <p className={`text-sm `}>{fileName}</p>
                    </div>
                  </div>
                ))
                }
              </div>
            ))}
          </div>
        </div>
        {currentFile && Object.keys(currentFile).length > 0 ? (
          <div className='code-editor w-full h-full overflow-hidden bg-white/10'>
            <div className='top flex h-[7.9%] items-center bg-[#181818] text-white text-md overflow-x-scroll no-scrollbar sticky z-10 w-full border-b border-white/10'>
              {tempSelectedFile && tempSelectedFile.length > 0 && tempSelectedFile.map((file, index) => (
                <div className={`file-name flex items-center gap-0 cursor-pointer hover:bg-[#37373d] transition-all duration-500 ${currentFile.fileName === file.fileName ? 'text-blue-400 bg-linear-to-b from-[#212526] to-[#232323] rounded-lg m-1 w-auto' : ''}`} key={index}>
                  <p className={`text-sm cursor-pointer py-3 px-2`} onClick={() => setCurrentFile(file)}>
                    {file.fileName}
                  </p>
                  <i className="ri-close-line mr-1 cursor-pointer hover:text-red-500 transition-all duration-500"
                    onClick={() => {
                      // If the closed file is the current file, reset currentFile
                      if (tempSelectedFile.length < 0) {
                        setCurrentFile({});
                      }
                      else if (currentFile.fileName === file.fileName) {
                        const remainingFiles = tempSelectedFile.filter(f => f.fileName !== file.fileName);
                        setCurrentFile(remainingFiles.length > 0 ? remainingFiles[0] : {});
                      }
                      setTempSelectedFile(prev => prev.filter(f => f.fileName !== file.fileName))
                    }}>
                  </i>
                </div>
              )
              )}
            </div>
            <div className="bottom h-[92.2%] w-full overflow-x-auto overflow-y-auto shadow-lg no-scrollbar">
              {currentFile && (
                <Editor
                  height="100%"
                  width="100%"
                  theme="vscode-dark-modern"
                  onMount={handleEditorMount}
                  defaultLanguage="cpp"
                  value={currentFile.content}
                  onChange={handleContentUpdate}
                  options={{
                    minimap: { enabled: false },
                    fontSize: 14,
                    wordWrap: "off",
                    scrollBeyondLastLine: false,
                    automaticLayout: true
                  }}
                />
              )}
            </div>
          </div>
        ) : (
          <div className='flex flex-col bg-[#1E1E1E] justify-center gap-3 items-center w-full h-full text-gray-500'>
            <div className='mt-12'>
              <SplitText
                className="pb-1 text-2xl md:text-4xl"
                delay={80}
                duration={0.6}
                ease="power3.out"
                splitType="chars"
                from={{ opacity: -6, y: -40 }}
                to={{ opacity: 1, y: 0 }}
                threshold={0.1}
                rootMargin="-100px"
                textAlign="center"
              >
                <span className="text-[#433bff]">Use AI Assistant to generate files <br /> and start coding</span>
              </SplitText>
            </div>
            <div className='mt-0 flex justify-center items-center'><img width='60%' src={chatBotImage}></img></div>
            <div>
              <button onClick={() => navigate("#")} className='bg-[#433bff] text-white flex justify-center gap-1 p-3 px-7 rounded-md delay-200'>See how it works</button>
            </div>
          </div>
        )}
      </section>



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
                    <div className='w-10 h-10 rounded-full overflow-hidden bg-slate-800 shrink-0'>
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
      )}

      {projectInfoScreen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-xl bg-opacity-40">

          {/* Main Modal Card */}
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md mx-2 p-4 flex flex-col">
            {/* Header Section */}
            <div className="flex justify-between">
              <h1 className="text-3xl md:text-4xl leading-tight font-black text-gray-900">
                Project Information
              </h1>
              {/* Close Button */}
              <button onClick={() => setProjectInfoScreen(false)} className="text-gray-500 hover:text-gray-800 cursor-pointer">
                <i className="ri-close-line text-2xl"></i>
              </button>
            </div>
            {/* Content Section */}
            <div className="p-2 pt-2">
              <div className="flex gap-3 items-center mb-3">
                <i className="ri-folder-5-line text-2xl text-gray-500 shrink-0 mt-1" />
                <div>
                  <span className="block text-sm font-medium text-gray-500">
                    Name
                  </span>
                  <h2 className="text-lg leading-tight font-semibold text-gray-900">
                    {project.name}
                  </h2>
                </div>
              </div>

              {/* Item: Description */}
              <div className="flex gap-3 items-start mb-3">
                <i className="ri-align-left text-2xl text-gray-500 shrink-0 mt-1" />

                <div className="min-w-0">
                  <span className="block text-sm font-medium text-gray-500">
                    Description
                  </span>

                  <p className="text-md leading-tight text-gray-900 wrap-break-words">
                    {project.description || "No description provided."}
                  </p>
                </div>
              </div>

              {/* Item: Collaborators (Special styled block) */}
              <div className="flex gap-3 items-center mb-3  p-1 rounded-[28px]">
                <i className="ri-group-line text-2xl text-gray-500 shrink-0 mt-1" />
                <div>
                  <span className="block text-sm font-medium text-gray-500 leading-tight">
                    Collaborators: <span className='text-gray-900'>{projectUsers.length}</span>
                  </span>
                  {/* Avatar */}
                  <div className="flex -space-x-3">
                    {projectUsers.map((user, index) => (
                      <img
                        key={index}
                        src={user.avatar || defaultAvatar}
                        alt={user.fullName || user.email}
                        className="w-8 h-8 rounded-full border-2 border-white"
                      />
                    ))}
                  </div>
                </div>
              </div>

              {/* Item: Created On */}
              <div className="flex gap-3 items-center mb-3">
                <i className="ri-calendar-line text-2xl text-gray-500 shrink-0 mt-1" />
                <div>
                  <span className="block text-sm font-medium text-gray-500">
                    Created On
                  </span>
                  <p className="text-md leading-snug text-gray-900">
                    {new Date(project.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>

              {/* Item: Last Update */}
              <div className="flex gap-3 items-center mb-3">
                <i className="ri-time-line text-2xl text-gray-500 shrink-0 mt-1" />
                <div>
                  <span className="block text-sm font-medium text-gray-500">
                    Last Update
                  </span>
                  <p className="text-md leading-snug text-gray-900">
                    {new Date(project.updatedAt).toLocaleDateString()}
                  </p>
                </div>
              </div>

              <button className="mt-2 ml-8 cursor-pointer bg-[#ff3b3b] text-white px-4 py-2 rounded-lg font-semibold" onClick={() => setDeleteConfirmation(true)}>
                Delete Project
              </button>

            </div>

          </div>
        </div>
      )}

      {deleteConfirmation && (
        <div className="fixed inset-0 z-100 flex items-center justify-center bg-black/30 backdrop-blur-xl bg-opacity-40">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-sm mx-2 p-4 flex flex-col items-center">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Confirm Deletion</h2>
            <p className="text-gray-700 mb-6">Are you sure you want to delete this project? This action cannot be undone.</p>
            <div className="flex gap-4">
              <button className="bg-red-500 text-white px-4 py-2 rounded-lg font-semibold cursor-pointer" onClick={handleDeleteProject}>
                Confirm
              </button>
              <button className="bg-gray-500 text-white px-4 py-2 rounded-lg font-semibold cursor-pointer" onClick={() => setDeleteConfirmation(false)}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Right Sidebar */}
      <div className={`fixed top-0 h-screen w-14 bg-black/20 backdrop-blur-lg border-slate-700 z-50 flex flex-col transition-transform duration-300 ease-in-out right-0
        ${isRightSidebarOpen ? "translate-x-0" : "translate-x-full"} md:left-0 md:right-auto md:-translate-x-full ${isRightSidebarOpen ? "md:translate-x-0" : "md:-translate-x-full"}`}>
        <button className="self-end mt-4 mr-4 text-white hover:text-gray-300 cursor-pointer" onClick={() => setIsRightSidebarOpen(!isRightSidebarOpen)}>
          <X size={22} />
        </button>
        <ul className="flex flex-col items-center justify-center gap-2 mt-8 px-1 text-white">
          {rightSideBarItems.map((item, index) => (
            <li key={index}>
              <button className={`w-full text-lg hover:bg-white/10 p-2 rounded cursor-pointer ${!item.isMd ? "md:hidden" : "md:block"}`} title={item.label} onClick={() => {
                if (item.action === "isModalOpen") {
                  setIsModalOpen(true);
                  setIsRightSidebarOpen(false);
                } else if (item.action === "isSidePanelOpen") {
                  setIsSidePanelOpen(true);
                  setIsRightSidebarOpen(false);
                } else if (item.action === "messageScreen") {
                  if (AiGeneratedFiles && AiGeneratedFiles.length === 0) {
                    return;
                  }
                  setMessageScreen(!messageScreen);
                  setIsRightSidebarOpen(false);
                }
                else if (item.action === "projectInfoScreen") {
                  setProjectInfoScreen(true);
                  setIsRightSidebarOpen(false);
                }
              }}>
                <i className={item.icon}></i>
              </button>
            </li>
          ))}
        </ul>
      </div>

    </main>
  )
}

export default Project

