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


// Update Comment
export const UpdateComment = async (req, res, next) => {
    try {
        console.log(req.body);
        console.log(req.files);

        const { CommentId } = req.params;
        const { Text, existingImages, newImages } = req.body; // استلام النص والصور القديمة والجديدة

        // البحث عن التعليق
        const comment = await CommentModel.findById(CommentId);
        if (!comment) {
            return res.status(404).json({ message: "Comment not found" });
        }

        // تحديث النص إذا كان موجوداً
        if (Text) {
            comment.Text = Text;
        }

        // دالة لتحديث الصور (إضافة جديدة أو حذف قديمة)
        const updatedImages = [];
        const oldImagesToKeep = JSON.parse(existingImages || "[]"); // الصور التي يريد المستخدم الاحتفاظ بها

        // حذف الصور القديمة التي لا يتم الاحتفاظ بها
        const imagesToDelete = comment.Images.filter(
            (image) => !oldImagesToKeep.some((oldImage) => oldImage.public_id === image.public_id)
        );

        await Promise.all(
            imagesToDelete.map(async (image) => {
                await cloudinary.uploader.destroy(image.public_id);
            })
        );

        // إضافة الصور القديمة التي تم الاحتفاظ بها
        updatedImages.push(...oldImagesToKeep);

        // رفع الصور الجديدة إذا كانت موجودة
        if (req.files.images) {
            const uploadedImages = await Promise.all(
                req.files.images.map(async (file) => {
                    const { secure_url, public_id } = await cloudinary.uploader.upload(file.path, {
                        folder: `GraduationProject1-Software/Comments/${req.user._id}`,
                    });
                    return { secure_url, public_id };
                })
            );
            updatedImages.push(...uploadedImages);
        }

        // تحديث الحقول بالصور الجديدة والصور القديمة
        comment.Images = updatedImages;

        // حفظ التغييرات في التعليق
        await comment.save();

        return res.status(200).json({ message: "Comment updated successfully", comment });
    } catch (error) {
        console.error("Error updating comment:", error);
        return next(error);
    }
};


// Get All Comment 
export const GetAllComments = async (req, res, next) => {
    try {
        const { PostId } = req.params;

        // جلب التعليقات مع المستخدمين وترتيبها من الأحدث أولًا بناءً على createdAt
        const comments = await CommentModel.find({ PostId })
            .populate('UserId', 'FullName PictureProfile')
            .sort({ createdAt: -1 }); // -1 يعني ترتيب تنازلي (الأحدث أولًا)

        // تنسيق التعليقات مع إضافة بيانات المستخدم
        const formattedComments = comments.map(comment => ({
            _id: comment._id,
            Text: comment.Text,
            Images: comment.Images,
            Videos: comment.Videos,
            Files: comment.Files,
            UserId: comment.UserId._id, // معرف المستخدم
            FullName: comment.UserId.FullName, // اسم المستخدم
            PictureProfile: comment.UserId.PictureProfile, // صورة المستخدم
            PostId: comment.PostId,
            createdAt: comment.createdAt,
            updatedAt: comment.updatedAt,
        }));

        // إرسال النتيجة
        return res.status(200).json({ 
            message: "Comments retrieved successfully", 
            comments: formattedComments 
        });
    } catch (error) {
        console.error("Error retrieving comments:", error);
        return next(error);
    }
};


// Delete Comment

export const DeleteComment = async (req, res, next) => {
    try {
        const { CommentId } = req.params;
        const userId = req.user._id; 

        const comment = await CommentModel.findById(CommentId);

        if (!comment) {
            return res.status(404).json({ message: "Comment not found" });
        }

        if (comment.UserId.toString() !== userId.toString()) {
            return res.status(403).json({ message: "You are not authorized to delete this comment" });
        }

        await CommentModel.findByIdAndDelete(CommentId);

        return res.status(200).json({ message: "Comment deleted successfully" });
    } catch (error) {
        console.error("Error deleting comment:", error);
        return next(error);
    }
};


// Get All Own Comments 
export const GetAllOwnComments = async (req, res, next) => {
    try {
        const userId = req.user._id; 

        // جلب التعليقات الخاصة بالمستخدم وترتيبها من الأحدث أولًا بناءً على createdAt
        const comments = await CommentModel.find({ UserId: userId })
            .populate('PostId', 'Body')
            .sort({ createdAt: -1 }); // -1 يعني ترتيب تنازلي (الأحدث أولًا)

        // تنسيق التعليقات مع إضافة بيانات المنشور
        const formattedComments = comments.map(comment => ({
            _id: comment._id,
            Text: comment.Text,
            Images: comment.Images,
            Videos: comment.Videos,
            Files: comment.Files,
            PostId: comment.PostId, // بيانات المنشور
            createdAt: comment.createdAt,
            updatedAt: comment.updatedAt,
        }));

        return res.status(200).json({ message: "Comments retrieved successfully", comments: formattedComments });
    } catch (error) {
        console.error("Error retrieving user's comments:", error);
        return next(error);
    }
};
