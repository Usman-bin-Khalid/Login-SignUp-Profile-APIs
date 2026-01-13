const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'user_profiles', // Folder name in Cloudinary
        allowed_formats: ['jpg', 'png', 'jpeg'],
        folder: 'social_posts', // Separate folder for posts
        allowed_formats: ['jpg', 'png', 'jpeg'],
        folder: 'ecommerce_products',
        allowed_formats: ['jpg', 'png', 'jpeg'],
    },
});


const upload = multer({ storage });


module.exports = { upload, cloudinary };
