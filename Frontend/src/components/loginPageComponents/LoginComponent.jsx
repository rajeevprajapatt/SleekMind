import React, { useState, useEffect, useContext } from 'react';
import { Sparkles, Mail, Lock, ArrowRight } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom'
import { useForm } from "react-hook-form"

import axios from '../../config/AxiosInstance'
import { UserContext } from '../../context/userContext'
import { Button, Card, Input, Label, GoogleIcon, GithubIcon } from '../UIcomponents'

const LoginComponent = ({ onForgotPassword }) => {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm()

  const [isLoading, setIsLoading] = useState(false);
  const { user, setUser } = useContext(UserContext);
  const [forgetPasswordCard, setForgetPasswordCard] = useState(false);
  const [error, setError] = useState("");
  // const [otpCard, setOtpCard] = useState(false);
  // const [otpVerified, setOtpVerified] = useState(true);

  useEffect(() => {
    if (localStorage.getItem('token')) {
      navigate('/')
    }
  }, []);

  const onSubmit = async (data) => {
    try {
      const response = await axios.post('/user/login', data);

      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));

      setUser(response.data.user);
      navigate('/');
    } catch (error) {
      console.error('Login error:', error);
      setError("Invalid email or password. Please try again.");
    }
  }

  return (
    <div className="w-full max-w-100">

      <div className="flex flex-col items-center mb-8 text-center">
        <div className="w-12 h-12 rounded-xl bg-white border border-slate-200 flex items-center justify-center shadow-sm mb-4">
          <Sparkles className="h-6 w-6 text-blue-600" />
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Welcome back</h1>
        <p className="text-sm text-slate-600 mt-2">
          Enter your credentials to access your dashboard
        </p>
      </div>


      {/* Login Card */}
      <Card className="p-6 sm:p-8">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">

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
            <div className="flex items-center justify-between">
              <Label htmlFor="password">Password</Label>
              <button type="button" className="text-sm font-medium text-blue-600 hover:text-blue-500" onClick={onForgotPassword}>
                Forgot password?
              </button>
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-2.5 h-5 w-5 text-slate-400" />
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                className="pl-10"
                {...register("password", { required: true })}
                required
              />
            </div>
            {error && <p className="text-xs text-red-600">{error}</p>}
          </div>

          {/* Submit Button */}
          <Button type="submit" disabled={isLoading} className="mt-2 bg-blue-600 hover:bg-blue-700 text-white">
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            ) : (
              <>
                Sign In <ArrowRight className="w-4 h-4 ml-2" />
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
            <span className="bg-white px-2 text-slate-500">Or continue with</span>
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

      <p className="text-center text-sm text-slate-600 mt-8">
        Don't have an account?{' '}
        <span className="font-semibold text-blue-600 hover:text-blue-500 transition-colors">
          <Link to="/register">Sign up for free</Link>
        </span>
      </p>

    </div>
  )
}

export default LoginComponent


// const Button = ({ children, variant = 'default', className = '', ...props }) => {
//     const base = "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 disabled:pointer-events-none disabled:opacity-50 h-10 w-full px-4 py-2";
//     const variants = {
//         default: "bg-slate-900 text-white hover:bg-slate-900/90 shadow-sm",
//         outline: "border border-slate-200 bg-transparent hover:bg-slate-50 text-slate-900",
//         ghost: "hover:bg-slate-100 hover:text-slate-900",
//     };
//     return (
//         <button className={`${base} ${variants[variant]} ${className}`} {...props}>
//             {children}
//         </button>
//     );
// };

// const Input = ({ className = '', ...props }) => (
//     <input
//         className={`flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
//         {...props}
//     />
// );

// const Label = ({ className = '', children, ...props }) => (
//     <label className={`text-sm font-medium leading-none text-slate-900 peer-disabled:cursor-not-allowed peer-disabled:opacity-70 ${className}`} {...props}>
//         {children}
//     </label>
// );

// const Card = ({ className = '', children }) => (
//     <div className={`rounded-xl border border-slate-200 bg-white text-slate-950 shadow-xl shadow-slate-200/50 ${className}`}>
//         {children}
//     </div>
// );

// --- Custom GitHub Icon (Since Lucide v1.0 removed it) ---
// const GithubIcon = ({ className }) => (
//     <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.94-.81 1.76-1 2.5V22"></path><path d="M9 18c-4.51 2-5-2-7-2"></path></svg>
// );

// const GoogleIcon = ({ className }) => (
//     <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" className={className}><path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" /><path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" /><path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" /><path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" /></svg>
// );