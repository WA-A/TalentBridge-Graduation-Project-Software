import ApplicationTrainModel from '../../Model/ApplicationTrainModel.js';
import UserModel from '../../Model/User.Model.js';
import ProjectsModel from '../../Model/ProjectsModel.js'; // استيراد نموذج المشروع

// Create Application
// Create Application
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
     
     // البحث عن الدور باستخدام roleId داخل المشروع
     const role = project.Roles.find(role => role._id.toString() === roleId.toString());

     if (!role) {
       return res.status(404).send({ message: 'Role not found' });
     }

     // تعيين roleName من الدور
     const roleName = role.roleName;

     // جلب جميع بيانات الدور
     const roleDetails = {
       roleName: role.roleName,
       users: role.users,  // قائمة المستخدمين المرتبطين بالدور
       status: role.status, // حالة الدور
       appliedAt: role.appliedAt, // تاريخ الطلب
     };

     // إنشاء طلب جديد
     const application = new ApplicationTrainModel({
       userId,
       projectId,
       roleId,
       roleName,  // إضافة roleName هنا
       NumberOfTrain,
       Email: email,
       PhoneNumber: phoneNumber,
       notes,
     });
 
     // حفظ الطلب في قاعدة البيانات
     await application.save();  // حفظ الكائن application
     
     // إرجاع بيانات الطلب والدور
     res.status(201).send({
       message: 'Application created successfully',
       application,
       roleDetails,  // إرجاع تفاصيل الدور
     });
   } catch (error) {
     res.status(500).send({ message: 'Server error', error });
   }
};


// عرض جميع الطلبات الخاصة بمشروع معين
export const getApplicationsByProject = async (req, res) => {
   try {
     const { projectId } = req.params; // الحصول على projectId من باراميتر الـ URL
 
     const project = await ProjectsModel.findById(projectId).populate({
       path: 'Roles.users.userId',
       select: 'name email',  // تضمين بيانات المستخدمين (الاسم والبريد الإلكتروني)
     });
 
     if (!project) {
       return res.status(404).send({ message: 'Project not found' });
     }
 
     const applications = [];
     // الحصول على جميع الطلبات المرتبطة بكل دور في المشروع
     project.Roles.forEach(role => {
       role.users.forEach(user => {
         applications.push({
           roleName: role.roleName,
           userId: user.userId._id,
           status: user.status,
           appliedAt: user.appliedAt,
         });
       });
     });
 
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
     const seniorId = req.user._id; // استخراج userId من التوكن (يفترض أن السنيور هو المستخدم الحالي)
 
     // العثور على جميع المشاريع التي أنشأها السنيور
     const projects = await ProjectsModel.find({ CreatedBySenior: seniorId }).populate({
       path: 'Roles.users.userId',
       select: 'name email',  // تضمين بيانات المستخدمين (الاسم والبريد الإلكتروني)
     });
 
     if (!projects || projects.length === 0) {
       return res.status(404).send({ message: 'No projects found for this senior' });
     }
 
     const applications = [];
     // الحصول على جميع الطلبات المرتبطة بكل مشروع
     projects.forEach(project => {
       project.Roles.forEach(role => {
         role.users.forEach(user => {
           applications.push({
             projectName: project.ProjectName,
             roleName: role.roleName,
             userId: user.userId._id,
             status: user.status,
             appliedAt: user.appliedAt,
           });
         });
       });
     });
 
     res.status(200).send({
       message: 'Applications fetched successfully',
       applications,
     });
   } catch (error) {
     res.status(500).send({ message: 'Server error', error });
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