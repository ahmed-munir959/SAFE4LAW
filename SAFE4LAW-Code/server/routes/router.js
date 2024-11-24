// routes/router.js
const express = require('express');
const router = express.Router();
const userController = require('../controller/userController');
const loginController = require('../controller/loginController');
const profileController = require('../controller/profileController');
const passwordController = require('../controller/passwordController');
const rpController = require('../controller/rpController');
const fileUploadController = require('../controller/fileUploadController');


const auth = require('../middleware/auth');

// Public routes
router.post('/register', userController.registerUser);
router.get('/verify-email/:token', userController.verifyEmail);
router.post('/login', loginController.login);
router.post('/logout', loginController.logout);
// Add the getUsers route explicitly
router.get('/users', userController.getUsers);
router.post('/register', userController.registerUser);


router.get('/check-auth', auth, (req, res) => {
    try {
        // If auth middleware passes, user is authenticated
        res.json({ 
            isAuthenticated: true,
            user: req.user
        });
    } catch (error) {
        res.status(401).json({ 
            isAuthenticated: false,
            message: "Authentication failed"
        });
    }
});

// Profile routes
router.get('/profile', auth, profileController.getUserProfile);
router.put('/profile/update', auth, profileController.updateProfile);
router.put('/profile/password', auth, passwordController.updatePassword);


router.post('/forget-password', rpController.forgetPassword);
router.post('/verify-otp', rpController.verifyOTP);
router.post('/resend-otp', rpController.resendOTP);
router.post('/resetpassword', rpController.resetPassword);

// File upload routes
router.post('/file-upload', fileUploadController.uploadFiles);


module.exports = router;