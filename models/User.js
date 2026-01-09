// const mongoose = require('mongoose');
// const userSchema = new mongoose.Schema({
//     // Auth Fields
//     email: { type: String, required: true, unique: true },
//     password: { type: String, required: true },
//     // Profile Fields (Updated via "Complete Profile")
//     fullName: { type: String, required: true },
//     profileImage: { type: String, default: "" },
//     dob: { type: String },
//     country: { type: String },
//     gender: { type: String, enum: ['Male', 'Female', 'Other'] },
//     isProfileComplete: { type: Boolean, default: false }
// }, { timestamps: true });
// module.exports = mongoose.model('User', userSchema);

const { default: mongoose } = require('mongoose');
// const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    fullName: { type: String, required: true },
    profileImage: { type: String, default: "" },
    dob: { type: String },
    country: { type: String },
    gender: { type: String, enum: ['Male', 'Female', 'Other'] },
    isProfileComplete: { type: Boolean, default: false },
    // NEW FIELDS FOR SOCIAL INTERACTION
    followers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    following: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
}, { timestamps: true });



module.exports = mongoose.model('User', userSchema);

