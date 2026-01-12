
const authorize = (roles = []) => {
    return (req, res, next) => {
        // req.user is usually set by your JWT verify middleware
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ message: "Access Denied: Unauthorized Role" });
        }
        next();
    };
};

module.exports = authorize;