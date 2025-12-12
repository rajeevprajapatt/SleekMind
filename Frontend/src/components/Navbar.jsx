import React, { useEffect, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom';
import axios from '../config/axios';
import { Menu, X } from "lucide-react"

const Navbar = () => {
    const navigate = useNavigate();
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        if (localStorage.getItem("token")) {
            setIsLoggedIn(true);
        }
        else {
            setIsLoggedIn(false);
        }
    }, [])

    const handleLogOut = () => {
        axios.get("/users/logout").then(response => console.log(response.data.message)).catch(error => console.log(error));
        localStorage.removeItem("token")
        localStorage.removeItem("user")
        setIsLoggedIn(false)
        navigate("/")
        window.location.reload();
    }
    // bg-white/20 backdrop-blur-sm text-slate-900 p-2 w-full border-black flex justify-between
    //                          text-center items-center fixed top-0 border-b z-50
    return (
        <div className="flex justify-between items-center fixed top-0 w-full bg-white/20 backdrop-blur-sm text-slate-900 p-2 border-b z-50">
            <div className='flex justify-center items-center'>
                <h1 className="text-xl md:text-3xl font-bold text-[#2f27ce] pl-1 md:pl-4 pr-4"><Link to="/">Sleek Mind</Link></h1>
                <ul className="flex gap-4 opacity-70 text-md font-semibold md:flex hidden">
                    <li className=""><Link to="/dashboard">Projects</Link></li>
                </ul>
            </div>
            <div className='flex items-center gap-2'>
                {isLoggedIn ?
                    <div className='flex items-center gap-3 md:gap-6 text-sm md:text-md  font-semibold mr-3'>
                        <button onClick={handleLogOut} className='bg-black text-white flex justify-center gap-1 text-md md:p-2 md:px-3 p-1 px-2 rounded-md'>Log Out</button>
                    </div> :
                    <div className='flex items-center gap-3 md:gap-6 text-sm md:text-md font-semibold md:mr-3'>
                        <p className='text-slate-900 opacity-70 md:flex hidden'><Link to="/login">Log In</Link></p>
                        <button onClick={() => navigate("/register")} className='bg-black text-white flex justify-center gap-1 md:p-2 md:px-3 p-1 px-2 rounded-sm'>Get Started</button>
                    </div>
                }
                <button className="md:hidden z-50" onClick={() => setIsOpen(!isOpen)}>
                    {isOpen ? <X size={28} /> : <Menu size={28} />}
                </button>

            </div>
            <div
                id="mobile-menu"
                className={`md:hidden fixed top-0 right-0 h-screen w-2/4 bg-white backdrop-blur-xl border-l border-slate-700 z-50 flex flex-col 
                ${isOpen ? "translate-x-0 pointer-events-auto opacity-100" : "translate-x-full pointer-events-none opacity-0"} transform transition-transform duration-300 ease-in-out
          `}
            >
                <button className="self-end text-slate-300 hover:text-[#FAC918] px-3 py-2" onClick={() => setIsOpen(!isOpen)}>
                    {isOpen ? <X className='black' size={28} /> : <Menu size={28} />}
                </button>
                <div className='border-t w-full'></div>
                <ul className="flex flex-col pt-3 gap-4 ml-4 text-lg font-semibold items-center justify-center">
                    <li className=""><Link to="/projects">Projects</Link></li>
                    {isLoggedIn ?
                        <li className="" onClick={handleLogOut}>Log Out</li> :
                        <li className=""><Link to="/login">Log In</Link></li>
                    }
                </ul>
            </div>
        </div>
    )
}

export default Navbar
