const nodemailer = require('nodemailer');
const bcrypt = require('bcryptjs');
const User = require('./userSchema');
const OtpModel = require('./Otp');
const OTPAttempt = require('./OTPAttempt');

// Constants
const OTP_EXPIRY_TIME = 2 * 60 * 1000; // 2 minutes in milliseconds
const MAX_OTP_ATTEMPTS = 3;

const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// Email transporter configuration
// const transporter = nodemailer.createTransport({
//     host: 'smtp.ethereal.email',
//     port: 587,
//     auth: {
//         user: 'hailee.casper8@ethereal.email',
//         pass: 'GqUdPVKf1YhAcrs516'
//     }
// });

// Generate 4-digit OTP
const generateOTP = () => Math.floor(1000 + Math.random() * 9000).toString();

// Send OTP email
const sendOTPEmail = async (email, otp) => {
    const mailOptions = {
        from: 'process.env.EMAIL_USER',
        to: email,
        subject: 'Password Reset OTP',
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2 style="color: #006B5E;">Safe4Law Password Reset</h2>
                <p>Your OTP for password reset is:</p>
                <h1 style="color: #F15A22; font-size: 32px; letter-spacing: 5px;">${otp}</h1>
                <p>This OTP will expire in 2 minutes.</p>
                <p>If you didn't request this password reset, please ignore this email.</p>
                <div style="margin-top: 20px; padding: 10px; background-color: #f8f9fa; border-radius: 5px;">
                    <p style="margin: 0; color: #666;">For security reasons:</p>
                    <ul style="color: #666;">
                        <li>This OTP is valid for 2 minutes only</li>
                        <li>Previous OTP will be invalidated when requesting a new one</li>
                    </ul>
                </div>
            </div>
        `
    };

    try {
        await transporter.sendMail(mailOptions);
        return true;
    } catch (error) {
        console.error('Email sending error:', error);
        return false;
    }
};

// Check OTP attempts
const checkOTPAttempts = async (email) => {
    try {
        const recentAttempts = await OTPAttempt.find({
            email,
            createdAt: { $gte: new Date(Date.now() - OTP_EXPIRY_TIME) }
        });
        return recentAttempts.length;
    } catch (error) {
        console.error('Check OTP attempts error:', error);
        return MAX_OTP_ATTEMPTS; // Return max attempts on error to prevent further attempts
    }
};

// Handle forget password request
exports.forgetPassword = async (req, res) => {
    try {
        const { email } = req.body;

        // Validate email
        if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            return res.status(400).json({
                success: false,
                message: 'Please provide a valid email address'
            });
        }

        // Check if user exists
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'Email is not registered'
            });
        }

        // Check OTP attempts
        const attemptCount = await checkOTPAttempts(email);
        if (attemptCount >= MAX_OTP_ATTEMPTS) {
            return res.status(429).json({
                success: false,
                message: 'Too many OTP requests. Please try again after 2 minutes.'
            });
        }

        // Generate new OTP and set expiry
        const otp = generateOTP();
        const expiryTime = new Date(Date.now() + OTP_EXPIRY_TIME);

        // Invalidate previous OTPs
        await OtpModel.updateMany(
            { email, isUsed: false },
            { isUsed: true }
        );

        // Save new OTP
        await OtpModel.create({
            email,
            otp,
            expiresAt: expiryTime
        });

        // Record attempt
        await OTPAttempt.create({ email });

        // Send OTP email
        const emailSent = await sendOTPEmail(email, otp);
        if (!emailSent) {
            return res.status(500).json({
                success: false,
                message: 'Failed to send OTP email. Please try again.'
            });
        }

        res.status(200).json({
            success: true,
            message: 'OTP has been sent to your email'
        });

    } catch (error) {
        console.error('Forget password error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};

// Verify OTP
exports.verifyOTP = async (req, res) => {
    try {
        const { email, otp } = req.body;

        // Validate inputs
        if (!email || !otp) {
            return res.status(400).json({
                success: false,
                message: 'Email and OTP are required'
            });
        }

        // Find valid OTP
        const otpRecord = await OtpModel.findOne({
            email,
            otp,
            expiresAt: { $gt: new Date() },
            isUsed: false
        }).sort({ createdAt: -1 });

        if (!otpRecord) {
            return res.status(400).json({
                success: false,
                message: 'Invalid or expired OTP'
            });
        }

        // Mark OTP as used
        otpRecord.isUsed = true;
        await otpRecord.save();

        res.status(200).json({
            success: true,
            message: 'OTP verified successfully'
        });

    } catch (error) {
        console.error('OTP verification error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};

// Resend OTP
exports.resendOTP = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({
                success: false,
                message: 'Email is required'
            });
        }

        // Check if user exists
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'Email is not registered'
            });
        }

        // Check OTP attempts
        const attemptCount = await checkOTPAttempts(email);
        if (attemptCount >= MAX_OTP_ATTEMPTS) {
            return res.status(429).json({
                success: false,
                message: 'Too many OTP requests. Please try again after 2 minutes.'
            });
        }

        // Invalidate previous OTPs
        await OtpModel.updateMany(
            { email, isUsed: false },
            { isUsed: true }
        );

        // Generate and save new OTP
        const otp = generateOTP();
        const expiryTime = new Date(Date.now() + OTP_EXPIRY_TIME);

        await OtpModel.create({
            email,
            otp,
            expiresAt: expiryTime
        });

        // Record attempt
        await OTPAttempt.create({ email });

        // Send new OTP
        const emailSent = await sendOTPEmail(email, otp);
        if (!emailSent) {
            return res.status(500).json({
                success: false,
                message: 'Failed to send OTP email. Please try again.'
                
            });
        }

        res.status(200).json({
            success: true,
            message: 'New OTP has been sent to your email'
        });

    } catch (error) {
        console.error('Resend OTP error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};

exports.resetPassword = async (req, res) => {
    try {
        const { email, newPassword } = req.body;

        // Validate input
        if (!email || !newPassword) {
            return res.status(400).json({
                success: false,
                message: 'Email and new password are required'
            });
        }

        // Validate password format
        const passwordRegex = /^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])[A-Za-z0-9!@#$%^&*]{8,}$/;
        if (!passwordRegex.test(newPassword)) {
            return res.status(400).json({
                success: false,
                message: 'Password must be at least 8 characters long and include a capital letter, number, and special character'
            });
        }

        // Find user
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        // Hash new password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        // Update password
        user.password = hashedPassword;
        await user.save();

        // Clear any remaining OTPs for this user
        await OtpModel.updateMany(
            { email },
            { isUsed: true }
        );

        res.status(200).json({
            success: true,
            message: 'Password reset successful'
        });

    } catch (error) {
        console.error('Reset password error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};

module.exports = exports;