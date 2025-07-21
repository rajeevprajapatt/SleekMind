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
    }

    return (
        <div className="bg-black/50 backdrop-blur-md text-white p-4 w-[98%] mx-auto rounded-xl shadow-md flex justify-between text-center items-center">
            <div className='flex justify-center items-center'>
                <h1 className="text-4xl font-bold px-8"><Link to="/">Sleek Mind</Link></h1>
                <h1 className="text-xl font-bold px-8"><Link to="/dashboard">Dashboard</Link></h1>
            </div>
            <div className='flex items-center gap-4'>
                {isLoggedIn ? <button onClick={handleLogOut} className='bg-red-600 flex justify-center gap-1 text-lg p-2 px-4 rounded-md'>Log Out</button> :
                    <button onClick={() => navigate("/login")} className='bg-blue-200 flex justify-center gap-1 text-lg p-2 px-4 rounded-md'> <i className="ri-user-line"></i>Login</button>
                }
            </div>
        </div>
    )
}

export default Navbar
