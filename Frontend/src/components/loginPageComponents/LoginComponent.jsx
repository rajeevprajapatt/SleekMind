import React, { useState, useEffect, useContext } from 'react';
import { Sparkles, Mail, Lock, ArrowRight } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom'
import { useForm } from "react-hook-form"

import axios from '../../config/axios'
import { UserContext } from '../../context/user-context'
import { Button, Card, Input, Label, GoogleIcon, GithubIcon } from '../UIcomponents'
import logo from '../../assets/urlLogo.png'

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
  const [error, setError] = useState("");


  useEffect(() => {
    if (localStorage.getItem('token')) {
      navigate('/')
    }
  }, []);

  const onSubmit = async (data) => {
    try {
      const response = await axios.post('/users/login', data);

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
          {/* <Sparkles className="h-6 w-6 text-blue-600" /> */}
          <img src={logo} alt="logo" className="h-6 w-6 text-blue-600" />
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
          <Link to="/register" replace>Sign up for free</Link>
        </span>
      </p>

    </div>
  )
}

export default LoginComponent
