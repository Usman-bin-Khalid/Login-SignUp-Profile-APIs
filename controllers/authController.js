const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// SIGN UP
exports.signup = async (req, res) => {
    const { email, password, confirmPassword, fullName } = req.body;
    if (password !== confirmPassword) return res.status(400).json({ msg: "Passwords do not match" });

    try {
        let user = await User.findOne({ email });
        if (user) return res.status(400).json({ msg: "User already exists" });

        const hashedPassword = await bcrypt.hash(password, 10);
        user = new User({ email, password: hashedPassword, fullName });
        await user.save();

        res.status(201).json({status : 1, msg: "User registered successfully" , user});
    } catch (err) { res.status(500).send("Server Error"); }
};




// LOGIN
exports.login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ msg: "Invalid Credentials" });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ msg: "Invalid Credentials" });

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.json({ token, user: { id: user._id, fullName: user.fullName, email: user.email } });
    } catch (err) { res.status(500).send("Server Error"); }
};



// COMPLETE PROFILE
exports.completeProfile = async (req, res) => {
    const { name, dob, country, gender } = req.body;
    
    try {
        // req.file is populated by multer
        const profileImageUrl = req.file ? req.file.path : ""; 

        const user = await User.findByIdAndUpdate(
            req.user.id, 
            {  
                fullName: name, 
                profileImage: profileImageUrl, // Store the Cloudinary URL
                dob, 
                country, 
                gender, 
                isProfileComplete: true 
            },
            { new: true }
        );
        res.json(user);
    } catch (err) { 
        console.error(err);
        res.status(500).send("Server Error"); 
    }
};