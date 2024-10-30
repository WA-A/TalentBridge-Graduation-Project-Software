import cloudinary from '../../../utls/Cloudinary.js';
import CommentModel from './../../Model/CommentModel.js';

export const CreateComment = async (req, res, next) => {
    try {
        req.body.UserId = req.user._id;
        req.body.PostId = req.params.id;

        if (req.files && req.files.length > 0) {
            const images = [];
            const videos = [];
            const files = [];

            for (const file of req.files) {
                const { secure_url, public_id } = await cloudinary.uploader.upload(file.path, { folder: 'Comments' });

                if (file.mimetype.startsWith("image")) {
                    images.push({ secure_url, public_id });
                } else if (file.mimetype.startsWith("video")) {
                    videos.push({ secure_url, public_id });
                } else {
                    files.push({ secure_url, public_id });
                }
            }

            if (images.length > 0) req.body.images = images;
            if (videos.length > 0) req.body.videos = videos;
            if (files.length > 0) req.body.files = files;
        }

        const comment = await CommentModel.create(req.body);

        if (!comment) {
            return next(new Error("Failed to create comment"));
        }

        return res.status(201).json({ message: "success", comment });
    } catch (error) {
        console.error("Error in CreateComment:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};
