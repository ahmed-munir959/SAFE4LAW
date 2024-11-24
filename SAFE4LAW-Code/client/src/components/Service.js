import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaUserCircle } from 'react-icons/fa';
import { AiOutlineUpload, AiOutlineDownload } from 'react-icons/ai';
import { BsCardList } from 'react-icons/bs';
import law4 from '../assets/law4.png';
import law7 from '../assets/law7.jpg';
import { useAuth } from '../contexts/AuthContext';

const Services = () => {
    const { logout, user } = useAuth();
    const [currentSlide, setCurrentSlide] = useState(0);
    const navigate = useNavigate();

    const userFullName = user ? `${user.firstName} ${user.lastName}` : 'Guest';

    const slides = [law4, law7];

    const handleLogout = async () => {
        await logout();
        navigate('/');
    };

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % slides.length);
        }, 4000);

        return () => clearInterval(timer);
    }, [slides.length]);

    // Service card data with routes
    const serviceCards = [
        {
            icon: AiOutlineUpload,
            title: "File Upload",
            description: "Upload your legal documents securely and easily.",
            route: "/fileupload"
        },
        {
            icon: AiOutlineDownload,
            title: "File Download",
            description: "Download your files anytime, anywhere with confidence.",
            route: "/filedownload"
        },
        {
            icon: BsCardList,
            title: "File Listing",
            description: "View and manage all your uploaded files in one place.",
            route: "/filelisting"
        }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-b from-[#7ED7C6] to-[#5fb3a5] relative pb-16">
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
                            <Link to="/service" className="text-gray-800 font-extrabold transition-colors">
                                Service
                            </Link>
                            <Link to="/about" className="text-gray-800 hover:text-[#006B5E] font-semibold transition-colors">
                                About us
                            </Link>
                            <Link
                                onClick={handleLogout}
                                className="bg-[#F15A22] text-white px-6 py-2 rounded-lg font-semibold hover:bg-[#d14d1d] transition-all transform hover:scale-105"
                            >
                                Sign out
                            </Link>
                            {/* Profile Icon with User Name */}
                            <div
                                className="flex items-center space-x-2 cursor-pointer"
                                onClick={() => navigate('/updateprofile')}
                            >
                                <FaUserCircle className="text-blue-800 text-3xl" />
                                <span className="text-gray-800 font-semibold">{userFullName}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Main Content */}
            <div className="pt-16">
                <div className="flex flex-col items-center justify-between min-h-[calc(100vh-6rem)] gap-12">
                    {/* Slideshow */}
                    <div className="w-full">
                        <div className="relative h-[500px] w-full">
                            {slides.map((slide, index) => (
                                <div
                                    key={index}
                                    className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${currentSlide === index ? 'opacity-100' : 'opacity-0'
                                        }`}
                                >
                                    <img
                                        src={slide}
                                        alt="Law Vault"
                                        className="w-full h-full object-cover"
                                    />
                                    {/* Overlay Text */}
                                    <div className="absolute inset-0 bg-black/40 flex flex-col justify-center items-center text-white text-center space-y-4">
                                        <h2 className="text-4xl font-extrabold transform transition-all duration-700 ease-in-out hover:scale-110">Your trusted vault for sensitive legal files</h2>
                                        <p className="text-3xl">Secure today, secured tomorrow</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Our Services Section */}
                    <div className="container mx-auto px-4">
                        <div className="text-center font-barlow">
                            <h2 className="text-5xl font-bold mb-4">Our Services</h2>
                            <p className="text-xl font-semibold text-gray-700">The trusted vault for legal professionals - secure, simple, safe</p>
                        </div>

                        {/* Services Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8 text-center">
                            {serviceCards.map((service, index) => (
                                <div
                                    key={index}
                                    onClick={() => navigate(service.route)}
                                    className="bg-white p-6 rounded-lg shadow-lg transform transition-all duration-300 
                                             hover:scale-105 hover:bg-[#006B5E] hover:text-white cursor-pointer group"
                                >
                                    <service.icon className="text-6xl text-[#006B5E] mx-auto mb-4 group-hover:text-white transition-colors" />
                                    <h3 className="text-xl font-bold">{service.title}</h3>
                                    <p className="text-gray-700 group-hover:text-white/90 transition-colors">{service.description}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Copyright Footer */}
            <footer className="absolute bottom-0 w-full py-2">
                <div className="container mx-auto px-4">
                    <p className="text-white text-center font-semibold text-lg tracking-wide">
                        Copyright © 2024 SAFE4LAW. All rights reserved.
                    </p>
                </div>
            </footer>

            {/* Background Decoration */}
            <div className="fixed inset-0 -z-10 overflow-hidden">
                <div className="absolute -top-1/2 -right-1/2 w-full h-full bg-[#7ED7C6]/20 rounded-full blur-3xl"></div>
                <div className="absolute -bottom-1/2 -left-1/2 w-full h-full bg-[#006B5E]/20 rounded-full blur-3xl"></div>
            </div>
        </div>
    );
};

export default Services;