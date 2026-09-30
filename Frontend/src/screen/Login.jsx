// import React, { useState, useContext, useEffect } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import axios from "../config/axios"
// import { UserContext } from '../context/user-context';
// import { useForm } from 'react-hook-form'


// const Login = () => {
//     const { register, handleSubmit, formState: { errors } } = useForm();
//     const { setUser } = useContext(UserContext);
//     const navigate = useNavigate();
//     const [errorMessage, setErrorMessage] = useState("");

//     if (localStorage.getItem("token")) {
//         navigate("/");
//     }

//     const submitHandler = async (data) => {
//         // console.log(typeof(data.password));
//         try {
//             const response = await axios.post("/users/login", {
//                 email: data.email,
//                 password: data.password
//             })

//             localStorage.setItem("token", response.data.token);
//             localStorage.setItem("user", JSON.stringify(response.data.user));
//             setUser(response.data.user);

//             window.location.href = "/dashboard";
//         } catch (error) {
//             if (error.response?.data?.error) {
//                 console.log("Wrong email or password");
//                 setErrorMessage("Wrong email or password");
//             } else {
//                 console.log("An error occurred. Please try again.");
//                 setErrorMessage("An error occurred. Please try again.");
//             }
//         }
//     }
//     return (
//         <div className="min-h-screen flex items-center justify-center px-4">
//             <div className="w-full max-w-md backdrop-blur-md bg-white/80 border border-slate-200 rounded-lg shadow-lg p-8">
//                 <h2 className="text-3xl font-bold text-[#433bff] mb-6 text-center">Login</h2>
//                 <form onSubmit={handleSubmit(submitHandler)} className="space-y-5">
//                     <div>
//                         <label className="block text-slate-700 mb-2" htmlFor="email">
//                             Email
//                         </label>
//                         <input
//                             className="w-full px-4 py-2 rounded border border-slate-200 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
//                             type="email"
//                             id="email"
//                             placeholder="Enter your email"
//                             {...register("email", {
//                                 required: "email is required",
//                                 pattern: {
//                                     value: /^\S+@\S+$/i,
//                                     message: "Invalid email address"
//                                 }
//                             })}
//                         />
//                         {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
//                     </div>
//                     <div>
//                         <label className="block text-slate-700 mb-2" htmlFor="password">
//                             Password
//                         </label>
//                         <input
//                             className={`w-full px-4 py-2 rounded border border-slate-200 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.password ? 'border border-red-500' : ''}`}
//                             type="password"
//                             id="password"
//                             placeholder="Enter your password"
//                             {...register("password", {
//                                 required: "password is required",
//                             })}
//                         />
//                         {errorMessage && <div className="text-red-500 text-sm mt-1">{errorMessage}</div>}
//                     </div>
//                     <button
//                         type="submit"
//                         className="w-full py-2 bg-[#433bff] hover:bg-blue-700 text-white font-semibold rounded transition"
//                     >
//                         Login
//                     </button>
//                 </form>
//                 <p className="mt-6 text-center text-slate-600">
//                     Don't have an account?{" "}
//                     <Link to="/register" className="text-blue-600 hover:underline">
//                         Register
//                     </Link>
//                 </p>
//             </div>
//         </div>
//     );
// };

// export default Login;


import React, { useState } from 'react';
import { CheckCircle2 } from 'lucide-react';

import LoginComponent from '../components/loginPageComponents/loginComponent'
import SendOtp from '../components/loginPageComponents/SendOtp'
import SubmitOtp from '../components/loginPageComponents/SubmitOtp'
import ResetPassword from '../components/loginPageComponents/ResetPassword'


// --- Main Login Component ---

