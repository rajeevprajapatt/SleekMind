import React, { useEffect, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom';
import axios from '../config/axios';

const Navbar = () => {
    const navigate = useNavigate();
    const [isLoggedIn, setIsLoggedIn] = useState(false);

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

    return (
        <div className="bg-white/20 backdrop-blur-sm text-slate-900 p-2 w-full border-black flex justify-between
                         text-center items-center fixed top-0 border-b z-50">
            <div className='flex justify-center items-center'>
                <h1 className="text-3xl font-bold pl-16 pr-10 text-[#2f27ce]"><Link to="/">Sleek Mind</Link></h1>
                <ul className="flex gap-4 opacity-70 text-md font-semibold">
                    <li className=""><Link to="/projects">Projects</Link></li>
                </ul>
            </div>
            <div className='flex items-center gap-4'>
                {isLoggedIn ?
                    <div className='flex items-center gap-6 text-md font-semibold mr-12'>
                        <button onClick={handleLogOut} className='bg-black text-white flex justify-center gap-1 text-md p-2 px-3 rounded-md'>Log Out</button>
                    </div> :
                    <div className='flex items-center gap-6 text-md font-semibold mr-12'>
                        <p className='text-slate-900 opacity-70'><Link to="/login">Log In</Link></p>
                        <button onClick={() => navigate("/register")} className='bg-black text-white flex justify-center gap-1 p-2 px-3 rounded-sm'>Get Started</button>
                    </div>
                }
            </div>
        </div>
    )
}

export default Navbar
