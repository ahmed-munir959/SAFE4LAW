const mongoose = require('mongoose');

const otpAttemptSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: 120 // Document will be automatically deleted after 120 seconds
    }
});

module.exports = mongoose.model('OTPAttempt', otpAttemptSchema);