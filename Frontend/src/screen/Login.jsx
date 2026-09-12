import React, { useState, useContext, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "../config/axios"
import { UserContext } from '../context/user-context';
import { useForm } from 'react-hook-form'


const Login = () => {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const { setUser } = useContext(UserContext);
    const navigate = useNavigate();
    const [errorMessage, setErrorMessage] = useState("");

    if (localStorage.getItem("token")) {
        navigate("/");
    }

    const submitHandler = async (data) => {
        // console.log(typeof(data.password));
        try {
            const response = await axios.post("/users/login", {
                email: data.email,
                password: data.password
            })

            localStorage.setItem("token", response.data.token);
            localStorage.setItem("user", JSON.stringify(response.data.user));
            setUser(response.data.user);

            window.location.href = "/dashboard";
        } catch (error) {
            if (error.response?.data?.error) {
                console.log("Wrong email or password");
                setErrorMessage("Wrong email or password");
            } else {
                console.log("An error occurred. Please try again.");
                setErrorMessage("An error occurred. Please try again.");
            }
        }
    }
    return (
        <div className="min-h-screen flex items-center justify-center px-4">
            <div className="w-full max-w-md backdrop-blur-md bg-white/80 border border-slate-200 rounded-lg shadow-lg p-8">
                <h2 className="text-3xl font-bold text-[#433bff] mb-6 text-center">Login</h2>
                <form onSubmit={handleSubmit(submitHandler)} className="space-y-5">
                    <div>
                        <label className="block text-slate-700 mb-2" htmlFor="email">
                            Email
                        </label>
                        <input
                            className="w-full px-4 py-2 rounded border border-slate-200 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            type="email"
                            id="email"
                            placeholder="Enter your email"
                            {...register("email", {
                                required: "email is required",
                                pattern: {
                                    value: /^\S+@\S+$/i,
                                    message: "Invalid email address"
                                }
                            })}
                        />
                        {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
                    </div>
                    <div>
                        <label className="block text-slate-700 mb-2" htmlFor="password">
                            Password
                        </label>
                        <input
                            className={`w-full px-4 py-2 rounded border border-slate-200 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.password ? 'border border-red-500' : ''}`}
                            type="password"
                            id="password"
                            placeholder="Enter your password"
                            {...register("password", {
                                required: "password is required",
                            })}
                        />
                        {errorMessage && <div className="text-red-500 text-sm mt-1">{errorMessage}</div>}
                    </div>
                    <button
                        type="submit"
                        className="w-full py-2 bg-[#433bff] hover:bg-blue-700 text-white font-semibold rounded transition"
                    >
                        Login
                    </button>
                </form>
                <p className="mt-6 text-center text-slate-600">
                    Don't have an account?{" "}
                    <Link to="/register" className="text-blue-600 hover:underline">
                        Register
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default Login;
