import ApplicationTrainModel from '../../Model/ApplicationTrainModel.js';
import UserModel from '../../Model/User.Model.js';


// Create Application
export const CreateApplication = async (req, res) => {
    try {
       const { ProfileLink, NumberOfTrain } = req.body;  // اللينك وعدد ساعات التدريب
       const { _id, Email, PhoneNumber } = req.user;  // جلب البيانات من التوكن (المستخدم الذي قام بتسجيل الدخول)
 
       console.log('User data:', req.user);  // طباعة البيانات للتحقق
 
       // تحقق من وجود البيانات
       if (!ProfileLink || !NumberOfTrain) {
          return res.status(400).json({ message: 'ProfileLink and NumberOfTrain are required' });
       }
 
       // إنشاء تطبيق جديد باستخدام البيانات المستخرجة
       const application = new ApplicationTrainModel({
          ProfileLink,
          NumberOfTrain,
          UserId: _id,  // تخزين UserId الذي تم استرداده من التوكن
          Email,  // تخزين البريد الإلكتروني من بيانات المستخدم
          PhoneNumber,  // تخزين رقم الجوال من بيانات المستخدم
       });
 
       console.log('Saving application data:', application);  // طباعة البيانات قبل الحفظ
 
       // حفظ التطبيق في قاعدة البيانات
       await application.save();
 
       console.log('Application saved successfully!');  // طباعة رسالة نجاح الحفظ
 
       // إرجاع استجابة بنجاح
       res.status(201).json({ message: 'Application created successfully', application });
    } catch (error) {
       console.error('Error in CreateApplication:', error.message);
       res.status(500).json({ error: error.message });
    }
 };
 
 
 
 
 
 
 
 
 
