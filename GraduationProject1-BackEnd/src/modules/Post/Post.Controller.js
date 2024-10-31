import cloudinary from '../../../utls/Cloudinary.js';
import PostModel from './../../Model/PostModel.js';


// Create Own Post
export const CreatePost = async (req, res, next) => {
    try {
        
        const { Title, Body } = req.body;
        if (!Title || !Body) {
            return next(new Error("Title and Body are required."));
        }

        const UserId = req.user._id; 

        
        const images = req.files['images'] ? await Promise.all(req.files['images'].map(async (file) => {
            const { secure_url, public_id } = await cloudinary.uploader.upload(file.path, { folder: 'GraduationProject1-Software/Post/${UserId}' });
            return { secure_url, public_id };
        })) : [];

       
        const videos = req.files['videos'] ? await Promise.all(req.files['videos'].map(async (file) => {
            const { secure_url, public_id } = await cloudinary.uploader.upload(file.path, { folder: 'GraduationProject1-Software/Post/${UserId}' });
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


// Update Own Post
export const UpdatePost = async (req, res, next) => {
    try {
        const { postId } = req.params; 
        const { Title, Body } = req.body;
        const UserId = req.user._id;

        const post = await PostModel.findById(postId);
        if (!post) {
            return next(new Error("Post not found"));
        }

        if (Title) post.Title = Title;
        if (Body) post.Body = Body;

        if (req.files['images']) {
            await Promise.all(post.Images.map(async (image) => {
                await cloudinary.uploader.destroy(image.public_id);
            }));

            post.Images = await Promise.all(req.files['images'].map(async (file) => {
                const { secure_url, public_id } = await cloudinary.uploader.upload(file.path, { folder: `GraduationProject1-Software/Post/${UserId}` });
                return { secure_url, public_id };
            }));
        }

        if (req.files['videos']) {
            await Promise.all(post.Videos.map(async (video) => {
                await cloudinary.uploader.destroy(video.public_id);
            }));

            post.Videos = await Promise.all(req.files['videos'].map(async (file) => {
                const { secure_url, public_id } = await cloudinary.uploader.upload(file.path, { folder: `GraduationProject1-Software/Post/${UserId}` });
                return { secure_url, public_id };
            }));
        }

        if (req.files['files']) {
            post.Files = req.files['files'].map(file => file.path);
        }

        await post.save();

        return res.status(200).json({ message: "Post updated successfully", post });
    } catch (error) {
        console.error("Error updating post:", error);
        return next(error);
    }
};



// Get Own Posts

export const GetUserPosts = async (req, res, next) => {
    try {
        const userId = req.params.userId; 

        
        const posts = await PostModel.find({ UserId: userId }).populate('UserId', 'ProfileImage');

        return res.status(200).json({ message: "Posts retrieved successfully", posts });
    } catch (error) {
        console.error("Error retrieving posts:", error);
        return next(error);
    }
};

// Get All Posts

export const GetAllPosts = async (req, res, next) => {
    try {

        const posts = await PostModel.find().populate('UserId', 'ProfileImage');

        return res.status(200).json({ message: "Posts retrieved successfully", posts });
    } catch (error) {
        console.error("Error retrieving posts:", error);
        return next(error);
    }
};


// Delete Own Post

export const DeletePost = async (req, res, next) => {
    try {
        const postId = req.params.postId; 
        const userId = req.user._id; 

        const post = await PostModel.findById(postId);

        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }

        if (post.UserId.toString() !== userId.toString()) {
            return res.status(403).json({ message: "You are not authorized to delete this post" });
        }

        await PostModel.findByIdAndDelete(postId);

        return res.status(200).json({ message: "Post deleted successfully" });
    } catch (error) {
        console.error("Error deleting post:", error);
        return next(error);
    }
};