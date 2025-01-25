import ApplicationTrainModel from '../../Model/ApplicationTrainModel.js';
import UserModel from '../../Model/User.Model.js';
import ProjectsModel from '../../Model/ProjectsModel.js'; // استيراد نموذج المشروع
import ChatModel from "../../Model/ChatModel.js";
import AddUserToChatProject from "../../Model/ChatModel.js";  // استيراد الدالة الخاصة بإضافة المستخدم للدردشة



export const createapplicationtrain = async (req, res) => {
  try {
    const { projectId, roleId, NumberOfTrain, notes } = req.body;
    const userId = req.user._id; // استخراج userId من الـ token (افترض أنه تم التحقق من الـ JWT)

    // الحصول على بيانات المستخدم باستخدام الـ userId
    const user = await UserModel.findById(userId);
    if (!user) {
      return res.status(404).send({ message: 'User not found' });
    }

    // استخدام بيانات المستخدم (الإيميل ورقم الهاتف)
    const email = user.Email;
    const phoneNumber = user.PhoneNumber;

    // استرجاع المشروع باستخدام projectId
    const project = await ProjectsModel.findById(projectId);
    if (!project) {
      return res.status(404).send({ message: 'Project not found' });
    }

    // التحقق إذا كان المستخدم موجودًا بالفعل في الدور
    const existingApplication = await ApplicationTrainModel.findOne({
      userId,
      projectId,
      IsDeleted: false, // التأكد من أن الطلب لم يتم حذفه
    });

    if (existingApplication) {
      return res.status(200).send({
        alreadyApplied: true,
        message: 'You have already applied for this project.',
      });
    }

    // فحص إذا كان المشروع في وضع التلقائي أو اليدوي
    if (project.AutoApprovalSettings.isAutoApproval) {
      // إذا كان التلقائي، تحقق من أن عدد الأشخاص المتاحين لقبولهم أكبر من الصفر
      if (project.AutoApprovalSettings.maxAutoApproved > 0) {
        const role = project.Roles.find(role => role._id.toString() === roleId.toString());

        if (!role) {
          return res.status(404).send({ message: 'Role not found' });
        }

        // تعيين roleName من الدور
        const roleName = role.roleName;

        // تحقق إذا كان يمكن قبول الطلب تلقائيًا
        if (role.users.length < project.AutoApprovalSettings.maxAutoApproved) {
          // إضافة المستخدم إلى الدور مباشرة
          role.users.push({
            userId: userId,
            status: "Approved",
            appliedAt: new Date(),
          });

          // تحديث عدد الأشخاص المتبقيين للقبول في المشروع
          project.AutoApprovalSettings.maxAutoApproved -= 1;

          // حفظ التغييرات في المشروع
          await project.save();

          // إنشاء الطلب الجديد
          const application = new ApplicationTrainModel({
            userId,
            projectId,
            roleId,
            roleName,
            NumberOfTrain,
            Email: email,
            PhoneNumber: phoneNumber,
            notes,
            Status: "Accepted",  // تعيين حالة الطلب إلى "موافق"
          });

          // حفظ الطلب في قاعدة البيانات
          await application.save();

          // إضافة المستخدم إلى الدردشة الخاصة بالمشروع
          await AddUserToChatProject({ body: { ProjectId: projectId, UserId: userId } }, res, () => {});  // استدعاء دالة إضافة المستخدم للدردشة

          return res.status(201).send({
            message: 'Application accepted and added to the project, and user added to chat.',
            application,
          });
        } else {
          return res.status(400).send({ message: 'No available slots for automatic approval' });
        }
      } else {
        return res.status(400).send({ message: 'Automatic approval is disabled for this project' });
      }
    } else {
      // إذا كان يدوياً، يبقى الطلب في حالة "Pending"
      const application = new ApplicationTrainModel({
        userId,
        projectId,
        roleId,
        NumberOfTrain,
        roleName, // لا يتم قبول الطلب هنا
        Email: email,
        PhoneNumber: phoneNumber,
        notes,
        Status: "Pending",
      });

      // حفظ الطلب في قاعدة البيانات
      await application.save();

      return res.status(201).send({
        message: 'Application created successfully and waiting for manual approval',
        application,
      });
    }
  } catch (error) {
    res.status(500).send({ message: 'Server error', error });
  }
};

