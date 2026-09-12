import React, { useState } from 'react';
import { ArrowLeft, ArrowRight, Mail, Sparkles } from 'lucide-react';
import { useForm } from "react-hook-form"

// import LoginComponent from '../components/loginPageComponents/loginComponent'
import { Button, Card, Input, Label, GoogleIcon, GithubIcon } from '../UIcomponents'
import AxiosInstance from '../../config/AxiosInstance';

const SendOtp = ({ onSubmit, onBack }) => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm()

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const submit = async ({ email }) => {
    setIsLoading(true);
    setErrorMessage('');

    try {
      await AxiosInstance.post('/update/sendOtp', { email });
      onSubmit({ email });
    } catch (error) {
      setErrorMessage(error.response?.data?.msg || 'Unable to send OTP. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (

    <div className="w-full max-w-100">

      <div className="flex flex-col items-center mb-8 text-center">
        <div className="w-12 h-12 rounded-xl bg-white border border-slate-200 flex items-center justify-center shadow-sm mb-4">
          <Sparkles className="h-6 w-6 text-blue-600" />
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Forget Password?</h1>
        <p className="text-sm text-slate-600 mt-2 px-6">
          Enter your email and we'll send you a 6-digit verification code instantly
        </p>
      </div>

      <Card className="p-6 sm:p-8">
        <form onSubmit={handleSubmit(submit)} className="space-y-5">

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

          {errorMessage && <p className="text-sm text-red-600">{errorMessage}</p>}

          {/* Submit Button */}
          <Button type="submit" disabled={isLoading} className="mt-2 bg-blue-600 hover:bg-blue-700 text-white"
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            ) : (
              <>
                Send Code <ArrowRight className="w-4 h-4 ml-2" />
              </>
            )}
          </Button>
        </form>
        <button type="button" onClick={onBack} className="mt-5 inline-flex w-full items-center justify-center gap-2 text-sm font-medium text-slate-600 hover:text-blue-600">
          <ArrowLeft className="h-4 w-4" />
          Back to sign in
        </button>
      </Card>
    </div>
  )
}

export default SendOtp
