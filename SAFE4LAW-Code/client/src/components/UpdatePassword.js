import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaUserCircle, FaEye, FaEyeSlash } from 'react-icons/fa';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const UpdatePassword = () => {
    const { logout, user } = useAuth();
    const navigate = useNavigate();
    
    const [formData, setFormData] = useState({
        newPassword: '',
        confirmNewPassword: '',
    });

    const [showPassword, setShowPassword] = useState({
        newPassword: false,
        confirmNewPassword: false
    });
    
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    
    const userFullName = user ? `${user.firstName} ${user.lastName}` : 'Guest';

    // Check authentication on component mount
    useEffect(() => {
        checkAuthentication();
    },);

    const checkAuthentication = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/check-auth', {
                withCredentials: true
            });
            
            if (!response.data.isAuthenticated) {
                toast.error('Please login to access this page', {
                    position: 'top-right',
                    autoClose: 2000,
                    onClose: () => navigate('/login')
                });
            }
        } catch (error) {
            console.error('Auth check error:', error);
            toast.error('Authentication failed', {
                position: 'top-right',
                autoClose: 2000,
                onClose: () => navigate('/login')
            });
        }
    };

    // Password validation function
    const validatePassword = (password) => {
        const hasMinLength = password.length >= 8;
        const hasLetter = /[a-zA-Z]/.test(password);
        const hasNumber = /\d/.test(password);
        const hasSpecialChar = /[@$!%*#?&]/.test(password);

        const errors = [];
        if (!hasMinLength) errors.push('at least 8 characters');
        if (!hasLetter) errors.push('a letter');
        if (!hasNumber) errors.push('a number');
        if (!hasSpecialChar) errors.push('a special character');

        return {
            isValid: hasMinLength && hasLetter && hasNumber && hasSpecialChar,
            errors: errors
        };
    };

    const handleLogout = async () => {
        try {
            await logout();
            navigate('/');
        } catch (error) {
            console.error('Logout error:', error);
            toast.error('Error logging out', {
                position: 'top-right'
            });
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        
        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const togglePasswordVisibility = (field) => {
        setShowPassword(prev => ({
            ...prev,
            [field]: !prev[field]
        }));
    };

    const validateForm = () => {
        const newErrors = {};
        
        // Validate new password
        if (!formData.newPassword) {
            newErrors.newPassword = 'New password is required';
        } else {
            const passwordValidation = validatePassword(formData.newPassword);
            if (!passwordValidation.isValid) {
                newErrors.newPassword = `Password must contain ${passwordValidation.errors.join(', ')}`;
            }
        }

        // Validate confirm password
        if (!formData.confirmNewPassword) {
            newErrors.confirmNewPassword = 'Please confirm your new password';
        } else if (formData.newPassword !== formData.confirmNewPassword) {
            newErrors.confirmNewPassword = 'Passwords do not match';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!validateForm()) {
            toast.error('Please check all fields', {
                position: 'top-right',
                autoClose: 3000
            });
            return;
        }

        setIsLoading(true);
        try {
            const response = await axios.put(
                'http://localhost:5000/api/profile/password',
                { newPassword: formData.newPassword },
                { withCredentials: true }
            );

            if (response.data.success) {
                toast.success('Password updated successfully!', {
                    position: 'top-right',
                    autoClose: 3000,
                    onClose: () => {
                        // Clear the form
                        setFormData({
                            newPassword: '',
                            confirmNewPassword: ''
                        });
                        // Logout and redirect to login page
                        setTimeout(async () => {
                            await logout();
                            navigate('/login');
                        }, 2000);
                    }
                });
            }
        } catch (error) {
            const errorMessage = error.response?.data?.message || 'Error updating password';
            toast.error(errorMessage, {
                position: 'top-right',
                autoClose: 3000
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-[#7ED7C6] to-[#5fb3a5] relative pb-16">
            <ToastContainer />
            {/* Navigation Bar */}
            <nav className="bg-white/90 backdrop-blur-sm fixed w-full top-0 z-50 shadow-md">
                <div className="container mx-auto px-4 py-3">
                    <div className="flex justify-between items-center">
                        {/* Logo */}
                        <div className="flex items-center">
                            <Link to="/" className="text-3xl font-bold">
                                <span className="text-[#006B5E]">SAFE4</span>
                                <span className="text-black">LAW</span>
                            </Link>
                        </div>

                        {/* Navigation Links */}
                        <div className="hidden md:flex items-center space-x-8">
                            <Link to="/service" className="text-gray-800 hover:text-[#006B5E] font-semibold transition-colors">
                                Service
                            </Link>
                            <Link to="/about" className="text-gray-800 hover:text-[#006B5E] font-semibold transition-colors">
                                About us
                            </Link>
                            <button
                                onClick={handleLogout}
                                className="bg-[#F15A22] text-white px-6 py-2 rounded-lg font-semibold hover:bg-[#d14d1d] transition-all transform hover:scale-105"
                            >
                                Sign out
                            </button>
                            <div className="flex items-center space-x-2">
                                <FaUserCircle className="text-blue-800 text-3xl" />
                                <span className="text-gray-800 font-semibold">{userFullName}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Main Content */}
            <div className="container mx-auto px-4 pt-24">
                <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-8 mt-8">
                    <h2 className="text-3xl font-bold text-center mb-8">Update Password</h2>

                    {/* Profile Tabs */}
                    <div className="flex space-x-4 mb-8">
                        <button
                            onClick={() => navigate('/updateprofile')}
                            className="bg-gray-200 text-gray-800 px-6 py-2 rounded-md hover:bg-gray-300 transition-all"
                        >
                            Profile
                        </button>
                        <button className="bg-gray-500 text-white px-6 py-2 rounded-md cursor-pointer">
                            Password
                        </button>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* New Password Field */}
                        <div className="space-y-2">
                            <label className="text-xl font-medium">New Password</label>
                            <div className="relative">
                                <input
                                    type={showPassword.newPassword ? "text" : "password"}
                                    name="newPassword"
                                    placeholder="Enter new password"
                                    value={formData.newPassword}
                                    onChange={handleInputChange}
                                    className={`block w-full px-4 py-3 text-gray-900 placeholder-gray-500 border rounded-lg 
                                        ${errors.newPassword ? 'border-red-500 bg-red-50' : 'border-gray-300 bg-gray-50'} 
                                        focus:outline-none focus:ring-2 focus:ring-[#006B5E] focus:border-transparent`}
                                />
                                <button
                                    type="button"
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                    onClick={() => togglePasswordVisibility('newPassword')}
                                >
                                    {showPassword.newPassword ? <FaEyeSlash className="text-gray-500" /> : <FaEye className="text-gray-500" />}
                                </button>
                            </div>
                            {errors.newPassword && (
                                <p className="text-red-500 text-sm mt-1">{errors.newPassword}</p>
                            )}
                        </div>

                        {/* Confirm Password Field */}
                        <div className="space-y-2">
                            <label className="text-xl font-medium">Confirm New Password</label>
                            <div className="relative">
                                <input
                                    type={showPassword.confirmNewPassword ? "text" : "password"}
                                    name="confirmNewPassword"
                                    placeholder="Confirm new password"
                                    value={formData.confirmNewPassword}
                                    onChange={handleInputChange}
                                    className={`block w-full px-4 py-3 text-gray-900 placeholder-gray-500 border rounded-lg 
                                        ${errors.confirmNewPassword ? 'border-red-500 bg-red-50' : 'border-gray-300 bg-gray-50'} 
                                        focus:outline-none focus:ring-2 focus:ring-[#006B5E] focus:border-transparent`}
                                />
                                <button
                                    type="button"
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                    onClick={() => togglePasswordVisibility('confirmNewPassword')}
                                >
                                    {showPassword.confirmNewPassword ? <FaEyeSlash className="text-gray-500" /> : <FaEye className="text-gray-500" />}
                                </button>
                            </div>
                            {errors.confirmNewPassword && (
                                <p className="text-red-500 text-sm mt-1">{errors.confirmNewPassword}</p>
                            )}
                        </div>

                        {/* Update Button */}
                        <div className="flex justify-end pt-6">
                            <button
                                type="submit"
                                disabled={isLoading}
                                className={`px-8 py-3 rounded-full text-lg font-bold text-white
                                    ${isLoading 
                                        ? 'bg-gray-400 cursor-not-allowed' 
                                        : 'bg-[#006B5E] hover:bg-[#005347] transition-colors'}`}
                            >
                                {isLoading ? 'Updating...' : 'Update Password'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default UpdatePassword;