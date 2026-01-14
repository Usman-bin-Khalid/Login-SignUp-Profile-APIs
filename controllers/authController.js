const User = require("../models/User");
const Post = require("../models/Post");
const Comment = require("../models/Comment");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// SIGN UP
exports.signup = async (req, res) => {
  const { email, password, confirmPassword, fullName, role } = req.body;
  if (password !== confirmPassword)
    return res.status(400).json({ msg: "Passwords do not match" });

  try {
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ msg: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    user = new User({ email, password: hashedPassword, fullName, role });
    await user.save();

    res
      .status(201)
      .json({ status: 1, msg: "User registered successfully", user });
  } catch (err) {
    res.status(500).send("Server Error", err);
  }
};

// LOGIN
exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: "Invalid Credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: "Invalid Credentials" });

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h",
      }
    );
    res.json({
      token,
      user: { id: user._id, fullName: user.fullName, email: user.email },
    });
  } catch (err) {
    res.status(500).send("Server Error");
  }
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
        isProfileComplete: true,
      },
      { new: true }
    );
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
};

// LOGOUT
exports.logout = async (req, res) => {
  try {
    res.status(200).json({ msg: "Logged out successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
};

// DELETE ACCOUNT
exports.deleteAccount = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    // 1. Delete all posts by the user
    await Post.deleteMany({ user: userId });

    // 2. Delete all comments by the user
    await Comment.deleteMany({ user: userId });

    // 3. Delete comments on user's posts (orphaned comments)
    // Find all posts that *would have been* deleted in step 1?
    // Wait, we already deleted the posts in step 1.
    // So any comments linked to those posts are now referencing non-existent posts.
    // We should delete comments where the *post* no longer exists?
    // OR, better logic: Find posts first, then delete comments on them, then delete posts.

    // REVISED LOGIC FOR CASCADING DELETE:

    // Find user's posts first to get their IDs
    const userPosts = await Post.find({ user: userId });
    const userPostIds = userPosts.map((p) => p._id);
    l;

    // Delete comments on these posts
    await Comment.deleteMany({ post: { $in: userPostIds } });

    // NOW delete the posts
    await Post.deleteMany({ user: userId });

    // 4. Remove user from 'likes' in all posts
    await Post.updateMany({ likes: userId }, { $pull: { likes: userId } });

    // 5. Remove user from 'followers' and 'following' of other users
    await User.updateMany(
      { $or: [{ followers: userId }, { following: userId }] },
      { $pull: { followers: userId, following: userId } }
    );

    // 6. Delete the user
    await User.findByIdAndDelete(userId);

    res.json({ msg: "User account deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
};
