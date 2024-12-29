import cloudinary from '../../../utls/Cloudinary.js';
import PostModel from './../../Model/PostModel.js';
// Create Own Post
export const CreatePost = async (req, res, next) => {
    console.log("req.body:", req.body);
    console.log("req.files:", req.files);

    try {
        const { Body, Category } = req.body;
        if (!Body || !Category) {
            return next(new Error("Body or Category is required.")); // التحقق من وجود الـ Body و Category
        }

        const UserId = req.user._id; // استخراج الـ UserId من التوكن

        // رفع الصور إلى Cloudinary
        const images = req.files['images'] ? await Promise.all(req.files['images'].map(async (file) => {
            const { secure_url, public_id } = await cloudinary.uploader.upload(file.path, { folder: `GraduationProject1-Software/Post/${UserId}` });
            return { secure_url, public_id, originalname: file.originalname };
        })) : [];

        // رفع الفيديوهات إلى Cloudinary
        const videos = req.files['videos'] ? await Promise.all(req.files['videos'].map(async (file) => {
            const { secure_url, public_id } = await cloudinary.uploader.upload(file.path, { folder: `GraduationProject1-Software/Post/${UserId}`, resource_type: "video" });
            return { secure_url, public_id, originalname: file.originalname };
        })) : [];

        // رفع الملفات (مثل PDFs) إلى Cloudinary
        const files = req.files['files'] ? await Promise.all(req.files['files'].map(async (file) => {
            const { secure_url, public_id } = await cloudinary.uploader.upload(file.path, { folder: `GraduationProject1-Software/Post/${UserId}` });
            return { secure_url, public_id, originalname: file.originalname };
        })) : [];

        // إنشاء الـ Post في قاعدة البيانات
        const Post = await PostModel.create({
            Body,
            Category,
            Images: images,
            Videos: videos,  // تخزين الفيديوهات بعد رفعها
            Files: files,    // تخزين الملفات بعد رفعها
            UserId, // فقط مرر الـ UserId هنا
        });

        // التأكد من أنه تم إنشاء الـ Post بنجاح
        if (!Post) {
            return next(new Error("Can't Create Post"));
        }

        // إرجاع استجابة بنجاح
        return res.status(201).json({ message: "Post created successfully", Post });
    } catch (error) {
        console.error("Error creating post:", error); // طباعة الخطأ في حالة فشل العملية
        return next(error); // تمرير الخطأ إلى المعالج التالي
    }
};


// Update Own Post
export const UpdatePost = async (req, res, next) => {
    try {
        const { postId } = req.params; 
        const { Body, Category } = req.body;  // تأكد من أنك تأخذ الـ Body و Category
        const UserId = req.user._id;

        // البحث عن البوست الحالي بناءً على ID
        const post = await PostModel.findById(postId);
        if (!post) {
            return next(new Error("Post not found"));
        }

        // التحقق من أن المستخدم هو صاحب البوست
        if (post.UserId.toString() !== UserId.toString()) {
            return next(new Error("You are not authorized to update this post"));
        }

        // تحديث الـ Body و Category إذا تم تقديمهما
        if (Body) post.Body = Body;
        if (Category) post.Category = Category;  // إضافة التحديث للـ Category

        // التعامل مع الصور إذا تم توفيرها
        if (req.files['images']) {
            // حذف الصور القديمة من Cloudinary
            await Promise.all(post.Images.map(async (image) => {
                await cloudinary.uploader.destroy(image.public_id);
            }));

            // رفع الصور الجديدة
            post.Images = await Promise.all(req.files['images'].map(async (file) => {
                const { secure_url, public_id } = await cloudinary.uploader.upload(file.path, { folder: `GraduationProject1-Software/Post/${UserId}` });
                return { secure_url, public_id, originalname: file.originalname };  // إضافة الاسم الأصلي للملف
            }));
        }

        // التعامل مع الفيديوهات إذا تم توفيرها
        if (req.files['videos']) {
            // حذف الفيديوهات القديمة من Cloudinary
            await Promise.all(post.Videos.map(async (video) => {
                await cloudinary.uploader.destroy(video.public_id);
            }));

            // رفع الفيديوهات الجديدة
            post.Videos = await Promise.all(req.files['videos'].map(async (file) => {
                const { secure_url, public_id } = await cloudinary.uploader.upload(file.path, { folder: `GraduationProject1-Software/Post/${UserId}`, resource_type: "video" });
                return { secure_url, public_id, originalname: file.originalname };  // إضافة الاسم الأصلي للملف
            }));
        }

        // التعامل مع الملفات الأخرى (مثل PDF) إذا تم توفيرها
        if (req.files['files']) {
            // إضافة الملفات الجديدة
            post.Files = await Promise.all(req.files['files'].map(async (file) => {
                const { secure_url, public_id } = await cloudinary.uploader.upload(file.path, { folder: `GraduationProject1-Software/Post/${UserId}` });
                return { secure_url, public_id, originalname: file.originalname };  // إضافة الاسم الأصلي للملف
            }));
        }

        // تحديث صورة البروفايل من بيانات المستخدم
        post.ProfileImage = req.user.profileImage;

        // حفظ التعديلات على البوست
        await post.save();

        return res.status(200).json({ message: "Post updated successfully", post });
    } catch (error) {
        console.error("Error updating post:", error);
        return next(error);
    }
};


// Get Own Posts (جلب البوستات الخاصة بالمستخدم)
export const GetUserPosts = async (req, res, next) => {
    try {
        const userId = req.user.id; // الحصول على ID اليوزر الذي قام بتسجيل الدخول من التوكن

        if (!userId) {
            return res.status(400).json({ message: "User ID is required." });
        }

        // Fetch posts for the currently logged-in user and populate the UserId field with ProfileImage
        const posts = await PostModel.find({ UserId: userId })
            .populate('UserId', 'FullName PictureProfile'); // Populate فقط الحقول المطلوبة

        if (!posts || posts.length === 0) {
            return res.status(404).json({ message: "No posts found for this user." });
        }

        // إضافة صورة بروفايل للمستخدم إذا كانت غير موجودة في البيانات
        const postsWithProfilePicture = posts.map(post => {
            const profilePicture = post.UserId && post.UserId.PictureProfile
                ? post.UserId.PictureProfile
                : '../../../../assets/face.jpg';  // صورة افتراضية في حال لم توجد صورة بروفايل
            return {
                ...post.toObject(),
                ProfilePicture: profilePicture // إضافة الصورة للبروفايل
            };
        });

        return res.status(200).json({ message: "Posts retrieved successfully", posts: postsWithProfilePicture });
    } catch (error) {
        console.error("Error retrieving posts:", error);
        return next(error);
    }
};


// Get All Posts
export const GetAllPosts = async (req, res, next) => {
    try {
        const posts = await PostModel.find()
            .populate('UserId', 'FullName PictureProfile') // اجلب الحقول المطلوبة فقط
            .sort({ createdAt: -1 }); // الترتيب تنازلي (الأحدث أولاً)

        if (!posts || posts.length === 0) {
            return res.status(404).json({ message: "No posts found." });
        }

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