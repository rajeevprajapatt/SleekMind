import React, { useState } from 'react';
import { ArrowLeft, ArrowRight, KeyRound, Sparkles } from 'lucide-react';
import { useForm } from "react-hook-form"

// import LoginComponent from '../components/loginPageComponents/loginComponent'
import { Button, Card, Input, Label, GoogleIcon, GithubIcon } from '../UIcomponents'
import AxiosInstance from '../../config/AxiosInstance';

const SubmitOtp = ({ email, onSubmit, onBack, onResend }) => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm()

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const submit = async ({ otp }) => {
    setIsLoading(true);
    setErrorMessage('');

    try {
      await AxiosInstance.post('/update/verifyOtp', { email, otp });
      onSubmit();
    } catch (error) {
      setErrorMessage(error.response?.data?.msg || 'Unable to verify OTP. Please try again.');
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
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Password Reset</h1>
        <p className="text-sm text-slate-600 mt-2 px-6">
          We sent a code to {email}
        </p>
      </div>

      <Card className="p-6 sm:p-8">
        <form onSubmit={handleSubmit(submit)} className="space-y-5">

          {/* Email Field */}
          <div className="space-y-2">
            <Label htmlFor="otp">Enter Code</Label>
            <div className="relative">
              <KeyRound className="absolute left-3 top-2.5 h-5 w-5 text-slate-400" />
              <Input
                id="otp"
                type="text"
                inputMode="numeric"
                maxLength={6}
                placeholder="6-digit code"
                className="pl-10"
                {...register("otp", { required: true, minLength: 6, maxLength: 6 })}
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
                Continue <ArrowRight className="w-4 h-4 ml-2" />
              </>
            )}
          </Button>
        </form>
        <div className="mt-5 flex items-center justify-between text-sm">
          <button type="button" onClick={onBack} className="inline-flex items-center gap-2 font-medium text-slate-600 hover:text-blue-600">
            <ArrowLeft className="h-4 w-4" />
            Change email
          </button>
          <button type="button" onClick={onResend} className="font-semibold text-blue-600 hover:text-blue-500">
            Resend code
          </button>
        </div>
      </Card>
    </div>
  )
}

export default SubmitOtp

