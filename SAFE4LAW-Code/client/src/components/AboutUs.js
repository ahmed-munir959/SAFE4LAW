import React from "react";
import { Link } from "react-router-dom";
import {
  FaShieldAlt,
  FaCloudUploadAlt,
  FaUserLock,
  FaUserCircle,
} from "react-icons/fa";

const AboutUs = ({ userFullName = "User Name" }) => {
  return (
    <div className="h-[100vh] w-full bg-gradient-to-b from-[#7ED7C6] to-[#5fb3a5] overflow-hidden flex flex-col justify-between">
      {/* Header Section */}
      <nav className="bg-white/90 backdrop-blur-sm relative w-full top-0 z-50 shadow-md">
        <div className="container mx-auto px-4 py-3">
          <div className="flex justify-between items-center">
            {/* Logo */}
            <div className="flex items-center">
              <h1 className="text-3xl font-bold">
                <span className="text-[#004C40]">SAFE4</span>
                <span className="text-[#2C2C2C]">LAW</span>
              </h1>
            </div>
            {/* Navigation Links */}
            <div className="hidden md:flex items-center space-x-8">
              <Link
                to="/service"
                className="text-[#2C2C2C] font-extrabold transition-colors"
              >
                Service
              </Link>
              <Link
                to="/about"
                className="text-[#004C40] hover:text-[#006B5E] font-semibold transition-colors"
              >
                About us
              </Link>
              <Link
                to="/signout"
                className="bg-[#F15A22] text-white px-6 py-2 rounded-lg font-semibold hover:bg-[#d14d1d] transition-all transform hover:scale-105"
              >
                Sign out
              </Link>
              <div className="flex items-center space-x-2 cursor-pointer">
                <FaUserCircle className="text-[#1A237E] text-3xl" />
                <span className="text-[#2C2C2C] font-semibold">
                  {userFullName}
                </span>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content Section */}
      <div className="flex-grow flex justify-center items-center pb-8">
        <div className="w-full max-w-[90%] bg-[#A4D6E1] shadow-lg rounded-lg text-[#2C2C2C] p-6 md:p-8 grid grid-cols-1 md:grid-cols-2 gap-6 relative">
          {/* Key Features Section */}
          <div>
            <h2 className="text-3xl font-bold text-center mb-4 text-[#004C40]">
              About Safe4Law
            </h2>
            <p className="text-lg leading-relaxed mb-6">
              Safe4Law is a secure file sharing system designed specifically for
              Pakistan's legal community. With a focus on protecting sensitive
              legal documents, it combines advanced cryptographic algorithms
              like AES, 3DES, and RC6 along with steganography using the LSB
              method.
            </p>

            <div className="mb-6">
              <h3 className="text-2xl font-semibold mb-4 text-[#004C40]">
                Key Features
              </h3>
              <ul className="list-disc list-inside space-y-3 pl-5">
                <li className="flex items-center">
                  <FaShieldAlt className="text-[#1A237E] text-xl mr-2" />
                  Hybrid Cryptography: AES, 3DES, and RC6 for high security
                </li>
                <li className="flex items-center">
                  <FaUserLock className="text-[#1A237E] text-xl mr-2" />
                  User Accounts and Access Control: Manage permissions securely
                </li>
                <li className="flex items-center">
                  <FaCloudUploadAlt className="text-[#1A237E] text-xl mr-2" />
                  Secure File Upload & Download: Ensures confidentiality and
                  integrity
                </li>
                <li className="flex items-center">
                  <span className="inline-block mr-2">🔐</span>
                  Multi-Factor Authentication (MFA) for enhanced login security
                </li>
                <li className="flex items-center">
                  <span className="inline-block mr-2">🕒</span>
                  File Expiration with self-destruction option for temporary
                  access
                </li>
                <li className="flex items-center">
                  <span className="inline-block mr-2">👁</span>
                  Secure File Preview with watermarked content
                </li>
              </ul>
            </div>
          </div>

          {/* Image Section */}
          <div className="flex justify-center items-center overflow-hidden">
            <img
              src="https://img.freepik.com/free-vector/backup-concept-illustration_114360-28619.jpg?semt=ais_hybrid"
              alt="Secure file sharing illustration"
              className="rounded-lg shadow-lg max-w-full h-auto object-contain max-h-[400px] md:max-h-[500px]"
            />
          </div>

          {/* Call to Action Button Positioned Slightly Higher and to the Left */}
          <div className="absolute bottom-8 left-1/4 w-full text-left">
            <Link
              to="/signup"
              className="bg-[#F15A22] text-white px-8 py-4 text-lg rounded-lg hover:bg-[#d14d1d] transition-all transform hover:scale-105"
            >
              Join Us Today
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;