const Login = () => {
    const [step, setStep] = useState('login');
    const [email, setEmail] = useState('');

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 relative overflow-hidden font-sans selection:bg-blue-200">

            {/* Background Gradient (matches landing page hero) */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,var(--tw-gradient-stops))] from-blue-100 via-slate-50 to-slate-50 -z-10" />

            <div className="w-full max-w-100">
                {step === 'login' && <LoginComponent onForgotPassword={() => setStep('email')} />}
                {step === 'email' && (
                    <SendOtp
                        onSubmit={({ email: submittedEmail }) => {
                            setEmail(submittedEmail);
                            setStep('otp');
                        }}
                        onBack={() => setStep('login')}
                    />
                )}
                {step === 'otp' && (
                    <SubmitOtp
                        email={email}
                        onSubmit={() => setStep('reset')}
                        onBack={() => setStep('email')}
                        onResend={() => setStep('email')}
                    />
                )}
                {step === 'reset' && (
                    <ResetPassword email={email} onSubmit={() => setStep('success')} onBack={() => setStep('otp')} />
                )}
                {step === 'success' && (
                    <div className="w-full max-w-100 text-center">
                        <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 mx-auto">
                            <CheckCircle2 className="h-8 w-8 text-blue-600" />
                        </div>
                        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Password reset complete</h1>
                        <p className="mt-2 text-sm text-slate-600">Your password has been updated successfully.</p>
                        <button type="button" onClick={() => setStep('login')} className="mt-6 inline-flex h-10 w-full items-center justify-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700">
                            Return to sign in
                        </button>
                    </div>
                )}

                {/* {forgetPasswordCard && (
                    <Card className="p-6 sm:p-8">
                        <p>Enter your email to reset your password</p>
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">

                            {/* Email Field 
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
                            <p className="text-sm text-slate-600">to reset your password click on the button below to send 6 digit verification code</p>

                            {/* Submit Button 
                            <Button type="submit" disabled={isLoading} className="mt-2 bg-blue-600 hover:bg-blue-700 text-white"
                                onClick={() => {
                                    setForgetPasswordCard(false);
                                    setOtpCard(true);
                                }}
                            >
                                {isLoading ? (
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                ) : (
                                    <>
                                        Send OTP <ArrowRight className="w-4 h-4 ml-2" />
                                    </>
                                )}
                            </Button>
                        </form>
                    </Card>
                )} */}

                {/* {otpCard && (
                    <Card className="p-6 sm:p-8">

                            {/* Email Field 
                            <div className="space-y-2">
                                <Label htmlFor="email">Enter OTP</Label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-2.5 h-5 w-5 text-slate-400" />
                                    <Input
                                        id="otp"
                                        type="number"
                                        placeholder="Enter OTP"
                                        className="pl-10"
                                        // {...register("email", { required: true })}
                                        required
                                    />
                                </div>
                            </div>
                            <p className="text-center text-sm text-slate-600 mt-8">
                                {/* Resend OTP{' '} 
                                <span className="font-semibold text-blue-600 hover:text-blue-500 transition-colors">
                                    <Link to="#">Resend OTP</Link>
                                </span>
                            </p>

                            {/* Submit Button 
                            <Button type="submit" disabled={isLoading} className="mt-2 bg-blue-600 hover:bg-blue-700 text-white"
                            onClick={varifyOtp}
                            >
                                {isLoading ? (
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                ) : (
                                    <>
                                        Send OTP <ArrowRight className="w-4 h-4 ml-2" />
                                    </>
                                )}
                            </Button>
                        {/* </form>
                    </Card>
                )} */}
            </div>
        </div>
    );
}

export default Login;




// --- Mocking shadcn/ui Components ---

const Button = ({ children, variant = 'default', className = '', ...props }) => {
    const base = "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 disabled:pointer-events-none disabled:opacity-50 h-10 w-full px-4 py-2";
    const variants = {
        default: "bg-slate-900 text-white hover:bg-slate-900/90 shadow-sm",
        outline: "border border-slate-200 bg-transparent hover:bg-slate-50 text-slate-900",
        ghost: "hover:bg-slate-100 hover:text-slate-900",
    };
    return (
        <button className={`${base} ${variants[variant]} ${className}`} {...props}>
            {children}
        </button>
    );
};

const Input = ({ className = '', ...props }) => (
    <input
        className={`flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
        {...props}
    />
);

const Label = ({ className = '', children, ...props }) => (
    <label className={`text-sm font-medium leading-none text-slate-900 peer-disabled:cursor-not-allowed peer-disabled:opacity-70 ${className}`} {...props}>
        {children}
    </label>
);

const Card = ({ className = '', children }) => (
    <div className={`rounded-xl border border-slate-200 bg-white text-slate-950 shadow-xl shadow-slate-200/50 ${className}`}>
        {children}
    </div>
);

// --- Custom GitHub Icon (Since Lucide v1.0 removed it) ---
const GithubIcon = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.94-.81 1.76-1 2.5V22"></path><path d="M9 18c-4.51 2-5-2-7-2"></path></svg>
);

const GoogleIcon = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" className={className}><path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" /><path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" /><path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" /><path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" /></svg>
);