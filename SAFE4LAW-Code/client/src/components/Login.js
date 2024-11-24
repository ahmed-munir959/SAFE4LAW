import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaTimes, FaEye, FaEyeSlash } from 'react-icons/fa';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';

const Login = () => {
    const { login } = useAuth();
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [loading, setLoading] = useState(false);

    axios.defaults.withCredentials = true;

    const handleInputChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const validateForm = () => {
        if (!formData.email || !formData.password) {
            toast.error('Please fill in all fields', {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            });
            return false;
        }

        const emailRegex = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;
        if (!emailRegex.test(formData.email)) {
            toast.error('Please enter a valid email address', {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            });
            return false;
        }

        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) return;

        setLoading(true);
        try {
            const response = await axios.post('http://localhost:5000/api/login', formData, {
                withCredentials: true,
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (response.data.success) {
                // Pass the user data to the login function
                const userData = {
                    id: response.data.user.id,
                    email: response.data.user.email,
                    firstName: response.data.user.firstName,
                    lastName: response.data.user.lastName
                };
                
                // Update the auth context with user data
                await login(userData);

                toast.success('Login Successfully', {
                    position: "top-right",
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });

                // Navigate to service page after successful login
                setTimeout(() => {
                    navigate('/service');
                }, 1000);
            }
        } catch (error) {
            const errorMessage = error.response?.data?.message || 'An error occurred during login';
            toast.error(errorMessage, {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            });
        } finally {
            setLoading(false);
        }
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    return (
        <div className="min-h-screen bg-[#62CBCB] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <ToastContainer />
            <div className="max-w-md w-full space-y-8">
                <div className="bg-white shadow-xl rounded-lg p-8">
                    <div className="flex justify-end">
                        <FaTimes className="text-gray-600 cursor-pointer text-2xl" onClick={() => navigate('/')} />
                    </div>

                    <div className="flex items-center border-b-4 border-gray-300 pb-4">
                        <h1 className="text-4xl font-bold text-[#006B5E]">SAFE4</h1>
                        <h1 className="text-4xl font-bold text-black">LAW</h1>
                    </div>

                    <div className="flex items-center space-x-4 mt-8">
                        <Link to="/register" className="bg-[#d9d9d9] py-2 px-6 rounded-tl-lg rounded-bl-lg text-lg font-semibold">
                            Register
                        </Link>
                        <button className="bg-[#F15A22] text-white py-2 px-6 rounded-tr-lg rounded-br-lg text-lg font-semibold">
                            Login
                        </button>
                    </div>

                    <br />

                    <h2 className="text-2xl font-bold text-center mb-6">LOGIN</h2>
                    <form onSubmit={handleSubmit} className="mt-6 space-y-6">
                        <div className="space-y-2">
                            <label htmlFor="email" className="sr-only">
                                Username/Email
                            </label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                className="block w-full px-4 py-3 text-gray-900 placeholder-gray-600 rounded-lg bg-gray-200 focus:outline-none focus:ring-2 focus:ring-[#000000] focus:border-transparent"
                                placeholder="Email"
                                value={formData.email}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className="space-y-2 relative">
                            <label htmlFor="password" className="sr-only">
                                Password
                            </label>
                            <input
                                id="password"
                                name="password"
                                type={showPassword ? 'text' : 'password'}
                                className="block w-full px-4 py-3 text-gray-900 placeholder-gray-600 rounded-lg bg-gray-200 focus:outline-none focus:ring-2 focus:ring-[#000000] focus:border-transparent"
                                placeholder="Password"
                                value={formData.password}
                                onChange={handleInputChange}
                            />
                            <div className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-700 cursor-pointer">
                                {showPassword ? (
                                    <FaEye className="text-gray-600" onClick={togglePasswordVisibility} />
                                ) : (
                                    <FaEyeSlash className="text-gray-600" onClick={togglePasswordVisibility} />
                                )}
                            </div>
                        </div>

                        <div className="flex justify-end">
                            <Link to="/forgetpassword" className="text-sm font-medium text-red-600 hover:text-red-700">
                                Forget Password?
                            </Link>
                        </div>

                        <div>
                            <button
                                type="submit"
                                disabled={loading}
                                className={`w-full py-3 bg-[#006B5E] text-white font-bold rounded-lg hover:bg-[#00584e] focus:outline-none focus:ring-4 focus:ring-[#006B5E] transition-all ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                            >
                                {loading ? 'LOGGING IN...' : 'LOGIN'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Login;