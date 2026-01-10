import React, { useEffect, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom';
import axios from '../config/axios';
import { Menu, X } from "lucide-react"
import logo from '../assets/Logo Image.png'
import Marquee from "react-fast-marquee";
import AvatarImage from '../assets/defaultAvatar.jpg';

const leftNavItems = [
    { title: "Features", link: "/", },
    { title: "Solutions", link: "/" },

];
const rightNavItems = [
    { title: "Pricing", link: "/" },
    { title: "Projects", link: "/" },
    { title: "Login", link: "/login" },
];
const marqueeTexts = [
    "🚀 Sleek Mind — Where ideas turn into production-ready code in seconds.",
    "🧠⚡ Build faster, think smarter. Let Sleek Mind’s AI generate, organize, and refine your code.",
    "💻✨ From prompt to project — Sleek Mind helps you design, write, and manage code effortlessly."
];

const Navbar = () => {
    const navigate = useNavigate();
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(true);

    useEffect(() => {
        const onScroll = () => {
            if (window.scrollY > 20) {
                setScrolled(false);   // hide on minor scroll
            } else {
                setScrolled(true);    // show when back to top
            }
        };

        window.addEventListener("scroll", onScroll);
        return () => window.removeEventListener("scroll", onScroll);
    }, []);


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
        <>
            {
                window.scrollY < 20 &&
                <Marquee
                    className={`bg-black/30 backdrop-blur-xl text-white transition-all duration-1000 ease-in-out top-1`}
                    speed={30}
                    gradient={false}
                    pauseOnHover={true}
                    pauseOnClick={false}
                    direction="left"
                    loop={0}
                >
                {marqueeTexts.map((text, index) => (
                    <span key={index} className='mx-12'>{text}</span>
                ))}
                </Marquee>
            }
            <div className={`fixed w-full bg-black/20 backdrop-blur-xl text-white z-50 transition-all duration-300 ease-out ${scrolled ? "top-8" : "top-2"}`}>
                <div className="flex items-center w-full gap-3 md:gap-6 px-4 md:px-8 py-2">
                    {/* LEFT */}
                    <div className="hidden flex-1 md:flex justify-end items-center">
                        <ul className="hidden md:flex gap-8 mr-6 text-md opacity-90">
                            {leftNavItems.map((item, index) => (
                                <li key={index} className=""><Link to={item.link}>{item.title}</Link></li>
                            ))}
                        </ul>
                    </div>
                    {/* CENTER */}
                    <div className="flex justify-center">
                        <h1 className="text-3xl md:text-4xl text-primary whitespace-nowrap font-geom font-bold">
                            <Link to="/">Sleek Mind</Link>
                        </h1>
                    </div>
                    {/* RIGHT */}
                    <div className="flex-1 flex md:justify-start justify-end items-center">
                        <ul className="hidden md:flex gap-8 ml-6 text-md opacity-90">
                            {rightNavItems.map((item, index) => {
                                if (item.title === "Login" && isLoggedIn) return null;
                                if (item.title === "Projects" && !isLoggedIn) return null;
                                return (
                                    <li key={index} className=""><Link to={item.link}>{item.title}</Link></li>
                                )
                            })}
                        </ul>
                        {isLoggedIn && <img src={AvatarImage} alt="User Avatar" className="w-8 h-8 rounded-full object-cover md:ml-6 hidden md:flex" />}
                        {!isLoggedIn && <button className="bg-black md:flex ml-8 hidden text-white px-3 py-2 rounded-sm" >
                            Get Started
                        </button>}

                        <button className="md:hidden bg-black/20 backdrop-blur-2xl border-2 border-[#433bff]/60 p-2 rounded-full" onClick={() => setIsOpen(!isOpen)}>
                            <Menu size={22} />
                        </button>
                    </div>
                </div>
            </div>

            <div className={`md:hidden fixed top-0 right-0 h-screen w-64 bg-black/20 backdrop-blur-lg border-l border-slate-700 z-50 flex flex-col transform transition-transform duration-300 ease-in-out ${isOpen ? "translate-x-0" : "translate-x-full"}`}>
                <button className={`self-end mt-10 mr-4 border-2 border-[#433bff]/60 p-2 rounded-full text-white  ${scrolled ? "top-8" : "top-2"}`} onClick={() => setIsOpen(false)}>
                    <X size={22} />
                </button>
                <ul className="flex flex-col gap-2 mt-8 px-6 text-lg font-semibold text-white">
                {isLoggedIn && <li className='w-full text-left hover:bg-white/10 p-2 rounded'><Link to="/profile" onClick={() => setIsOpen(false)}>Profile</Link></li>}
                    {leftNavItems.map((item, index) => (
                        <li key={index} className='w-full text-left hover:bg-white/10 p-2 rounded'><Link to={item.link} onClick={() => setIsOpen(false)}>{item.title}</Link></li>
                    ))}
                    {rightNavItems.map((item, index) => {
                        if (item.title === "Login" && isLoggedIn) return null;
                        if (item.title === "Projects" && !isLoggedIn) return null;
                        return (
                            <li key={index} className='w-full text-left hover:bg-white/10 p-2 rounded'><Link to={item.link} onClick={() => setIsOpen(false)}>{item.title}</Link></li>
                        )
                    })}
                    {isLoggedIn && <li className='w-full text-left hover:bg-white/10 p-2 rounded'><button onClick={handleLogOut} className="text-red-500">Logout</button></li>}
                </ul>
            </div>
        </>
    )
}

export default Navbar
