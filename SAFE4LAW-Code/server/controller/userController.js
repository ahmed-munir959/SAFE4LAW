//userController.js
const bcrypt = require('bcrypt');
const User = require('./userSchema');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const dotenv = require('dotenv');
dotenv.config();

const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// Create nodemailer transporter
// const transporter = nodemailer.createTransport({
//     host: 'smtp.ethereal.email',
//     port: 587,
//     auth: {
//         user: 'hailee.casper8@ethereal.email',
//         pass: 'GqUdPVKf1YhAcrs516'
//     }
// });

const userController = {
    // Register a new user
    registerUser: async (req, res) => {
        try {
            const { firstName, lastName, email, gender, country, password } = req.body;

            // Check if user already exists
            const existingUser = await User.findOne({ email });
            if (existingUser) {
                return res.status(400).json({ message: 'User with this email already exists' });
            }

            // Generate verification token
            const verificationToken = crypto.randomBytes(32).toString('hex');

            // Hash the password
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);

            // Create new user
            const newUser = new User({
                firstName,
                lastName,
                email,
                gender,
                country,
                password: hashedPassword,
                verificationToken,
                isEmailVerified: false
            });

            // Save user to database
            await newUser.save();

            // Send verification email
            const verificationLink = `${process.env.FRONTEND_URL}/verify-email/${verificationToken}`;
            const mailOptions = {
                from: process.env.EMAIL_USER,
                to: email,
                subject: 'Verify Your Email',
                html: `
                    <h1>Email Verification</h1>
                    <p>Please click the link below to verify your email:</p>
                    <a href="${verificationLink}">Verify Email</a>
                `
            };

            await transporter.sendMail(mailOptions);

            res.status(201).json({
                message: 'User registered successfully. Please check your email for verification.',
                user: {
                    firstName: newUser.firstName,
                    lastName: newUser.lastName,
                    email: newUser.email,
                    gender: newUser.gender,
                    country: newUser.country
                }
            });
        } catch (error) {
            console.error('Registration error:', error);
            res.status(500).json({ message: 'Error registering user', error: error.message });
        }
    },

    // Verify email
    verifyEmail: async (req, res) => {
        try {
            const { token } = req.params;
    
            // Attempt to verify the user by finding and updating in one step
            const updateResult = await User.updateOne(
                { verificationToken: token },
                { $unset: { verificationToken: "" }, $set: { isEmailVerified: true } }
            );
    
            if (updateResult.modifiedCount > 0) {
                // Token was found and removed, verification successful
                return res.status(200).json({ message: 'Email verified successfully!' });
            }
    
            // Token was not found, verification failed
            return res.status(200).json({ message: 'Verification failed: invalid or expired token.' });
            
        } catch (error) {
            console.error('Verification error:', error);
            res.status(500).json({ message: 'Error verifying email', error: error.message });
        }
    },

     // Get users data
     getUsers: async (req, res) => {
        try {
            const users = await User.find({}, { _id: 1, firstName: 1, lastName: 1 }); // Fetch only _id, firstName, and lastName
            // Set proper headers
            res.setHeader('Content-Type', 'application/json');
            res.status(200).json(users); 
        } catch (error) {
            console.error('Error fetching users:', error);
            res.status(500).json({ message: 'Failed to fetch users data', error: error.message });
        }
    }

};

module.exports = userController;