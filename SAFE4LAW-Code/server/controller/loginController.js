const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('./userSchema');

const loginController = {
    login: async (req, res) => {
        try {
            const { email, password } = req.body;

            // Check if user exists
            const user = await User.findOne({ email });
            if (!user) {
                return res.status(401).json({
                    success: false,
                    message: 'Invalid email or password'
                });
            }

            // Verify password
            const isValidPassword = await bcrypt.compare(password, user.password);
            if (!isValidPassword) {
                return res.status(401).json({
                    success: false,
                    message: 'Invalid email or password'
                });
            }

            // Check if email is verified
            if (!user.isEmailVerified) {
                return res.status(403).json({
                    success: false,
                    message: 'Please verify your email before logging in'
                });
            }

            // Create JWT token
            const token = jwt.sign(
                { id: user._id, email: user.email },
                process.env.JWT_SECRET_KEY,
                { expiresIn: '15m' }
            );

            // Set cookie
            res.cookie('token', token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                maxAge: 15 * 60 * 1000 // Set cookie expiration to 15 minutes in milliseconds
            });

            res.status(200).json({
                success: true,
                message: 'Login successful',
                user: {
                    id: user._id,
                    email: user.email,
                    firstName: user.firstName,
                    lastName: user.lastName
                }
            });

        } catch (error) {
            console.error('Login error:', error);
            res.status(500).json({
                success: false,
                message: 'An error occurred during login'
            });
        }
    },

    logout: async (req, res) => {
        try {
            res.clearCookie('token');
            res.status(200).json({
                success: true,
                message: 'Logged out successfully'
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error logging out'
            });
        }
    }
};

module.exports = loginController;