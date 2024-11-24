import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FaTimes } from 'react-icons/fa';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ResetPassword = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [formData, setFormData] = useState({
        newPassword: '',
        confirmPassword: ''
    });
    const [email, setEmail] = useState('');

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const emailParam = params.get('email');
        if (emailParam) {
            setEmail(decodeURIComponent(emailParam));
        }
    }, [location]);

    const validatePassword = (password) => {
        const passwordRegex = /^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])[A-Za-z0-9!@#$%^&*]{8,}$/;
        return passwordRegex.test(password);
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Check if fields are empty
        if (!formData.newPassword || !formData.confirmPassword) {
            toast.error('Please fill in all fields', {
                position: 'top-right',
                autoClose: 3000
            });
            return;
        }

        // Validate password requirements
        if (!validatePassword(formData.newPassword)) {
            toast.error('Password must be at least 8 characters long and include a capital letter, number, and special character', {
                position: 'top-right',
                autoClose: 3000
            });
            return;
        }

        // Check if passwords match
        if (formData.newPassword !== formData.confirmPassword) {
            toast.error('Passwords do not match', {
                position: 'top-right',
                autoClose: 3000
            });
            return;
        }

        try {
            const response = await fetch('http://localhost:5000/api/resetpassword', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email,
                    newPassword: formData.newPassword
                })
            });

            const data = await response.json();

            if (response.ok) {
                toast.success('Password reset successful', {
                    position: 'top-right',
                    autoClose: 2000,
                    onClose: () => navigate('/login')
                });
            } else {
                toast.error(data.message || 'Password reset failed', {
                    position: 'top-right',
                    autoClose: 3000
                });
            }
        } catch (error) {
            toast.error('An error occurred. Please try again.', {
                position: 'top-right',
                autoClose: 3000
            });
        }
    };

    const passwordRequirements = (
        <div className="text-sm text-gray-600 mt-2">
            Password must contain:
            <ul className="list-disc list-inside">
                <li>At least 8 characters</li>
                <li>At least one letter(Uppercase&Lowercase)</li>
                <li>At least one number</li>
                <li>At least one special character (@$!%*#?&)</li>
            </ul>
        </div>
    );


    return (
        <div className="min-h-screen bg-[#62CBCB] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <ToastContainer />
            <div className="max-w-md w-full space-y-8">
                <div className="bg-white shadow-xl rounded-lg p-8">
                    <div className="flex justify-end">
                        <FaTimes
                            className="text-gray-600 cursor-pointer text-2xl"
                            onClick={() => navigate('/')}
                        />
                    </div>

                    <div className="flex items-center border-b-4 border-gray-300 pb-4">
                        <h1 className="text-4xl font-bold text-[#006B5E]">SAFE4</h1>
                        <h1 className="text-4xl font-bold text-black">LAW</h1>
                    </div>

                    <h2 className="text-2xl font-bold text-center mt-6">RESET PASSWORD</h2>
                    <form onSubmit={handleSubmit} className="mt-6 space-y-6">
                        <div className="space-y-2">
                            <label htmlFor="newPassword" className="sr-only">New Password</label>
                            <input
                                id="newPassword"
                                name="newPassword"
                                type="password"
                                value={formData.newPassword}
                                onChange={handleChange}
                                className="block w-full px-4 py-3 text-gray-900 placeholder-gray-600 rounded-lg bg-gray-200 focus:outline-none focus:ring-2 focus:ring-[#000000] focus:border-transparent"
                                placeholder="New Password"
                            />
                            {formData.newPassword && passwordRequirements}
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="confirmPassword" className="sr-only">Confirm New Password</label>
                            <input
                                id="confirmPassword"
                                name="confirmPassword"
                                type="password"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                className="block w-full px-4 py-3 text-gray-900 placeholder-gray-600 rounded-lg bg-gray-200 focus:outline-none focus:ring-2 focus:ring-[#000000] focus:border-transparent"
                                placeholder="Confirm New Password"
                            />
                        </div>

                        <div>
                            <button
                                type="submit"
                                className="w-full py-3 bg-[#006B5E] text-white font-bold rounded-lg hover:bg-[#00584e] focus:outline-none focus:ring-4 focus:ring-[#006B5E] transition-all"
                            >
                                Reset
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ResetPassword;