import cloudinary from '../../../utls/Cloudinary.js';
import CommentModel from './../../Model/CommentModel.js';


// Create New Comment
export const CreateComment = async (req, res, next) => {
    try {
        req.body.UserId = req.user._id;
        req.body.PostId = req.params.PostId; 

        const images = req.files['images'] ? await Promise.all(req.files['images'].map(async (file) => {
            const { secure_url, public_id } = await cloudinary.uploader.upload(file.path, { folder: `GraduationProject1-Software/Comments/${req.user._id}` });
            return { secure_url, public_id };
        })) : [];

        const videos = req.files['videos'] ? await Promise.all(req.files['videos'].map(async (file) => {
            const { secure_url, public_id } = await cloudinary.uploader.upload(file.path, { folder: `GraduationProject1-Software/Comments/${req.user._id}` });
            return { secure_url, public_id };
        })) : [];

        const files = req.files['files'] ? await Promise.all(req.files['files'].map(async (file) => {
            const { secure_url, public_id } = await cloudinary.uploader.upload(file.path, { folder: `GraduationProject1-Software/Comments/${req.user._id}` });
            return { secure_url, public_id };
        })) : [];

        if (images.length > 0) req.body.Images = images;
        if (videos.length > 0) req.body.Videos = videos;
        if (files.length > 0) req.body.Files = files;

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



export const UpdateComment = async (req, res, next) => {
    try {
        const { CommentId } = req.params; 
        const { Text } = req.body;

        const comment = await CommentModel.findById(CommentId);
        if (!comment) {
            return res.status(404).json({ message: "Comment not found" });
        }

        // تحديث نص التعليق إذا كان موجودًا
        if (Text) {
            comment.Text = Text;
        }

        // دالة لتحديث الملفات
        const updateFiles = async (fileType, existingFiles) => {
            if (req.files[fileType]) {
                // حذف الملفات القديمة من Cloudinary
                await Promise.all(existingFiles.map(async (file) => {
                    await cloudinary.uploader.destroy(file.public_id);
                }));

                // رفع الملفات الجديدة
                return await Promise.all(req.files[fileType].map(async (file) => {
                    const { secure_url, public_id } = await cloudinary.uploader.upload(file.path, { folder: `GraduationProject1-Software/Comments/${req.user._id}` });
                    return { secure_url, public_id };
                }));
            }
            return existingFiles; // في حالة عدم وجود ملفات جديدة، أعد الملفات القديمة
        };

        // تحديث الصور، الفيديوهات والملفات
        comment.Images = await updateFiles('images', comment.Images);
        comment.Videos = await updateFiles('videos', comment.Videos);
        comment.Files = await updateFiles('files', comment.Files);

        await comment.save();

        return res.status(200).json({ message: "Comment updated successfully", comment });
    } catch (error) {
        console.error("Error updating comment:", error);
        return next(error);
    }
};

