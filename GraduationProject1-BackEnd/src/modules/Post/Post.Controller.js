import cloudinary from '../../../utls/Cloudinary.js';
import PostModel from './../../Model/PostModel.js';

export const CreatePost = async (req, res, next) => {
    try {
        
        const { Title, Body } = req.body;
        if (!Title || !Body) {
            return next(new Error("Title and Body are required."));
        }

        const UserId = req.user._id; 

        
        const images = req.files['images'] ? await Promise.all(req.files['images'].map(async (file) => {
            const { secure_url, public_id } = await cloudinary.uploader.upload(file.path, { folder: 'GraduationProject1-Software/Post' });
            return { secure_url, public_id };
        })) : [];

       
        const videos = req.files['videos'] ? await Promise.all(req.files['videos'].map(async (file) => {
            const { secure_url, public_id } = await cloudinary.uploader.upload(file.path, { folder: 'GraduationProject1-Software/Post' });
            return { secure_url, public_id };
        })) : [];

        
        const files = req.files['files'] ? req.files['files'].map(file => file.path) : []; 

        
        const Post = await PostModel.create({
            Title,
            Body,
            Images: images,
            Videos: videos,
            Files: files,
            UserId,
            ProfileImage: req.user.profileImage, 
        });

        if (!Post) {
            return next(new Error("Can't Create Post"));
        }

        return res.status(201).json({ message: "success", Post });
    } catch (error) {
        console.error("Error creating post:", error);
        return next(error);
    }
};
