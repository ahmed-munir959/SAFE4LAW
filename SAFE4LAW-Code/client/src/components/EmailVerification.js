import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';

export const EmailVerification = () => {
    const { token } = useParams();
    const navigate = useNavigate();
    const [verificationStatus, setVerificationStatus] = useState('verifying');

    useEffect(() => {
        const verifyEmail = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/api/verify-email/${token}`);
                
                if (response.status === 200) {
                    setVerificationStatus('success');
                    toast.success(response.data.message, {  // Show the message from the server
                        position: "top-right",
                        autoClose: 3000,
                    });

                    // Navigate to login page after delay
                    setTimeout(() => {
                        navigate('/login');
                    }, 3000);
                }
            } catch (error) {
                setVerificationStatus('error');
                const errorMessage = error.response?.data?.message || 'Email verification failed.';
                
                toast.error(errorMessage, {  // Show the specific error message from the server
                    position: "top-right",
                    autoClose: 3000,
                });

                // Navigate to login page after delay
                setTimeout(() => {
                    navigate('/login');
                }, 3000);
            }
        };

        verifyEmail();
    }, [token, navigate]);

    return (
        <div className="min-h-screen bg-[#62CBCB] flex items-center justify-center p-4">
            <div className="w-full max-w-md bg-white shadow-lg rounded-lg p-8 text-center">
                <h2 className="text-2xl font-bold mb-4">
                    {verificationStatus === 'verifying' && 'Verifying your email...'}
                    {verificationStatus === 'success' && 'Email Verified Successfully!'}
                    {verificationStatus === 'error' && 'Verification Failed'}
                </h2>
                <p>
                    {verificationStatus === 'verifying' && 'Please wait while we verify your email address.'}
                    {verificationStatus === 'success' && 'You will be redirected to the login page shortly.'}
                    {verificationStatus === 'error' && 'You will be redirected to the login page shortly.'}
                </p>
                <ToastContainer />
            </div>
        </div>
    );
};   

export default EmailVerification;
