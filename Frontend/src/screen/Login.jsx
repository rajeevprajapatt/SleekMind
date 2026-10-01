import React, { useState } from 'react';
import { CheckCircle2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import LoginComponent from '../components/loginPageComponents/LoginComponent'
import SendOtp from '../components/loginPageComponents/SendOtp'
import SubmitOtp from '../components/loginPageComponents/SubmitOtp'
import ResetPassword from '../components/loginPageComponents/ResetPassword'


// --- Main Login Component ---

const Login = () => {
    const [step, setStep] = useState('login');
    const [email, setEmail] = useState('');
    const navigate = useNavigate();

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
            </div>
        </div>
    );
}

export default Login;

