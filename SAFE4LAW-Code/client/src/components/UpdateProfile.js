import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaUserCircle } from 'react-icons/fa';
import { useAuth } from '../contexts/AuthContext';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';

const UpdateProfile = () => {
    const { logout, user } = useAuth();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        gender: '',
        country: ''
    });
    const [initialFormData, setInitialFormData] = useState({});
    const [countries, setCountries] = useState([]);
    const [loading, setLoading] = useState(false);
    const userFullName = user ? `${user.firstName} ${user.lastName}` : 'Guest';

    useEffect(() => {
        // Check for JWT token and fetch initial data
        const initializeProfile = async () => {
            try {
                // Check authentication
                const authResponse = await axios.get('http://localhost:5000/api/check-auth', {
                    withCredentials: true
                });
                
                if (!authResponse.data.isAuthenticated) {
                    toast.error('Please login to access this page');
                    navigate('/login');
                    return;
                }

                // Fetch user profile
                await fetchUserProfile();
                // Fetch countries
                await fetchCountries();

            } catch (error) {
                toast.error('Authentication failed');
                navigate('/login');
            }
        };

        initializeProfile();
    }, [navigate]);

    const fetchUserProfile = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/profile', {
                withCredentials: true
            });
            const userData = response.data.user;
            const profileData = {
                firstName: userData.firstName || '',
                lastName: userData.lastName || '',
                email: userData.email || '',
                gender: userData.gender || '',
                country: userData.country || ''
            };
            
            setFormData(profileData);
            setInitialFormData(profileData);
        } catch (error) {
            toast.error('Error fetching profile data');
        }
    };

    const fetchCountries = async () => {
        try {
            const response = await fetch('https://restcountries.com/v3.1/all');
            const data = await response.json();
            setCountries(data.map(country => country.name.common).sort());
        } catch (error) {
            console.error("Error fetching countries:", error);
            toast.error('Error loading country list');
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        if (name !== 'email') { // Prevent email field from being edited
            setFormData(prev => ({
                ...prev,
                [name]: value
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Check if any field has been changed
        const hasChanges = Object.keys(formData).some(key => 
            key !== 'email' && formData[key] !== initialFormData[key]
        );

        if (!hasChanges) {
            toast.info('Please make at least one change to update', {
                position: "top-right",
                autoClose: 3000,
            });
            return;
        }

        setLoading(true);
        try {
            const response = await axios.put(
                'http://localhost:5000/api/profile/update',
                {
                    firstName: formData.firstName,
                    lastName: formData.lastName,
                    gender: formData.gender,
                    country: formData.country
                },
                { withCredentials: true }
            );

            if (response.data.success) {
                toast.success('Profile updated successfully', {
                    position: "top-right",
                    autoClose: 2000,
                });

                // Wait for toast to show before logout
                setTimeout(async () => {
                    await logout();
                    navigate('/login');
                }, 2000);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Error updating profile', {
                position: "top-right",
                autoClose: 3000,
            });
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = async () => {
        try {
            await logout();
            navigate('/');
        } catch (error) {
            toast.error('Error logging out');
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
                            <h1 className="text-3xl font-bold">
                                <span className="text-[#006B5E]">SAFE4</span>
                                <span className="text-black">LAW</span>
                            </h1>
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
                    <h2 className="text-3xl font-bold text-center mb-8 pb-4 border-b-4 border-gray-300">
                        User Profile
                    </h2>

                    {/* Profile Tabs */}
                    <div className="flex space-x-4 mb-8">
                        <div className="bg-gray-500 text-white px-6 py-2 rounded-md cursor-pointer">
                            Profile
                        </div>
                        <div
                            onClick={() => navigate('/updatepassword')}
                            className="bg-gray-200 text-gray-800 px-6 py-2 rounded-md cursor-pointer hover:bg-gray-300 transition-all"
                        >
                            Password
                        </div>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Name Fields */}
                        <div className="space-y-2">
                            <label className="text-xl font-medium">Name</label>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <input
                                    type="text"
                                    name="firstName"
                                    placeholder="First Name"
                                    value={formData.firstName}
                                    onChange={handleInputChange}
                                    className="block w-full px-4 py-3 text-gray-900 placeholder-gray-600 rounded-lg bg-gray-200 focus:outline-none focus:ring-2 focus:ring-[#000000] focus:border-transparent"
                                />
                                <input
                                    type="text"
                                    name="lastName"
                                    placeholder="Last Name"
                                    value={formData.lastName}
                                    onChange={handleInputChange}
                                    className="block w-full px-4 py-3 text-gray-900 placeholder-gray-600 rounded-lg bg-gray-200 focus:outline-none focus:ring-2 focus:ring-[#000000] focus:border-transparent"
                                />
                            </div>
                        </div>

                        {/* Email Field */}
                        <div className="space-y-2">
                            <label className="text-xl font-medium">Email</label>
                            <input
                                type="email"
                                name="email"
                                placeholder="example@gmail.com"
                                value={formData.email}
                                disabled
                                className="block w-full px-4 py-3 text-gray-900 placeholder-gray-600 rounded-lg bg-gray-300 cursor-not-allowed"
                            />
                            <p className="text-sm text-gray-500 mt-1">Email cannot be changed</p>
                        </div>

                        {/* Gender Dropdown */}
                        <div className="space-y-2">
                            <label className="text-xl font-medium">Gender</label>
                            <select
                                name="gender"
                                value={formData.gender}
                                onChange={handleInputChange}
                                className="block w-full px-4 py-3 text-gray-900 placeholder-gray-600 rounded-lg bg-gray-200 focus:outline-none focus:ring-2 focus:ring-[#000000] focus:border-transparent"
                            >
                                <option value="">Select Gender</option>
                                <option value="male">Male</option>
                                <option value="female">Female</option>
                                <option value="other">Other</option>
                            </select>
                        </div>

                        {/* Country Dropdown */}
                        <div className="space-y-2">
                            <label className="text-xl font-medium">Country</label>
                            <select
                                name="country"
                                value={formData.country}
                                onChange={handleInputChange}
                                className="block w-full px-4 py-3 text-gray-900 placeholder-gray-600 rounded-lg bg-gray-200 focus:outline-none focus:ring-2 focus:ring-[#000000] focus:border-transparent"
                            >
                                <option value="">Select Country</option>
                                {countries.map((country, index) => (
                                    <option key={index} value={country}>
                                        {country}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Update Button */}
                        <div className="flex justify-end pt-4">
                            <button
                                type="submit"
                                disabled={loading}
                                className={`bg-teal-700 text-white px-8 py-3 rounded-full text-lg font-bold hover:bg-[#00584e] transition-colors ${
                                    loading ? 'opacity-50 cursor-not-allowed' : ''
                                }`}
                            >
                                {loading ? 'UPDATING...' : 'UPDATE'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default UpdateProfile;