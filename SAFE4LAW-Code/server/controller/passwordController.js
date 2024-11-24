// controllers/passwordController.js
const bcrypt = require('bcryptjs');
const User = require('./userSchema');

const passwordController = {
    updatePassword: async (req, res) => {
        try {
            const { newPassword } = req.body;
            const userId = req.user.id; // From auth middleware

            // Hash the new password
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(newPassword, salt);

            // Update user's password
            await User.findByIdAndUpdate(userId, {
                password: hashedPassword
            });

            res.status(200).json({
                success: true,
                message: 'Password updated successfully'
            });

        } catch (error) {
            console.error('Password update error:', error);
            res.status(500).json({
                success: false,
                message: 'An error occurred while updating password'
            });
        }
    }
};

module.exports = passwordController;