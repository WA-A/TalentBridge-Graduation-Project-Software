import cloudinary from '../../../utls/Cloudinary.js';
import PostModel from './../../Model/PostModel.js';


// Create Own Post
export const CreatePost = async (req, res, next) => {
    try {
        const { Body,Category } = req.body;
        if (!Body || !Category) {
            return next(new Error("Body or Category is required."));
        }

        const UserId = req.user._id;

        // رفع الصور والفيديوهات والملفات
        const images = req.files['images'] ? await Promise.all(req.files['images'].map(async (file) => {
            const { secure_url, public_id } = await cloudinary.uploader.upload(file.path, { folder: `GraduationProject1-Software/Post/${UserId}` });
            return { secure_url, public_id };
        })) : [];

        const videos = req.files['videos'] ? await Promise.all(req.files['videos'].map(async (file) => {
            const { secure_url, public_id } = await cloudinary.uploader.upload(file.path, { folder: `GraduationProject1-Software/Post/${UserId}` });
            return { secure_url, public_id };
        })) : [];

        const files = req.files['files'] ? req.files['files'].map(file => file.path) : [];

        const ProfilePicture = req.user.profileImage || '../../../../assets/face.jpg';  // استخدم صورة بروفايل افتراضية إذا لم تكن موجودة
        
        const Post = await PostModel.create({
            Body,
            Category,
            Images: images,
            Videos: videos,
            Files: files,
            UserId,
            ProfilePicture,  
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
        const {  Body } = req.body;
        const UserId = req.user._id;

        // Find the existing post by ID
        const post = await PostModel.findById(postId);
        if (!post) {
            return next(new Error("Post not found"));
        }

        // Check if the user is the owner of the post
        if (post.UserId.toString() !== UserId.toString()) {
            return next(new Error("You are not authorized to update this post"));
        }

        // Update Title and Body if provided
        if (Body) post.Body = Body;

        // Handle images if provided
        if (req.files['images']) {
            // Delete existing images from Cloudinary
            await Promise.all(post.Images.map(async (image) => {
                await cloudinary.uploader.destroy(image.public_id);
            }));

            // Upload new images
            post.Images = await Promise.all(req.files['images'].map(async (file) => {
                const { secure_url, public_id } = await cloudinary.uploader.upload(file.path, { folder: `GraduationProject1-Software/Post/${UserId}` });
                return { secure_url, public_id };
            }));
        }

        // Handle videos if provided
        if (req.files['videos']) {
            // Delete existing videos from Cloudinary
            await Promise.all(post.Videos.map(async (video) => {
                await cloudinary.uploader.destroy(video.public_id);
            }));

            // Upload new videos
            post.Videos = await Promise.all(req.files['videos'].map(async (file) => {
                const { secure_url, public_id } = await cloudinary.uploader.upload(file.path, { folder: `GraduationProject1-Software/Post/${UserId}` });
                return { secure_url, public_id };
            }));
        }

        // Handle files if provided
        if (req.files['files']) {
            post.Files = req.files['files'].map(file => file.path);
        }

        // Ensure the ProfileImage is updated from the user's profile
        post.ProfileImage = req.user.profileImage; // Update ProfileImage

        // Save the updated post
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
        const userId = req.user.id; 

        if (!userId) {
            return res.status(400).json({ message: "User ID is required." });
        }

        // Fetch posts for the currently logged-in user and populate the UserId field with ProfilePicture
        const posts = await PostModel.find({ UserId: userId })
            .populate('UserId', 'ProfilePicture'); // Populate the ProfilePicture from the UserId

        if (!posts || posts.length === 0) {
            return res.status(404).json({ message: "No posts found for this user." });
        }

        // Add profile image and likes count to each post
        const postsWithDetails = posts.map(post => {
            const profilePicture = post.UserId && post.UserId.ProfilePicture
                ? post.UserId.ProfilePicture
                : '../../../../assets/face.jpg';  // Default profile picture if not available

            const likeCount = post.like ? post.like.length : 0; // Count the number of likes

            return {
                ...post.toObject(),
                ProfilePicture: profilePicture,
                LikeCount: likeCount // Add like count to the response
            };
        });

        return res.status(200).json({ message: "Posts retrieved successfully", posts: postsWithDetails });
    } catch (error) {
        console.error("Error retrieving posts:", error);
        return next(error);
    }
};




// Get All Posts

export const GetAllPosts = async (req, res, next) => {
    try {
        const posts = await PostModel.find()
            .populate('UserId', 'ProfilePicture'); 

        if (!posts || posts.length === 0) {
            return res.status(404).json({ message: "No posts found." });
        }

        const postsWithDetails = posts.map(post => {
            const profilePicture = post.UserId && post.UserId.ProfilePicture
                ? post.UserId.ProfilePicture
                : '../../../../assets/face.jpg';

            const likeCount = post.like ? post.like.length : 0;

            return {
                ...post.toObject(),
                ProfilePicture: profilePicture,
                LikeCount: likeCount 
            };
        });

        return res.status(200).json({ message: "Posts retrieved successfully", posts: postsWithDetails });
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


