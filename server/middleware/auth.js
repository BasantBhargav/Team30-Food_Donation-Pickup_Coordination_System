const jwt = require('jsonwebtoken');

/**
 * Authentication Middleware
 * Checks for JWT in the request header 'x-auth-token'
 * Verifies token and attaches decoded user data to req.user
 */
module.exports = function (req, res, next) {

    // -----------------------------------------
    // 1. Extract token from headers
    // -----------------------------------------
    const token = req.header('x-auth-token');

    // If token not provided
    if (!token) {
        return res.status(401).json({
            success: false,
            error: 'Access denied. No token provided.',
            message: 'You must include a valid authentication token.'
        });
    }

    // -----------------------------------------
    // 2. Validate and decode token
    // -----------------------------------------
    try {
        // If secret key is missing
        if (!process.env.JWT_SECRET) {
            console.error("\n❌ ERROR: JWT_SECRET is not defined in environment variables.\n");
            return res.status(500).json({
                success: false,
                error: "Server misconfiguration",
                message: "JWT secret key is missing in server environment."
            });
        }

        // Verify and decode token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Attach user info to request object
        req.user = decoded.user || decoded;

        // Continue to next middleware/controller
        next();

    } catch (err) {

        // -----------------------------------------
        // 3. Token verification failed
        // -----------------------------------------
        console.error("❌ Invalid Token Error:", err.message);

        return res.status(401).json({
            success: false,
            error: "Invalid Token",
            message: "Provided token is invalid or expired. Please login again."
        });
    }
};
