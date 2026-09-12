import React, { useState } from 'react';
import { ArrowLeft, ArrowRight, CheckCircle2, Lock, Sparkles } from 'lucide-react';
import { useForm } from 'react-hook-form';

import { Button, Card, Input, Label } from '../UIcomponents';
import AxiosInstance from '../../config/AxiosInstance';

const ResetPassword = ({ email, onSubmit, onBack }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const { register, handleSubmit, watch, formState: { errors } } = useForm();
  const password = watch('password');

  const submit = async (data) => {
    setIsLoading(true);
    setErrorMessage('');
    try {
      await AxiosInstance.patch('/update/updatePassword', { email, password: data.password });
      onSubmit();
    } catch (error) {
      setErrorMessage(error.response?.data?.msg || 'Unable to reset password. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-100">
      <div className="mb-8 flex flex-col items-center text-center">
        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl border border-slate-200 bg-white shadow-sm">
          <Sparkles className="h-6 w-6 text-blue-600" />
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Create a new password</h1>
        <p className="mt-2 px-6 text-sm text-slate-600">Choose a strong password you have not used before.</p>
      </div>

      <Card className="p-6 sm:p-8">
        <form onSubmit={handleSubmit(submit)} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="password">New password</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-2.5 h-5 w-5 text-slate-400" />
              <Input id="password" type="password" placeholder="At least 8 characters" className="pl-10" minLength={8} {...register('password', { required: true, minLength: 8 })} required />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm password</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-2.5 h-5 w-5 text-slate-400" />
              <Input id="confirmPassword" type="password" placeholder="Repeat your password" className="pl-10" {...register('confirmPassword', { required: true, validate: value => value === password || 'Passwords do not match' })} required />
            </div>
            {errors.confirmPassword && <p className="text-xs text-red-600">{errors.confirmPassword.message || 'Please confirm your password.'}</p>}
          </div>
          {errorMessage && <p className="text-sm text-red-600">{errorMessage}</p>}
          <Button type="submit" disabled={isLoading} className="mt-2 bg-blue-600 text-white hover:bg-blue-700">
            {isLoading ? <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" /> : <>Reset password <ArrowRight className="ml-2 h-4 w-4" /></>}
          </Button>
        </form>
        <button type="button" onClick={onBack} className="mt-5 inline-flex w-full items-center justify-center gap-2 text-sm font-medium text-slate-600 hover:text-blue-600">
          <ArrowLeft className="h-4 w-4" />
          Back to verification
        </button>
      </Card>
    </div>
  );
};

export default ResetPassword;