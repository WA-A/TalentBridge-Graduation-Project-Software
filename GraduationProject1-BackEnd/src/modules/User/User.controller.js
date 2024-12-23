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


export const addCertification = async (req, res) => {
    try {
        console.log("Body:", req.body);
        console.log("Files:", req.files);

        const { title, issuingOrganization, issueDate, expirationDate, credentialType } = req.body;
        const authuser = req.user;

        if (!authuser) {
            return res.status(404).json({ message: "User not found" });
        }

        // التحقق من البيانات المطلوبة
        if (!title || !issuingOrganization || !issueDate || !credentialType) {
            return res.status(400).json({ message: "Missing required fields" });
        }

        // التحقق من رفع الصورة إذا كانت نوع الشهادة "image"
        let certificationImageData = null;
        if (credentialType === 'image') {
            if (!req.files || !req.files.CertificationImage) {
                return res.status(400).json({ message: "No image file uploaded" });
            }

            // رفع الصورة إلى Cloudinary
            const { secure_url, public_id } = await Cloudinary.uploader.upload(req.files.CertificationImage[0].path, {
                folder: `GraduationProject1-Software/Certifications/${authuser._id}`,
            });
            certificationImageData = { secure_url, public_id };
        }

        // إنشاء الشهادة الجديدة
        const newCertification = {
            title,
            issuingOrganization,
            issueDate,
            expirationDate: expirationDate || null,
            credentialType,
            certificationImageData: certificationImageData, // تخزين كائن الصورة
            certificationLinkData: credentialType === 'link' ? req.body.certificationLinkData : null,
        };

        // إيجاد المستخدم في قاعدة البيانات وإضافة الشهادة
        const updatedUser = await UserModel.findByIdAndUpdate(
            authuser._id,
            { $push: { Certifications: newCertification } },
            { new: true }
        );

        if (!updatedUser) {
            return res.status(404).json({ message: "User not found" });
        }

        return res.status(200).json({
            message: "Certification added successfully",
            certifications: updatedUser.Certifications,
        });
    } catch (error) {
        console.error("Error in addCertification:", error);
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
  

// إضافة خبرة جديدة
export const addExperience = async (req, res) => {
    try {
        const { name, jobTitle, startDate, endDate, isContinuing,Description } = req.body;
        const authUser = req.user;

        const user = await UserModel.findById(authUser._id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const newExperience = { name, jobTitle, startDate, endDate, isContinuing,Description };

        user.Experiences.push(newExperience);
        await user.save();

        return res.status(200).json({ message: "Experience added successfully", user });
    } catch (error) {
        console.error("Error adding experience:", error);
        return res.status(500).json({ message: error.message });
    }
};

export const getAllEducation = async (req, res) => {
    try {
        const authUser = req.user; // Extract authenticated user from the request

        const user = await UserModel.findById(authUser._id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Return the education data
        return res.status(200).json({ 
            message: "Education retrieved successfully", 
            education: user.Education 
        });
    } catch (error) {
        console.error("Error retrieving education:", error);
        return res.status(500).json({ message: error.message });
    }
};


// Get All Experiences of the User
export const getAllExperiences = async (req, res) => {
    try {
        const authUser = req.user;

        // إيجاد المستخدم
        const user = await UserModel.findById(authUser._id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // إرجاع جميع الخبرات
        return res.status(200).json({ experiences: user.Experiences });
    } catch (error) {
        console.error("Error fetching experiences:", error);
        return res.status(500).json({ message: error.message });
    }
};

// تعديل خبرة موجودة
export const updateExperience = async (req, res) => {
    try {
        console.log(req.body);
        const { experienceId } = req.params;
        const { name, jobTitle, startDate, endDate, isContinuing, Description } = req.body; // إضافة description
        const authUser = req.user;

        // البحث عن المستخدم في قاعدة البيانات
        const user = await UserModel.findById(authUser._id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // البحث عن الخبرة بواسطة ID الخبرة
        const experience = user.Experiences.id(experienceId);
        if (!experience) {
            return res.status(404).json({ message: "Experience not found" });
        }

        // تحديث الحقول مع مراعاة أن الحقول الفارغة لن يتم إرسالها
        experience.name = name || experience.name;
        experience.jobTitle = jobTitle || experience.jobTitle;
        
        // التأكد من أن startDate و endDate يتم تمريرهما كتواريخ
        experience.startDate = startDate ? new Date(startDate) : experience.startDate;
        experience.endDate = endDate ? new Date(endDate) : experience.endDate;

        // التأكد من أن isContinuing يتم تمريره كقيمة منطقية (Boolean)
        experience.isContinuing = isContinuing !== undefined ? isContinuing : experience.isContinuing;
        
        // إضافة التحديث لدسكربشن
        experience.Description = Description || experience.Description;

        // حفظ التحديثات في قاعدة البيانات
        await user.save();

        // إرجاع الخبرات المعدلة فقط بعد التحديث
        return res.status(200).json({ message: "Experience updated successfully", experiences: user.Experiences });
    } catch (error) {
        console.error("Error updating experience:", error);
        return res.status(500).json({ message: error.message });
    }
};


// إضافة تعليم جديد
export const addEducation = async (req, res) => {
    try {
        const { universityName, degree, fieldOfStudy } = req.body;
        const authUser = req.user;

        const user = await UserModel.findById(authUser._id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const newEducation = { universityName, degree, fieldOfStudy };

        user.Education.push(newEducation);
        await user.save();

        return res.status(200).json({ message: "Education added successfully", user });
    } catch (error) {
        console.error("Error adding education:", error);
        return res.status(500).json({ message: error.message });
    }
};

// تعديل تعليم موجود
export const updateEducation = async (req, res) => {
    console.log(req.body);
    try {
        const { educationId } = req.params;
        const { universityName, degree, fieldOfStudy } = req.body;
        const authUser = req.user;

        const user = await UserModel.findById(authUser._id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const education = user.Education.id(educationId);
        if (!education) {
            return res.status(404).json({ message: "Education not found" });
        }

        // تحديث بيانات التعليم
        education.universityName = universityName || education.universityName;
        education.degree = degree || education.degree;
        education.fieldOfStudy = fieldOfStudy || education.fieldOfStudy;

        await user.save();

        return res.status(200).json({ 
            message: "Education updated successfully", 
            education: user.Education // إعادة قسم التعليم فقط
        });
    } catch (error) {
        console.error("Error updating education:", error);
        return res.status(500).json({ message: error.message });
    }
};






export const addLanguage = async (req, res) => {
    try {
        const { language } = req.body;
        const authUser = req.user;

        const user = await UserModel.findById(authUser._id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        user.Languages.push(language);
        await user.save();

        return res.status(200).json({ message: "Language added successfully", user });
    } catch (error) {
        console.error("Error adding language:", error);
        return res.status(500).json({ message: error.message });
    }
};




export const addRecommendation = async (req, res) => {
    try {
        const { text, author, date } = req.body;
        const authUser = req.user;

        const user = await UserModel.findById(authUser._id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const newRecommendation = { text, author, date };

        user.Recommendations.push(newRecommendation);
        await user.save();

        return res.status(200).json({ message: "Recommendation added successfully", user });
    } catch (error) {
        console.error("Error adding recommendation:", error);
        return res.status(500).json({ message: error.message });
    }
};





// حذف خبرة موجودة
// حذف خبرة موجودة
export const deleteexperience = async (req, res) => {
    console.log(req.body);
    try {
        const { experienceId } = req.params;
        const authUser = req.user;

        const user = await UserModel.findById(authUser._id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // حذف الخبرة المحددة
        user.Experiences = user.Experiences.filter(exp => exp._id.toString() !== experienceId);
        await user.save();

        return res.status(200).json({ 
            message: "Experience deleted successfully", 
            Experiences: user.Experiences // إعادة الخبرات فقط
        });
    } catch (error) {
        console.error("Error deleting experience:", error);
        return res.status(500).json({ message: error.message });
    }
};



// حذف تعليم موجود
// حذف تعليم موجود
export const deleteeducation = async (req, res) => {
    try {
        const { educationId } = req.params;
        const authUser = req.user;

        const user = await UserModel.findById(authUser._id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // حذف التعليم المحدد
        user.Education = user.Education.filter(edu => edu._id.toString() !== educationId);
        await user.save();

        return res.status(200).json({ 
            message: "Education deleted successfully", 
            Education: user.Education // إعادة التعليم فقط
        });
    } catch (error) {
        console.error("Error deleting education:", error);
        return res.status(500).json({ message: error.message });
    }
};


// حذف لغة
export const deleteLanguage = async (req, res) => {
    try {
        const { language } = req.body; // نفترض أن اللغة المراد حذفها تُمرر في body
        const authUser = req.user;

        const user = await UserModel.findById(authUser._id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        user.Languages = user.Languages.filter(lang => lang !== language);
        await user.save();

        return res.status(200).json({ 
            message: "Language deleted successfully", 
            languages: user.Languages // إعادة قائمة اللغات فقط
        });
    } catch (error) {
        console.error("Error deleting language:", error);
        return res.status(500).json({ message: error.message });
    }
};



// حذف توصية موجودة
export const deleteRecommendation = async (req, res) => {
    try {
        const { recommendationId } = req.params;
        const authUser = req.user;

        const user = await UserModel.findById(authUser._id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        user.Recommendations = user.Recommendations.filter(rec => rec._id.toString() !== recommendationId);
        await user.save();

        return res.status(200).json({ 
            message: "Recommendation deleted successfully", 
            recommendations: user.Recommendations // إعادة قائمة التوصيات فقط
        });
    } catch (error) {
        console.error("Error deleting recommendation:", error);
        return res.status(500).json({ message: error.message });
    }
};


export const updateLanguage = async (req, res) => {
    try {
        const { oldLanguage, newLanguage } = req.body; // تمرير اللغة القديمة والجديدة
        const authUser = req.user;

        const user = await UserModel.findById(authUser._id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const languageIndex = user.Languages.indexOf(oldLanguage);
        if (languageIndex === -1) {
            return res.status(404).json({ message: "Language not found" });
        }

        user.Languages[languageIndex] = newLanguage;
        await user.save();

        return res.status(200).json({ 
            message: "Language updated successfully", 
            languages: user.Languages // إعادة قائمة اللغات فقط
        });
    } catch (error) {
        console.error("Error updating language:", error);
        return res.status(500).json({ message: error.message });
    }
};



export const updateRecommendation = async (req, res) => {
    try {
        const { recommendationId } = req.params;
        const { content } = req.body; // تمرير المحتوى الجديد
        const authUser = req.user;

        const user = await UserModel.findById(authUser._id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const recommendation = user.Recommendations.id(recommendationId);
        if (!recommendation) {
            return res.status(404).json({ message: "Recommendation not found" });
        }

        recommendation.content = content || recommendation.content;
        await user.save();

        return res.status(200).json({ 
            message: "Recommendation updated successfully", 
            recommendations: user.Recommendations // إعادة قائمة التوصيات فقط
        });
    } catch (error) {
        console.error("Error updating recommendation:", error);
        return res.status(500).json({ message: error.message });
    }
};


export const updateCertification = async (req, res) => {
    try {
        console.log("Body:", req.body);
        console.log("Files:", req.files);

        // أخذ المعرف من البارامتر في URL
        const { certificationId } = req.params;
        const { title, issuingOrganization, issueDate, expirationDate, credentialType } = req.body;
        const authuser = req.user;

        if (!authuser) {
            return res.status(404).json({ message: "User not found" });
        }

        // التحقق من وجود البيانات المطلوبة
        if (!title || !issuingOrganization || !issueDate || !credentialType) {
            return res.status(400).json({ message: "Missing required fields" });
        }

        // إيجاد المستخدم في قاعدة البيانات
        const user = await UserModel.findById(authuser._id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // إيجاد الشهادة التي سيتم تحديثها باستخدام المعرف من البارامتر
        const certification = user.Certifications.id(certificationId);
        if (!certification) {
            return res.status(404).json({ message: "Certification not found" });
        }

        // تحديث البيانات النصية
        certification.title = title;
        certification.issuingOrganization = issuingOrganization;
        certification.issueDate = issueDate;
        certification.expirationDate = expirationDate || null;
        certification.credentialType = credentialType;

        // التعامل مع الصورة
        if (credentialType === 'image') {
            // إذا كان النوع "صورة" وتم رفع صورة جديدة
            if (req.files && req.files.CertificationImage) {
                // رفع الصورة إلى Cloudinary
                const { secure_url, public_id } = await Cloudinary.uploader.upload(req.files.CertificationImage[0].path, {
                    folder: `GraduationProject1-Software/Certifications/${authuser._id}`,
                });

                // تحديث بيانات الصورة
                certification.certificationImageData = { secure_url, public_id };

                // مسح الرابط إذا كان موجودًا
                certification.certificationLinkData = null;
            } else {
                // إذا لم يتم رفع صورة جديدة، يتم مسح الصورة القديمة
                certification.certificationImageData = null;
            }
        } else {
            // إذا كان النوع "رابط" يتم مسح الصورة
            certification.certificationImageData = null;
            certification.certificationLinkData = req.body.certificationLinkData || null;
        }

        // حفظ التغييرات
        await user.save();

        return res.status(200).json({
            message: "Certification updated successfully",
            certifications: user.Certifications,
        });
    } catch (error) {
        console.error("Error in updateCertification:", error);
        return res.status(500).json({ message: "Internal server error", error: error.message });
    }
};



export const deleteCertification = async (req, res) => {
    try {
        const { certificationId } = req.params;
        const authuser = req.user;

        if (!authuser) {
            return res.status(404).json({ message: "User not found" });
        }

        // إيجاد المستخدم
        const user = await UserModel.findById(authuser._id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // حذف الشهادة باستخدام ID
        const certification = user.Certifications.id(certificationId);
        if (!certification) {
            return res.status(404).json({ message: "Certification not found" });
        }

        // حذف الشهادة
        user.Certifications.pull(certificationId);
        await user.save();

        return res.status(200).json({
            message: "Certification deleted successfully",
            certification: user.Certifications 
        });
    } catch (error) {
        console.error("Error deleting certification:", error);
        return res.status(500).json({ message: "Internal server error", error: error.message });
    }
};



export const getAllCertifications = async (req, res) => {
    try {
        const authuser = req.user;

        if (!authuser) {
            return res.status(404).json({ message: "User not found" });
        }

        // إيجاد المستخدم
        const user = await UserModel.findById(authuser._id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        return res.status(200).json({
            certifications: user.Certifications,
        });
    } catch (error) {
        console.error("Error fetching certifications:", error);
        return res.status(500).json({ message: "Internal server error", error: error.message });
    }
};

