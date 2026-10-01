import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";


import axios from "../config/axios";
import { UserContext } from "../context/user-context";
import { Sparkles, Mail, Lock, User, ArrowRight } from 'lucide-react';
import { Button, Card, Input, Label, GoogleIcon, GithubIcon } from '../components/UIcomponents'
import logo from '../assets/urlLogo.png'



const Register = () => {
    const { setUser } = useContext(UserContext);
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);

    if(localStorage.getItem("token")) {
        navigate("/");
    }

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();

    const onSubmit = async (data) => {
        try {
            const response = await axios.post("/users/register", {
                fullName: data.name,
                email: data.email,
                password: data.password,
            });

            
            localStorage.setItem("token", response.data.token);
            localStorage.setItem("user", JSON.stringify(response.data.user));
            setUser(response.data.user);

            window.location.href = "/dashboard";
        } catch (error) {
            console.log(error.response?.data || "Registration failed");
        }
    };

      return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 relative overflow-hidden font-sans selection:bg-blue-200">

            {/* Background Gradient */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,var(--tw-gradient-stops))] from-blue-100 via-slate-50 to-slate-50 -z-10" />

            <div className="w-full max-w-[400px]">
                {/* Logo Area */}
                <div className="flex flex-col items-center mb-8 text-center">
                    <div className="w-12 h-12 rounded-xl bg-white border border-slate-200 flex items-center justify-center shadow-sm mb-4">
                        <img src={logo} alt="Logo" className="h-6 w-6" />
                    </div>
                    <h1 className="text-2xl font-bold tracking-tight text-slate-900">Create an account</h1>
                    <p className="text-sm text-slate-600 mt-1">
                        Start colleborating with your team today.
                    </p>
                </div>

                {/* Sign Up Card */}
                <Card className="p-6 sm:p-8">
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">

                        {/* Full Name Field */}
                        <div className="space-y-2">
                            <Label htmlFor="name">Full Name</Label>
                            <div className="relative">
                                <User className="absolute left-3 top-2.5 h-5 w-5 text-slate-400" />
                                <Input
                                    id="name"
                                    type="text"
                                    placeholder="John Doe"
                                    className="pl-10"
                                    {...register("name", { required: true })}
                                    required
                                />
                            </div>
                        </div>

                        {/* Email Field */}
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-2.5 h-5 w-5 text-slate-400" />
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="name@company.com"
                                    className="pl-10"
                                    {...register("email", { required: true })}
                                    required
                                />
                            </div>
                        </div>

                        {/* Password Field */}
                        <div className="space-y-2">
                            <Label htmlFor="password">Password</Label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-2.5 h-5 w-5 text-slate-400" />
                                <Input
                                    id="password"
                                    type="password"
                                    placeholder="••••••••"
                                    className="pl-10"
                                    required
                                    {...register("password", { required: true, minLength: 8 })}
                                    minLength={8}
                                />
                            </div>
                            <p className="text-xs text-slate-500">Must be at least 8 characters long.</p>
                        </div>

                        {/* Submit Button */}
                        <Button type="submit" disabled={isLoading} className="mt-2 bg-blue-600 hover:bg-blue-700 text-white">
                            {isLoading ? (
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                            ) : (
                                <>
                                    Create Account <ArrowRight className="w-4 h-4 ml-2" />
                                </>
                            )}
                        </Button>
                    </form>

                    {/* Divider */}
                    <div className="relative my-6">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-slate-200"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="bg-white px-2 text-slate-500">Or register with</span>
                        </div>
                    </div>

                    {/* Social Logins */}
                    <div className="grid grid-cols-2 gap-3">
                        <Button variant="outline" type="button">
                            <GithubIcon className="w-4 h-4 mr-2" />
                            GitHub
                        </Button>
                        <Button variant="outline" type="button">
                            <GoogleIcon className="w-4 h-4 mr-2" />
                            Google
                        </Button>
                    </div>
                </Card>

                {/* Footer Link */}
                <p className="text-center text-sm text-slate-600 mt-6">
                    Already have an account?{' '}
                    <Link to="/login" className="font-semibold text-blue-600 hover:text-blue-500 transition-colors" replace>
                        Sign in
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default Register;

