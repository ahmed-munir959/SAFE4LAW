import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaTimes } from 'react-icons/fa';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Register = () => {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        gender: '',
        country: '',
        password: '',
        confirmPassword: '',
    });
    const [errors, setErrors] = useState({});
    const [countries, setCountries] = useState([]);
    const [submitError, setSubmitError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        fetch('https://restcountries.com/v3.1/all')
            .then(response => response.json())
            .then(data => {
                const countryList = data.map(country => country.name.common);
                setCountries(countryList.sort());
            })
            .catch(error => console.error('Error fetching countries:', error));
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const validate = () => {
        const newErrors = {};
        const emailPattern = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;
        const passwordPattern = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/;

        if (!formData.firstName) newErrors.firstName = 'First name is required';
        if (!formData.lastName) newErrors.lastName = 'Last name is required';
        if (!formData.email) newErrors.email = 'Email is required';
        else if (!emailPattern.test(formData.email)) newErrors.email = 'Invalid email address';

        if (!formData.gender) newErrors.gender = 'Gender is required';
        if (!formData.country) newErrors.country = 'Country is required';

        if (!formData.password) newErrors.password = 'Password is required';
        else if (!passwordPattern.test(formData.password)) {
            newErrors.password = 'Password must be at least 8 characters, include a capital letter, a number, and a special character';
        }

        if (formData.confirmPassword !== formData.password) {
            newErrors.confirmPassword = 'Passwords do not match';
        }

        return newErrors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const validationErrors = validate();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        try {
            const response = await axios.post('http://localhost:5000/api/register', {
                firstName: formData.firstName,
                lastName: formData.lastName,
                email: formData.email,
                gender: formData.gender,
                country: formData.country,
                password: formData.password
            });

            if (response.status === 201) {
                // Show email verification toast
                toast.info('Email sent for verification. Please check your inbox!', {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });

                // Clear form and errors
                setFormData({
                    firstName: '',
                    lastName: '',
                    email: '',
                    gender: '',
                    country: '',
                    password: '',
                    confirmPassword: '',
                });
                setErrors({});
                setSubmitError('');
            }
        } catch (error) {
            console.error('Registration error:', error);
            setSubmitError(error.response?.data?.message || 'Registration failed. Please try again.');
        }
    };

    return (
        <div className="min-h-screen bg-[#62CBCB] flex items-center justify-center p-4">
            <div className="w-full max-w-3xl bg-white shadow-lg rounded-lg p-8">
                <div className="flex justify-end">
                    <FaTimes className="text-gray-600 cursor-pointer text-2xl" onClick={() => navigate('/')} />
                </div>

                <div className="flex items-center border-b-4 border-gray-300 pb-4">
                    <h1 className="text-4xl font-bold text-[#006B5E]">SAFE4</h1>
                    <h1 className="text-4xl font-bold text-black">LAW</h1>
                </div>

                <div className="flex items-center space-x-4 mt-8">
                    <button className="bg-[#F15A22] text-white py-2 px-6 rounded-tl-lg rounded-bl-lg text-lg font-semibold">Register</button>
                    <Link to="/login" className="bg-[#d9d9d9] py-2 px-6 rounded-tr-lg rounded-br-lg text-lg font-semibold">Login</Link>
                </div>

                <form onSubmit={handleSubmit} className="mt-8 space-y-6">
                    {submitError && (
                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
                            {submitError}
                        </div>
                    )}
                    <h2 className="text-2xl font-bold text-center mb-6">REGISTRATION FORM</h2>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        {/* Name */}
                        <div>
                            <label className="block text-lg font-semibold">First Name</label>
                            <input
                                type="text"
                                name="firstName"
                                placeholder="First Name"
                                value={formData.firstName}
                                onChange={handleChange}
                                className="w-full p-3 mt-1 border border-gray-300 rounded-lg"
                            />
                            {errors.firstName && <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>}
                        </div>
                        <div>
                            <label className="block text-lg font-semibold">Last Name</label>
                            <input
                                type="text"
                                name="lastName"
                                placeholder="Last Name"
                                value={formData.lastName}
                                onChange={handleChange}
                                className="w-full p-3 mt-1 border border-gray-300 rounded-lg"
                            />
                            {errors.lastName && <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>}
                        </div>

                        {/* Email */}
                        <div className="sm:col-span-2">
                            <label className="block text-lg font-semibold">Email</label>
                            <input
                                type="email"
                                name="email"
                                placeholder="example@gmail.com"
                                value={formData.email}
                                onChange={handleChange}
                                className="w-full p-3 mt-1 border border-gray-300 rounded-lg"
                            />
                            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                        </div>

                        {/* Gender */}
                        <div>
                            <label className="block text-lg font-semibold">Gender</label>
                            <select
                                name="gender"
                                value={formData.gender}
                                onChange={handleChange}
                                className="w-full p-3 mt-1 border border-gray-300 rounded-lg"
                            >
                                <option value="">Select Gender</option>
                                <option value="male">Male</option>
                                <option value="female">Female</option>
                                <option value="other">Other</option>
                            </select>
                            {errors.gender && <p className="text-red-500 text-sm mt-1">{errors.gender}</p>}
                        </div>

                        {/* Country */}
                        <div>
                            <label className="block text-lg font-semibold">Country</label>
                            <select
                                name="country"
                                value={formData.country}
                                onChange={handleChange}
                                className="w-full p-3 mt-1 border border-gray-300 rounded-lg"
                            >
                                <option value="">Select Country</option>
                                {countries.map((country) => (
                                    <option key={country} value={country}>
                                        {country}
                                    </option>
                                ))}
                            </select>
                            {errors.country && <p className="text-red-500 text-sm mt-1">{errors.country}</p>}
                        </div>

                        {/* Password */}
                        <div>
                            <label className="block text-lg font-semibold">Password</label>
                            <input
                                type="password"
                                name="password"
                                placeholder="must be at least 8 characters"
                                value={formData.password}
                                onChange={handleChange}
                                className="w-full p-3 mt-1 border border-gray-300 rounded-lg"
                            />
                            {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
                        </div>

                        {/* Confirm Password */}
                        <div>
                            <label className="block text-lg font-semibold">Confirm Password</label>
                            <input
                                type="password"
                                name="confirmPassword"
                                placeholder="Confirm Password"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                className="w-full p-3 mt-1 border border-gray-300 rounded-lg"
                            />
                            {errors.confirmPassword && <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>}
                        </div>
                    </div>

                    <div className="text-center">
                        <button
                            type="submit"
                            className="w-full sm:w-auto bg-[#006B5E] text-white font-bold text-xl px-8 py-4 rounded-full hover:bg-[#00584e] transition-transform transform hover:scale-105"
                        >
                            REGISTER
                        </button>
                    </div>
                </form>

                {/* Toast container to show the notifications */}
                <ToastContainer />
            </div>
        </div>
    );
};

export default Register;
