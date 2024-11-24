import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import law1 from '../assets/law1.jpg';
import law8 from '../assets/law8.jpg';
import law3 from '../assets/law3.jpg';

const Home = () => {
    const [currentSlide, setCurrentSlide] = useState(0);

    // Array of image paths
    const slides = [law1, law8,law3];

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % slides.length);
        }, 4000);

        // Cleanup timer on unmount
        return () => clearInterval(timer);
    }, [slides.length]);

    return (
        <div className="min-h-screen bg-gradient-to-b from-[#7ED7C6] to-[#5fb3a5]">
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
                            <Link to="/" className="text-gray-800 font-extrabold transition-colors">
                                Home
                            </Link>
                            <Link to="/about" className="text-gray-800 hover:text-[#006B5E] font-semibold transition-colors">
                                About us
                            </Link>
                            <Link
                                to="/login"
                                className="bg-[#F15A22] text-white px-6 py-2 rounded-lg font-semibold hover:bg-[#d14d1d] transition-all transform hover:scale-105"
                            >
                                LOGIN
                            </Link>
                        </div>

                        {/* Mobile Menu Button */}
                        <div className="md:hidden">
                            <button className="text-gray-800 hover:text-[#006B5E]">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Main Content */}
            <div className="container mx-auto px-4 pt-24">
                <div className="flex flex-col lg:flex-row items-center justify-between min-h-[calc(100vh-6rem)] gap-12 py-12">
                    {/* Left Content */}
                    <div className="flex-1 text-center lg:text-left">
                        <div className="space-y-6 max-w-xl mx-auto lg:mx-0">
                            <h1 className="text-4xl lg:text-6xl font-bold text-white drop-shadow-lg leading-tight">
                                Secure File
                                <br />
                                Sharing for your
                                <br />
                                Document
                            </h1>
                            <p className="text-xl font-semibold text-gray-800">
                                All your Legal Files are protected
                            </p>
                            <div>
                                <Link
                                    to="/register"
                                    className="inline-block bg-[#006B5E] text-white px-8 py-4 rounded-full text-xl font-semibold hover:bg-[#005a4f] transition-all transform hover:scale-105 hover:shadow-lg"
                                >
                                    Free Sign up
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* Right Content - Slideshow */}
                    <div className="flex-1 w-full max-w-2xl">
                        <div className="bg-white rounded-3xl shadow-2x1 transform hover:scale-[1.02] transition-all duration-300">
                            <div className="relative h-[400px] overflow-hidden rounded-2xl">
                                {slides.map((slide, index) => (
                                    <div
                                        key={index}
                                        className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${currentSlide === index ? 'opacity-100' : 'opacity-0'
                                            }`}
                                    >
                                        <img
                                            src={slide}
                                            alt={`Law presentation ${index + 1}`}
                                            className="w-full h-full object-cover"
                                        />
                                        {/* Overlay */}
                                        <div className="absolute inset-0 bg-black/10"></div>
                                    </div>
                                ))}

                                {/* Slide Indicators */}
                                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                                    {slides.map((_, index) => (
                                        <button
                                            key={index}
                                            className={`w-2 h-2 rounded-full transition-all ${currentSlide === index ? 'bg-white w-4' : 'bg-white/50'
                                                }`}
                                            onClick={() => setCurrentSlide(index)}
                                        />
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Background Decoration */}
            <div className="fixed inset-0 -z-10 overflow-hidden">
                <div className="absolute -top-1/2 -right-1/2 w-full h-full bg-[#7ED7C6]/20 rounded-full blur-3xl"></div>
                <div className="absolute -bottom-1/2 -left-1/2 w-full h-full bg-[#006B5E]/20 rounded-full blur-3xl"></div>
            </div>
        </div>
    );
};

export default Home;
