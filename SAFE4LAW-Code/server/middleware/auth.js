const jwt = require('jsonwebtoken');

const auth = async (req, res, next) => {
    try {
        const token = req.cookies.token;
        
        if (!token) {
            return res.status(401).json({
                isAuthenticated: false,
                message: "Access Denied. No token provided...!!!"
            });
        }

        const verified = jwt.verify(token, process.env.JWT_SECRET_KEY);
        req.user = verified;
        next();

    } catch (error) {
        res.status(401).json({
            isAuthenticated: false,
            message: "Invalid Token"
        });
    }
};

module.exports = auth;