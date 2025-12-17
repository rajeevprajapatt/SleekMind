import React from "react";
import bgImage from "../assets/BG_Image.jpg";
import Conversation from "../assets/conversation.gif";
import defaultAvatar from "../assets/defaultAvatar.jpg";
import chatBotImage from "../assets/Chat bot.gif";
import { X, Menu } from 'lucide-react'

export default function StaticChatPage() {
    return (
        <main
            className="h-[100dvh] w-screen flex flex-col md:flex-row bg-cover bg-center overflow-hidden"
            style={{ backgroundImage: `url(${bgImage})` }}
        >
            {/* ================= LEFT ================= */}
            <section className="left hidden relative md:flex flex-col flex h-full min-w-full md:min-w-96 mr-0 md:mr-2">
                <header className="flex justify-between items-center rounded-tr-xl shadow-md p-2 px-4 w-full bg-[#433bff] text-white backdrop-blur-2xl border-b-2 border-[#433bff]">
                    <button className="flex gap-1">
                        <i className="ri-user-add-line mr-1"></i>
                        <p>Add Collaborator</p>
                    </button>
                    <button className="p-2 flex justify-center items-center gap-2">
                        <i className="ri-group-line"></i>
                        <Menu className="md:hidden" size={20} />
                    </button>
                </header>

                <div className="conversation-area flex flex-col flex-grow relative overflow-hidden backdrop-blur-sm">
                    <div className="message-box flex flex-col gap-1 overflow-y-auto px-2 py-2 flex-grow rounded-br-xl border-r-2 border-[#433bff]">

                        {/* EMPTY STATE */}
                        <div className="flex flex-col justify-center items-center h-full">
                            <p className="text-center text-xl text-gray-500">
                                Start conversation now with <br /> your team & AI
                            </p>
                            <img src={Conversation} width="300" />
                            <p className="text-center text-sm text-gray-500">
                                Type a message with @ai to chat with AI assistant
                            </p>
                        </div>

                        {/* MESSAGE – USER */}
                        <div className="message flex flex-col p-2 w-fit rounded-md m-1 break-words text-sm ml-auto max-w-80 bg-[#433bff] text-white">
                            <small className="opacity-65 text-xs mb-1 ml-auto">
                                Rajeev
                            </small>
                            <p className="ml-auto">Hello team 👋</p>
                        </div>

                        {/* MESSAGE – OTHER */}
                        <div className="message flex flex-col p-2 w-fit rounded-md m-1 break-words text-sm max-w-80 bg-[#DBDBDB] text-black">
                            <small className="opacity-65 text-xs mb-1">
                                Amit
                            </small>
                            <p>Let’s start 🚀</p>
                        </div>

                        {/* MESSAGE – AI */}
                        <div className="message flex flex-col p-2 w-fit rounded-md m-1 break-words text-sm max-w-80 bg-[#dedcff]/50 backdrop-blur-sm text-black">
                            <small className="opacity-65 text-xs mb-1">
                                AI Assistant
                            </small>
                            <p>I can generate files for you.</p>
                        </div>

                    </div>

                    {/* INPUT */}
                    <div className="inputField w-full flex p-2 border-2 border-[#433bff] rounded-br-xl backdrop-blur-sm">
                        <input
                            className="w-full p-3 px-4 border-none outline-none rounded-l-md bg-[#E5EBEE]"
                            placeholder="Type your message here..."
                        />
                        <button className="flex-grow px-3 bg-[#E5EBEE] rounded-r-md hover:bg-gray-200 transition-colors">
                            <i className="ri-send-plane-2-fill text-xl"></i>
                        </button>
                    </div>
                </div>

                {/* SIDE PANEL (STATIC OPEN) */}
                <div className="hidden sidePanel w-full h-full flex flex-col gap-2 bg-transparent rounded-tr-xl backdrop-blur-md absolute top-0">
                    <header className="flex justify-end p-2 px-4 bg-[#433bff] rounded-tr-xl text-white">
                        <button className="p-2">
                            <i className="ri-close-line text-xl"></i>
                        </button>
                    </header>

                    <div className="users flex flex-col gap-1 p-2">
                        <div className="user flex items-center gap-3 bg-white/80 border border-slate-400 rounded-lg px-2 py-1 mb-1 shadow-sm">
                            <div className="w-12 h-12 rounded-full overflow-hidden bg-slate-800">
                                <img src={defaultAvatar} className="w-full h-full object-cover" />
                            </div>
                            <div className="flex flex-col">
                                <span className="font-medium text-gray-800 text-sm">
                                    Rajeev Prajapat
                                </span>
                                <span className="text-xs text-gray-500">
                                    rajeev@gmail.com
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ================= RIGHT ================= */}
            <section className="right md:flex flex flex-row flex-grow h-full overflow-hidden">

                {/* EXPLORER */}
                <div className="explorer h-full w-[1/3] md:w-48 min-w-[10rem] shrink-0 bg-[#181818] overflow-y-auto border border-white/10">
                    <div className="folder h-[7.8%] md:p-4 p-3 sticky top-0 flex items-center text-md bg-[#181818] border-b border-white/10 text-white font-semibold">
                        Files
                    </div>

                    <div className="folder flex flex-col  bg-[#181818] border-b border-white/10">
                        <div className="w-full p-2 px-4 text-white flex justify-between items-center">
                            <p className="text-sm font-medium">
                                <i className="ri-folder-5-line"></i> frontend
                            </p>
                            <i className="ri-download-2-line"></i>
                        </div>

                        <div className="tree-element p-1.5 px-9 text-white hover:bg-[#37373d]">
                            App.jsx
                        </div>
                        <div className="tree-element p-1.5 px-9 text-white hover:bg-[#37373d]">
                            main.jsx
                        </div>
                    </div>
                </div>

                {/* EMPTY EDITOR STATE */}
                <div className="flex flex-col bg-[#1E1E1E] w-full h-full text-gray-500 overflow-y-auto">
                    <div className="flex h-[7.9%] items-center bg-[#181818] w-full border-b border-white/10 mb-10"></div>

                    <span className="text-[#433bff] md:text-3xl text-2xl text-center mb-5">
                        Use AI Assistant to generate files <br /> and start coding
                    </span>

                    <button className="bg-[#433bff] text-white md:p-4 md:px-7 p-2 px-4 rounded-md">
                        See how it works
                    </button>

                    <div className="mt-4 flex justify-center items-center">
                        <img width="80%" src={chatBotImage} />
                    </div>
                </div>
            </section>
        </main>
    );
}
