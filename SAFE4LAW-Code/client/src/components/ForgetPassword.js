import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaTimes, FaRegEnvelope, FaArrowLeft } from 'react-icons/fa';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';

const ForgetPassword = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    // API configuration
    const API_URL = 'http://localhost:5000/api/forget-password';
    
    const validateEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Email validation
        if (!validateEmail(email)) {
            toast.error('Please enter a valid email address', {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            });
            return;
        }

        setIsLoading(true);

        try {
            // Configure axios request with timeout and headers
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                },
                timeout: 10000, // 10 second timeout
            };

            const response = await axios.post(API_URL, { email }, config);
            
            //console.log('API Response:', response); // For debugging

            if (response.data.success) {
                // Show success toast
                toast.success('OTP has been sent to your email', {
                    position: "top-right",
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                });

                // Store email and navigate after a short delay
                sessionStorage.setItem('resetEmail', email);
                setTimeout(() => {
                    navigate('/verifyotp');
                }, 2000); // Navigate after 2 seconds
            } else {
                // Handle unsuccessful response
                toast.error(response.data.message || 'Failed to send OTP', {
                    position: "top-center",
                    autoClose: 3000,
                });
            }
        } catch (error) {
            console.error('Error details:', error); // For debugging

            // Enhanced error handling
            let errorMessage = 'An error occurred while sending OTP';
            
            if (error.response) {
                // Server responded with an error
                errorMessage = error.response.data.message || 'Server error occurred';
            } else if (error.request) {
                // Request was made but no response
                errorMessage = 'No response from server. Please check your connection';
            } else {
                // Error in request setup
                errorMessage = error.message || 'Failed to send request';
            }

            toast.error(errorMessage, {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#62CBCB] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            {/* Toast Container with higher z-index */}
            <ToastContainer
                position="top-right"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
              //  theme="colored"
                style={{ zIndex: 9999 }}
            />
            
            <div className="max-w-md w-full space-y-8 relative z-10">
                <div className="bg-white shadow-xl rounded-lg p-8">
                    <div className="flex justify-end">
                        <FaTimes 
                            className="text-gray-600 cursor-pointer text-2xl hover:text-gray-800" 
                            onClick={() => navigate('/')} 
                        />
                    </div>

                    <div className="flex items-center border-b-4 border-gray-300 pb-4">
                        <h1 className="text-4xl font-bold text-[#006B5E]">SAFE4</h1>
                        <h1 className="text-4xl font-bold text-black">LAW</h1>
                    </div>

                    <h2 className="text-2xl font-bold text-center mt-6">FORGET PASSWORD</h2>
                    <p className="text-center text-gray-700 mt-2">
                        Enter your email address to get instructions to reset your password
                    </p>

                    <form onSubmit={handleSubmit} className="mt-6 space-y-6">
                        <div className="space-y-2">
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="block w-full px-4 py-3 text-gray-900 placeholder-gray-600 rounded-lg bg-gray-200 focus:outline-none focus:ring-2 focus:ring-[#000000] focus:border-transparent"
                                placeholder="Email"
                                disabled={isLoading}
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className={`w-full py-3 bg-[#006B5E] text-white font-bold rounded-lg flex items-center justify-center space-x-2 hover:bg-[#00584e] focus:outline-none focus:ring-4 focus:ring-[#006B5E] transition-all ${
                                isLoading ? 'opacity-50 cursor-not-allowed' : ''
                            }`}
                        >
                            <FaRegEnvelope className="text-lg" />
                            <span>{isLoading ? 'Sending...' : 'Send'}</span>
                        </button>
                    </form>

                    <div className="flex justify-center mt-6">
                        <button
                            onClick={() => navigate('/login')}
                            className="flex items-center text-[#F15A22] hover:text-[#e1491f] font-bold"
                            disabled={isLoading}
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

export default ForgetPassword;