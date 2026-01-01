const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    // Auth Fields
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    
    // Profile Fields (Updated via "Complete Profile")
    fullName: { type: String, required: true },
    profileImage: { type: String, default: "" },
    dob: { type: String },
    country: { type: String },
    gender: { type: String, enum: ['Male', 'Female', 'Other'] },
    isProfileComplete: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);

