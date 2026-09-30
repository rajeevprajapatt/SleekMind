import React from 'react'
import { useNavigate, Link } from 'react-router-dom'

const Footer = () => {

    return (
        <footer className="bg-white/80 border border-slate-200 rounded-t-lg shadow-sm m-4 mt-10">
            <div className="w-full max-w-7xl mx-auto p-4 md:py-8">
                <div className="sm:flex sm:items-center sm:justify-between">
                    <Link
                        to="/"
                        className="flex items-center mb-4 sm:mb-0 space-x-3 rtl:space-x-reverse"
                    >
                        <span className="self-center text-3xl font-semibold whitespace-nowrap text-slate-900">
                            Sleek Mind
                        </span>
                    </Link>
                    <ul className="flex flex-wrap items-center mb-6 text-sm font-medium text-slate-700 sm:mb-0 ">
                        <li>
                            <a href="#" className="hover:underline me-4 md:me-6">
                                About
                            </a>
                        </li>
                        <li>
                            <a href="#" className="hover:underline me-4 md:me-6">
                                Privacy Policy
                            </a>
                        </li>
                        <li>
                            <a href="#" className="hover:underline me-4 md:me-6">
                                Licensing
                            </a>
                        </li>
                        <li>
                            <a href="#" className="hover:underline">
                                Contact
                            </a>
                        </li>
                    </ul>
                </div>
                <hr className="my-6 border-gray-200 sm:mx-auto lg:my-8" />
                <span className="block text-sm text-slate-700 sm:text-center">
                    © 2025{" "}
                    <Link to="/" className="hover:underline">
                        Sleek Mind
                    </Link>
                    . Developed by <Link to="https://www.linkedin.com/in/rajeev-prajapat/" className='hover:underline'>Rajeev Prajapat</Link>
                </span>
            </div>
        </footer>
    )
}

export default Footer
