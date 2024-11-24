import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaTimes, FaCheckCircle, FaArrowLeft } from 'react-icons/fa';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';

const VerifyOtp = () => {
    const navigate = useNavigate();
    const [otp, setOtp] = useState(['', '', '', '']);
    const [timer, setTimer] = useState(() => {
        const savedTimer = sessionStorage.getItem('otpTimer');
        return savedTimer ? parseInt(savedTimer) : 120;
    });
    const [isLoading, setIsLoading] = useState(false);
    const [resendAttempts, setResendAttempts] = useState(0);
    const [resendDisabled, setResendDisabled] = useState(false);
    const inputRefs = useRef([]);
    const timerRef = useRef(null);
    const resendTimerRef = useRef(null);

    // Cleanup function for timers and session storage
    const cleanup = () => {
        clearInterval(timerRef.current);
        clearTimeout(resendTimerRef.current);
        sessionStorage.removeItem('otpTimer');
    };

    useEffect(() => {
        const email = sessionStorage.getItem('resetEmail');
        if (!email) {
            toast.error('Please provide your email first');
            navigate('/forgetpassword');
            return;
        }

        startTimer();

        // Cleanup on component unmount
        return cleanup;
    }, [navigate]);

    const startTimer = () => {
        if (timerRef.current) clearInterval(timerRef.current);
        
        timerRef.current = setInterval(() => {
            setTimer(prev => {
                const newTimer = prev - 1;
                if (newTimer <= 0) {
                    clearInterval(timerRef.current);
                    return 0;
                }
                sessionStorage.setItem('otpTimer', newTimer.toString());
                return newTimer;
            });
        }, 1000);
    };

    const handleChange = (element, index) => {
        if (isNaN(element.value)) return;

        const newOtp = [...otp];
        newOtp[index] = element.value;
        setOtp(newOtp);

        // Auto-focus next input
        if (element.value && index < 3) {
            inputRefs.current[index + 1].focus();
        }
        
        // Auto-submit when all fields are filled
        if (element.value && index === 3) {
            const otpValue = newOtp.join('');
            if (otpValue.length === 4) {
                handleSubmit(new Event('submit'));
            }
        }
    };

    const handleKeyDown = (e, index) => {
        // Handle backspace
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            inputRefs.current[index - 1].focus();
            return;
        }

        // Handle arrow keys
        if (e.key === 'ArrowLeft' && index > 0) {
            inputRefs.current[index - 1].focus();
        } else if (e.key === 'ArrowRight' && index < 3) {
            inputRefs.current[index + 1].focus();
        }
    };

    const handlePaste = (e) => {
        e.preventDefault();
        const pastedData = e.clipboardData.getData('text').slice(0, 4);
        
        if (!/^\d+$/.test(pastedData)) {
            toast.error('Please paste only numbers');
            return;
        }

        const newOtp = pastedData.split('').concat(Array(4).fill('')).slice(0, 4);
        setOtp(newOtp);
        inputRefs.current[3].focus();

        // Auto-submit if valid OTP is pasted
        if (pastedData.length === 4) {
            setTimeout(() => handleSubmit(new Event('submit')), 100);
        }
    };

    const resendOtp = async () => {
        if (resendDisabled) {
            toast.warning('Please wait before requesting a new OTP');
            return;
        }

        const email = sessionStorage.getItem('resetEmail');
        if (!email) {
            toast.error('Email not found. Please try again');
            navigate('/forgetpassword');
            return;
        }

        setIsLoading(true);
        try {
            const response = await axios.post('http://localhost:5000/api/resend-otp', { email });
            
            if (response.data.success) {
                setOtp(['', '', '', '']);
                setTimer(120);
                sessionStorage.setItem('otpTimer', '120');
                startTimer();
                
                // Handle resend attempts
                setResendAttempts(prev => {
                    const newAttempts = prev + 1;
                    if (newAttempts >= 3) {
                        setResendDisabled(true);
                        toast.warning('Maximum attempts reached. Please wait 2 minutes');
                        resendTimerRef.current = setTimeout(() => {
                            setResendDisabled(false);
                            setResendAttempts(0);
                            toast.info('You can now request a new OTP');
                        }, 120000); // 2 minutes
                    }
                    return newAttempts;
                });

                toast.success('New OTP has been sent to your email');
                inputRefs.current[0].focus();
            }
        } catch (error) {
            const message = error.response?.data?.message || 'Failed to resend OTP. Please try again after 2 minutes';
            toast.error(message);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const otpValue = otp.join('');
        
        if (otpValue.length !== 4) {
            toast.success('OTP completed...!');
            return;
        }

        if (timer <= 0) {
            toast.error('OTP has expired. Please request a new one');
            return;
        }
    
        const email = sessionStorage.getItem('resetEmail');
        if (!email) {
            toast.error('Email not found. Please try again');
            navigate('/forgetpassword');
            return;
        }
    
        setIsLoading(true);
        try {
            const response = await axios.post('http://localhost:5000/api/verify-otp', {
                email,
                otp: otpValue
            });
    
            if (response.data.success) {
                // Show success toast
                toast.success('OTP verified successfully');
                sessionStorage.setItem('otpVerified', 'true');
                cleanup();
                
                // Add a slight delay before navigation with query parameters
                setTimeout(() => {
                    const queryParams = new URLSearchParams({
                        email: email,
                    }).toString();
                    navigate(`/resetpassword?${queryParams}`);
                }, 1000); // 1 second delay
            }
        } catch (error) {
            const message = error.response?.data?.message || 'Invalid OTP';
            toast.error(message);
            setOtp(['', '', '', '']);
            inputRefs.current[0].focus();
        } finally {
            setIsLoading(false);
        }
    };

    return (
        // ... rest of the JSX remains the same ...
        <div className="min-h-screen bg-[#62CBCB] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <ToastContainer
                position="top-right"
                autoClose={2000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
            />
            <div className="max-w-md w-full space-y-8">
                <div className="bg-white shadow-xl rounded-lg p-8">
                    {/* Header with Navigation Icons */}
                    <div className="flex justify-between items-center">
                        <FaArrowLeft 
                            className="text-2xl text-[#006B5E] cursor-pointer hover:text-[#005349] transition-colors" 
                            onClick={() => {
                                cleanup();
                                navigate('/forgetpassword');
                            }}
                            title="Back to Forget Password"
                        />
                        <FaTimes 
                            className="text-gray-600 cursor-pointer text-2xl hover:text-gray-800 transition-colors" 
                            onClick={() => {
                                cleanup();
                                sessionStorage.removeItem('resetEmail');
                                navigate('/');
                            }}
                            title="Close"
                        />
                    </div>

                    {/* Logo Section */}
                    <div className="flex items-center border-b-4 border-gray-300 pb-4 mt-4">
                        <h1 className="text-4xl font-bold text-[#006B5E]">SAFE4</h1>
                        <h1 className="text-4xl font-bold text-black">LAW</h1>
                    </div>

                    {/* Title and Description */}
                    <h2 className="text-2xl font-bold text-center mt-6">VERIFY OTP</h2>
                    <p className="text-center text-gray-700 mt-2">
                        We have sent an OTP to your email address
                    </p>

                    {/* OTP Form */}
                    <form onSubmit={handleSubmit} className="mt-6 space-y-6">
                        <div className="flex justify-center space-x-4">
                            {otp.map((digit, index) => (
                                <input
                                    key={index}
                                    ref={el => inputRefs.current[index] = el}
                                    type="text"
                                    maxLength="1"
                                    value={digit}
                                    onChange={e => handleChange(e.target, index)}
                                    onKeyDown={e => handleKeyDown(e, index)}
                                    onPaste={handlePaste}
                                    className="w-12 h-12 text-center text-xl font-semibold rounded-lg border-2 border-gray-300 
                                             focus:border-[#006B5E] focus:outline-none transition-colors
                                             disabled:bg-gray-100 disabled:cursor-not-allowed"
                                    autoFocus={index === 0}
                                    disabled={isLoading}
                                    inputMode="numeric"
                                    pattern="\d*"
                                />
                            ))}
                        </div>

                        {/* Timer and Resend Button */}
                        <div className="flex justify-between items-center mt-4">
                            <span className={`font-semibold ${timer > 0 ? 'text-gray-600' : 'text-red-600'}`}>
                                {timer > 0 ? 
                                    `Time Remaining: ${Math.floor(timer / 60)}:${String(timer % 60).padStart(2, '0')}` :
                                    'OTP Expired'
                                }
                            </span>

                            <button 
                                type="button"
                                onClick={resendOtp} 
                                className={`text-[#F15A22] font-bold hover:text-[#e1491f] ml-4 transition-colors
                                    ${(timer > 0 || resendDisabled) ? 'opacity-50 cursor-not-allowed' : 'hover:underline'}`}
                                disabled={timer > 0 || resendDisabled || isLoading}
                            >
                                {resendDisabled ? 'Try again in 2 minutes' : 'Resend OTP'}
                            </button>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={isLoading || timer <= 0}
                            className="w-full py-3 bg-[#006B5E] text-white font-bold rounded-lg 
                                     flex items-center justify-center space-x-2 
                                     hover:bg-[#00584e] focus:outline-none focus:ring-4 
                                     focus:ring-[#006B5E] focus:ring-opacity-50 
                                     transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <FaCheckCircle className={`text-lg ${isLoading ? 'animate-spin' : ''}`} />
                            <span>{isLoading ? 'Verifying...' : 'Verify'}</span>
                        </button>
                    </form>

                    {/* Back to Login Link */}
                    <div className="flex justify-center mt-6">
                        <button 
                            onClick={() => {
                                cleanup();
                                navigate('/login');
                            }}
                            className="flex items-center text-[#F15A22] hover:text-[#e1491f] 
                                     font-bold transition-colors hover:underline"
                        >
                            <FaArrowLeft className="mr-2" />
                            Back to Login
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VerifyOtp;