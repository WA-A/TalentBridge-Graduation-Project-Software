import UserModel from "../../Model/User.Model.js";
import Cloudinary from '../../../utls/Cloudinary.js';



export const test = async (req, res) => {
    return res.status(404).json({ message: "success join " });
}
// Create Own Profile
export const CreateProfile = async (req, res) => {
    try {
        console.log("Body:", req.body);
        console.log("Files:", req.files);

        const { About, Bio, UserName } = req.body;
        const authuser = req.user;

        if (!authuser) {
            return res.status(404).json({ message: "User not found" });
        }

        // التحقق من وجود الملفات المرفوعة
        if (!req.files || (!req.files.PictureProfile && !req.files.CoverImage)) {
            return res.status(400).json({ message: "No files uploaded" });
        }

        // رفع صورة الملف الشخصي (PictureProfile) إذا كانت موجودة
        let pictureProfileData = null;
        if (req.files.PictureProfile) {
            const { secure_url, public_id } = await Cloudinary.uploader.upload(req.files.PictureProfile[0].path, {
                folder: `GraduationProject1-Software/Profile/${authuser._id}/PictureProfile`,
            });
            pictureProfileData = { secure_url, public_id };
        }

        // رفع صورة الغلاف (CoverImage) إذا كانت موجودة
        let coverImageData = null;
        if (req.files.CoverImage) {
            const { secure_url, public_id } = await Cloudinary.uploader.upload(req.files.CoverImage[0].path, {
                folder: `GraduationProject1-Software/Profile/${authuser._id}/CoverImage`,
            });
            coverImageData = { secure_url, public_id };
        }

        // إيجاد المستخدم في قاعدة البيانات
        const existingUser = await UserModel.findById(authuser._id);
        if (!existingUser) {
            return res.status(404).json({ message: "User not found" });
        }

        // تحديث البيانات
        if (pictureProfileData) existingUser.PictureProfile = pictureProfileData;
        if (coverImageData) existingUser.CoverImage = coverImageData;
        existingUser.About = About;
        existingUser.Bio = Bio;
        existingUser.UserName = UserName;
        await existingUser.save();

        return res.status(200).json({
            message: "Profile updated successfully",
            user: existingUser,
        });
    } catch (error) {
        console.error("Error in createProfile:", error);
        return res.status(500).json({ message: "Internal server error", error: error.message });
    }
};

// Update Own Profile
export const UpdateProfile = async (req, res, next) => {
    try {
        const { About, Bio, UserName,Location } = req.body;
        const authUser = req.user;


        const existingUser = await UserModel.findById(authUser._id);
        if (!existingUser) {
            return res.status(404).json({ message: "User not found" });
        }


        if (existingUser._id.toString() !== authUser._id.toString()) {
            return res.status(403).json({ message: "You can only update your own profile" });
        }

        let profileImage = existingUser.PictureProfile;
        if (req.files && req.files['PictureProfile']) {
            const { secure_url, public_id } = await Cloudinary.uploader.upload(req.files['PictureProfile'][0].path, {
                folder: `GraduationProject1-Software/Profile/${authUser._id}`,
            });
            profileImage = { secure_url, public_id };
        }

           // تحديث صورة الغلاف
           let coverImage = existingUser.CoverImage;
           if (req.files && req.files['CoverImage']) {
            const { secure_url, public_id } = await Cloudinary.uploader.upload(req.files['CoverImage'][0].path, {
                folder: `GraduationProject1-Software/Cover/${authUser._id}`,
            });
            coverImage = { secure_url, public_id };
        }
        existingUser.About = About || existingUser.About;
        existingUser.Bio = Bio || existingUser.Bio;
        existingUser.PictureProfile = profileImage;
        existingUser.UserName = UserName || existingUser.UserName;
        existingUser.Location = Location|| existingUser.UserName;
        existingUser.CoverImage = coverImage;

        await existingUser.save();

        return res.status(200).json({
            message: "Profile updated successfully",
            user: existingUser,
        });
    } catch (error) {
        console.error("Error updating profile:", error);
        return next(error);
    }
};


//  View Own Profile
export const ViewOwnProfile = async (req, res) => {
    try {
        console.log('Authenticated user:', req.user);

        const user = await UserModel.findById(req.user.id).select('-Password -ConfirmPassword');
        if (!user) return res.status(404).json({ message: "User not found" });

        res.status(200).json({
            FullName: user.FullName,
            UserName: user.UserName,
            Bio: user.Bio,
            Location: user.Location,
            PictureProfile: user.PictureProfile,
            About: user.About,
            CoverImage:user.CoverImage,
        });
    } catch (error) {
        console.error('Error fetching user profile:', error.message);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};



// View Other People's Profiles
export const ViewOtherProfile = async (req, res) => {
    try {
        const { userId } = req.params;


        const user = await UserModel.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }


        return res.status(200).json(user);
    } catch (error) {
        console.error("Error viewing profile:", error);
        return res.status(500).json({ message: error.message });
    }
};


// في ملف User.controller.js
export const searchUsers = async (req, res) => {
    try {
      const { user } = req.params; // الحصول على قيمة الاستعلام من الـ URL parameters
  
      if (!user) {
        return res.status(400).json({ message: "User parameter is required" });
      }
  
      // البحث في قاعدة البيانات باستخدام الاستعلام
      const users = await UserModel.find({
        $or: [
          { FullName: { $regex: user, $options: 'i' } },       // بحث عن الاسم الكامل (غير حساس لحالة الأحرف)
          { UserName: { $regex: `^${user}$`, $options: 'i' } } // تطابق تام مع اسم المستخدم (غير حساس لحالة الأحرف)
        ]
      }).limit(10); // الحد من عدد النتائج
  
      if (users.length === 0) {
        return res.status(404).json({ message: "No users found" });
      }
  
      // تصفية النتائج لضمان عدم تكرار المستخدم نفسه
      const uniqueUsers = [];
      const seenIds = new Set();
  
      for (const user of users) {
        if (!seenIds.has(user._id.toString())) {
          seenIds.add(user._id.toString());
          uniqueUsers.push(user);
        }
      }
  
      // إرسال النتائج للمستخدم
      return res.status(200).json(uniqueUsers);
    } catch (error) {
      console.error("Error searching users:", error);
      return res.status(500).json({ message: error.message });
    }
  };
  

//get data of user to chat










