const Post = require("../models/Post");
const User = require("../models/User");

// CREATE POST: Create a new post
exports.createPost = async (req, res) => {
  try {
    const { caption } = req.body;

    // req.file is populated by the upload middleware
    if (!req.file) {
      return res.status(400).json({ msg: "Please upload an image" });
    }

    const newPost = new Post({
      user: req.user.id,
      imageUrl: req.file.path, // This is the Cloudinary URL
      caption,
    });

    await newPost.save();
    res.status(201).json({ msg: "Post created successfully", newPost });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Failed to create post" });
  }
};


// DELETE POST: Delete a post
exports.deletePost = async (req, res) => {
  try {
    const post = await Post.findByIdAndDelete(req.params.postId);
    if (!post) return res.status(404).json({ msg: "Post not found" });
    res.json({ msg: "Post deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Failed to delete post" });
  }
};



// UPDATE POST: Update a post
exports.updatePost = async (req, res) => {
  try {
    const post = await Post.findByIdAndUpdate(
      req.params.postId,
      { caption: req.body.caption },
      { new: true }
    );
    if (!post) return res.status(404).json({ msg: "Post not found" });
    res.json({ msg: "Post updated successfully", post });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Failed to update post" });
  }
};

// GET ALL POSTS: Useful for testing before you follow anyone
exports.getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find()
      .populate("user", "fullName profileImage")
      .sort({ createdAt: -1 });
    res.json(posts);
  } catch (err) {
    res.status(500).json({ msg: "Server Error" });
  }
};
// 1. DYNAMIC SEARCH: Search users by name using Regex
exports.searchUsers = async (req, res) => {
  const { query } = req.query;
  try {
    const users = await User.find({
      fullName: { $regex: query, $options: "i" }, // 'i' for case-insensitive
    }).select("fullName profileImage");
    res.json(users);
  } catch (err) {
    res.status(500).json({ msg: "Search failed" });
  }
};

// 2. TOGGLE LIKE: Add or remove like with one click
exports.toggleLike = async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId);
    if (!post) return res.status(404).json({ msg: "Post not found" });

    // Check if user already liked the post
    const isLiked = post.likes.includes(req.user.id);

    if (isLiked) {
      // Remove User ID from array
      post.likes = post.likes.filter((id) => id.toString() !== req.user.id);
    } else {
      // Add User ID to array
      post.likes.push(req.user.id);
    }

    await post.save();
    res.json({
      msg: isLiked ? "Unliked" : "Liked",
      likesCount: post.likes.length,
    });
  } catch (err) {
    res.status(500).send("Server Error");
  }
};


// 3. THE FEED: Get posts only from followed users
exports.getFeed = async (req, res) => {
  try {
    const currentUser = await User.findById(req.user.id);

    // Find posts where the 'user' field is in the 'following' array
    const posts = await Post.find({
      user: { $in: currentUser.following },
    })
      .populate("user", "fullName profileImage") // Join user data
      .sort({ createdAt: -1 }); // Newest first

    res.json(posts);
  } catch (err) {
    res.status(500).send("Server Error");
  }
};






// 4. FOLLOW USER: Utility to populate the feed
exports.followUser = async (req, res) => {
  try {
    const userToFollowId = req.params.id;
    const currentUserId = req.user.id;

    if (userToFollowId === currentUserId)
      return res.status(400).json({ msg: "Cannot follow yourself" });

    // Add to following of current user
    await User.findByIdAndUpdate(currentUserId, {
      $addToSet: { following: userToFollowId },
    });
    // Add to followers of target user
    await User.findByIdAndUpdate(userToFollowId, {
      $addToSet: { followers: currentUserId },
    });

    res.json({ msg: "Followed successfully" });
  } catch (err) {
    res.status(500).send("Server Error");
  }
};


