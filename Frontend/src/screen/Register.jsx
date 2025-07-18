import React, { useState, useContext, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "../config/axios";
import { UserContext } from "../context/user-context";

const Register = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [fullName, setFullName] = useState("");

    const { setUser } = useContext(UserContext);

    const navigate = useNavigate();

    // useEffect(() => {
    //     if (localStorage.getItem("token")) {
    //         navigate("/dashboard");
    //     }
    //     else{
    //         navigate("/register");
    //     }
    // })



    function submitHandler(e) {
        e.preventDefault();
        axios.post("/users/register", {fullName, email, password })
            .then((response) => {
                console.log("Registration successful:", response.data);
                localStorage.setItem("token", response.data.token);
                setUser(response.data.user);
                navigate("/dashboard");
            })
            .catch((error) => {
                console.log(error.response)
            });
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-900">
            <div className="w-full max-w-md bg-gray-800 rounded-lg shadow-lg p-8">
                <h2 className="text-3xl font-bold text-white mb-6 text-center">Register</h2>
                <form onSubmit={submitHandler} className="space-y-5">
                    <div>
                        <label className="block text-gray-300 mb-2" htmlFor="email">
                            Full Name
                        </label>
                        <input
                            className="w-full px-4 py-2 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                            type="text"
                            id="fullName"
                            name="fullName"
                            onChange={(e) => setFullName(e.target.value)}
                            autoComplete="fullName"
                            placeholder="Enter your full name"
                        />
                    </div>
                    <div>
                        <label className="block text-gray-300 mb-2" htmlFor="email">
                            Email
                        </label>
                        <input
                            className="w-full px-4 py-2 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                            type="email"
                            id="email"
                            name="email"
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            autoComplete="email"
                            placeholder="Enter your email"
                        />
                    </div>
                    <div>
                        <label className="block text-gray-300 mb-2" htmlFor="password">
                            Password
                        </label>
                        <input
                            className="w-full px-4 py-2 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                            type="password"
                            id="password"
                            name="password"
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            autoComplete="current-password"
                            placeholder="Enter your password"
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded transition"
                    >
                        Register
                    </button>
                </form>
                <p className="mt-6 text-center text-gray-400">
                    Already have an account?{" "}
                    <Link to="/login" className="text-blue-400 hover:underline">
                        Login
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default Register;
