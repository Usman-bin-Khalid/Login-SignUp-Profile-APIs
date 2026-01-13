// middleware/auth.js
const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    // Standard Bearer Token check
    const token = req.header('Authorization')?.split(' ')[1];
    
    if (!token) return res.status(401).json({ message: "No token, authorization denied" });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // This 'decoded' object must have { id, role } 
        // which you set when signing the token
        req.user = decoded; 
        
        next();
    } catch (err) {
        res.status(401).json({ message: "Token is not valid" });
    }
};