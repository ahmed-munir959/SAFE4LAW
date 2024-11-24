const User = require('./userSchema');

const profileController = {
    updateProfile: async (req, res) => {
        try {
            const { firstName, lastName, gender, country } = req.body;
            const userId = req.user.id;

            // Check if at least one field is provided for update
            if (!firstName && !lastName && !gender && !country) {
                return res.status(400).json({
                    success: false,
                    message: 'Please provide at least one field to update'
                });
            }

            // Create update object with only provided fields
            const updateFields = {};
            if (firstName) updateFields.firstName = firstName;
            if (lastName) updateFields.lastName = lastName;
            if (gender) updateFields.gender = gender;
            if (country) updateFields.country = country;

            const updatedUser = await User.findByIdAndUpdate(
                userId,
                { $set: updateFields },
                { new: true, runValidators: true }
            );

            if (!updatedUser) {
                return res.status(404).json({
                    success: false,
                    message: 'User not found'
                });
            }

            res.status(200).json({
                success: true,
                message: 'Profile updated successfully',
                user: {
                    id: updatedUser._id,
                    email: updatedUser.email,
                    firstName: updatedUser.firstName,
                    lastName: updatedUser.lastName,
                    gender: updatedUser.gender,
                    country: updatedUser.country
                }
            });

        } catch (error) {
            console.error('Profile update error:', error);
            res.status(500).json({
                success: false,
                message: 'An error occurred while updating profile'
            });
        }
    },

    getUserProfile: async (req, res) => {
        try {
            const userId = req.user.id;
            const user = await User.findById(userId);

            if (!user) {
                return res.status(404).json({
                    success: false,
                    message: 'User not found'
                });
            }

            res.status(200).json({
                success: true,
                user: {
                    id: user._id,
                    email: user.email,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    gender: user.gender,
                    country: user.country
                }
            });

        } catch (error) {
            console.error('Get profile error:', error);
            res.status(500).json({
                success: false,
                message: 'An error occurred while fetching profile'
            });
        }
    }
};

module.exports = profileController;