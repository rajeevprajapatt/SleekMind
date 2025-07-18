import React, { useEffect, useState } from 'react'

const Navbar = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        if (localStorage.getItem("token")) {
            setIsLoggedIn(true);
        }
        else {
            setIsLoggedIn(false);
        }
    })

    return (
        <div className="bg-black/50 backdrop-blur-md text-white p-4 w-[98%] mx-auto rounded-xl shadow-md flex justify-between text-center items-center">
            <div>
                <h1 className="text-4xl font-bold px-8">Sleek Mind</h1>
            </div>
            <div className='flex items-center gap-4'>
                {isLoggedIn ? <button className='bg-red-600 flex justify-center gap-1 text-lg p-2 px-4 rounded-md'>Log Out</button> :
                    <button className='bg-blue-200 flex justify-center gap-1 text-lg p-2 px-4 rounded-md'> <i className="ri-user-line"></i>Login</button>
                }
            </div>
        </div>
    )
}

export default Navbar