export const getApplicationsByProject = async (req, res) => {
  console.log("Fetching applications...");
  try {
    const { projectId } = req.params; // Get projectId from the URL parameters
    
    // البحث في مجموعة الطلبات بناءً على projectId
    const applications = await ApplicationTrainModel .find({ projectId: projectId })
      .populate({
        path: 'userId',
        select: 'FullName PictureProfile _id',  // Include user's name, email, profile picture, and _id
      });

    // التأكد من وجود طلبات
    if (applications.length === 0) {
      return res.status(404).send({ message: 'No applications found for this project' });
    }

    res.status(200).send({
      message: 'Applications fetched successfully',
      applications,
    });
  } catch (error) {
    res.status(500).send({ message: 'Server error', error });
  }
};

 // عرض جميع الطلبات الخاصة بجميع المشاريع التي أنشأها السنيور
 export const getApplicationsBySenior = async (req, res) => {
  try {
    // استخراج معرف السنيور من التوكن
    const seniorId = req.user._id;

    // العثور على جميع المشاريع التي أنشأها السنيور
    const projects = await ProjectsModel.find({ CreatedBySenior: seniorId });
    if (!projects || projects.length === 0) {
      return res.status(404).json({ message: "No projects found for this senior" });
    }

    // استخراج معرفات المشاريع
    const projectIds = projects.map((project) => project._id);

    // العثور على جميع الطلبات المرتبطة بهذه المشاريع
    const applications = await ApplicationTrainModel.find({ projectId: { $in: projectIds } })
      .populate({
        path: "userId", // جلب بيانات المستخدمين المرتبطين
        select: "name email profilePicture", // جلب الاسم والبريد الإلكتروني والصورة فقط
      })
      .populate({
        path: "projectId", // جلب بيانات المشروع
        select: "ProjectName Description", // جلب اسم المشروع والوصف فقط
      });

    if (!applications || applications.length === 0) {
      return res.status(404).json({ message: "No applications found for these projects" });
    }

    // تجهيز الرد
    res.status(200).json({
      message: "Applications fetched successfully",
      applications: applications.map((app) => ({
        applicationId: app._id,
        theUser: {
          userId: app.userId._id,
          userName: app.userId.name,
          userEmail: app.userId.email,
          userProfilePicture: app.userId.profilePicture, // جلب الصورة الشخصية
        },
        projectId: app.projectId._id,
        projectName: app.projectId.ProjectName,
        roleName: app.roleName,
        status: app.Status,
        appliedAt: app.createdAt,
      })),
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};
 

 // عرض طلب بناءً على رقم الطلب معين (ApplicationId)
export const getApplicationById = async (req, res) => {
   try {
     const { applicationId } = req.params; // الحصول على applicationId من باراميتر الـ URL
 
     const application = await ApplicationTrainModel.findById(applicationId);
 
     if (!application) {
       return res.status(404).send({ message: 'Application not found' });
     }
 
     res.status(200).send({
       message: 'Application fetched successfully',
       application,
     });
   } catch (error) {
     res.status(500).send({ message: 'Server error', error });
   }
 };
 

 // حذف الطلب من الجنيور
export const deleteApplication = async (req, res) => {
   try {
     const { applicationId } = req.params; // الحصول على applicationId من باراميتر الـ URL
 
     const application = await ApplicationTrainModel.findByIdAndDelete(applicationId);
 
     if (!application) {
       return res.status(404).send({ message: 'Application not found' });
     }
 
     res.status(200).send({
       message: 'Application deleted successfully',
     });
   } catch (error) {
     res.status(500).send({ message: 'Server error', error });
   }
 };

 // قبول الطلب وتحويل حالة الطلب إلى الموافقة
export const approveApplication = async (req, res) => {
   try {
     const { applicationId } = req.params; // الحصول على applicationId من باراميتر الـ URL
 
     const application = await ApplicationTrainModel.findById(applicationId);
 
     if (!application) {
       return res.status(404).send({ message: 'Application not found' });
     }
 
     // إذا كانت الحالة غير موافق عليها بعد، نقوم بتغييرها إلى "Approved"
     if (application.Status !== 'Approved') {
       application.Status = 'Approved';
       await application.save(); // حفظ التحديثات
       res.status(200).send({
         message: 'Application approved successfully',
         application,
       });
     } else {
       res.status(400).send({ message: 'Application is already approved' });
     }
   } catch (error) {
     res.status(500).send({ message: 'Server error', error });
   }
 };
 

 export const getProjectByApplicationId = async (applicationId) => {
   try {
     // جلب الطلب باستخدام المعرف المحدد (applicationId)
     const application = await ApplicationTrainModel.findById(applicationId)
       .populate('projectId'); // سيتم ملء بيانات المشروع باستخدام المشروع المرتبط بـ projectId
 
     if (!application) {
       throw new Error('Application not found');
     }
 
     // جلب بيانات المشروع المرتبطة بالطلب
     const project = application.projectId;
 
     // في حال وجدت المشروع، نعيد البيانات
     if (project) {
       return project; // يمكنك تخصيص البيانات التي ترغب في إرجاعها بناءً على احتياجاتك
     } else {
       throw new Error('Project not found');
     }
 
   } catch (error) {
     throw new Error(`Error fetching project: ${error.message}`);
   }
 };


 export const getPendingRequests = async (req, res) => {
  try {
    // استخراج userId من التوكن بعد التحقق في الـ middleware
    const userId = req.user._id;

    // استرجاع جميع الطلبات المعلقة للمستخدم الذي يملك الـ userId
    const pendingRequests = await ApplicationTrainModel.find({
      userId: userId,      // التحقق من الـ userId
      Status: 'Pending',    // تحديد أن الحالة "معلقة"
      IsDeleted: false,     // التحقق من أن الطلب ليس محذوفًا
    }).exec();

    // التحقق من وجود طلبات معلقة
    if (pendingRequests.length === 0) {
      return res.status(404).json({ message: 'No pending requests found' });
    }

    // إرسال استجابة تحتوي على جميع البيانات المسترجعة
    return res.status(200).json({
      message: 'Pending requests retrieved successfully',
      data: pendingRequests,
    });
  } catch (error) {
    console.error("Error fetching pending requests:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const RejectApplication = async (req, res) => {
  try {
    const { applicationId } = req.params; // الحصول على applicationId من باراميتر الـ URL

    // البحث عن الطلب المطلوب
    const application = await ApplicationTrainModel.findById(applicationId);

    if (!application) {
      return res.status(404).send({ message: 'Application not found' });
    }

    // التحقق من حالة الطلب
    if (application.Status === "Accepted") {
      // إزالة المستخدم من الـ Role في المشروع
      await ProjectsModel.updateOne(
        { "Roles.users.userId": application.userId }, // البحث عن المستخدم في الـ Roles
        {
          $pull: { "Roles.$.users": { userId: application.userId } }, // إزالة المستخدم
        }
      );

      // زيادة عدد الأشخاص المسموح لهم بالدخول
      await ProjectsModel.updateOne(
        { _id: application.projectId }, // البحث عن المشروع
        { $inc: { "AutoApprovalSettings.maxAutoApproved": 1 } } // زيادة العدد بمقدار 1
      );
    }

    // حذف الطلب
    await ApplicationTrainModel.findByIdAndDelete(applicationId);

    res.status(200).send({
      message: 'Application deleted successfully',
    });
  } catch (error) {
    res.status(500).send({ message: 'Server error', error });
  }
};
