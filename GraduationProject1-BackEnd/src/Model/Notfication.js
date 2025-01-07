import mongoose from 'mongoose';

const NotificationSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },  // مرجع للمستخدم
    type: { 
        type: String, 
        enum: ['message', 'update', 'reminder', 'warning', 'system','comment','like'],  // أنواع الإشعارات الممكنة
        required: true 
    },
    title: { type: String, required: true },  // عنوان الإشعار
    message: { type: String, required: true },  // نص الإشعار
    dateSent: { type: Date, default: Date.now },  // تاريخ إرسال الإشعار
    status: { type: String, enum: ['unread', 'read'], default: 'unread' },  // حالة الإشعار
    action: { type: String, default: null },  // رابط مرفق بالإشعار، مثل: "/notifications/123"
    data: { type: mongoose.Schema.Types.Mixed, default: null },  // بيانات إضافية مرفقة بالإشعار
    priority: { type: String, enum: ['low', 'medium', 'high'], default: 'medium' },  // أولوية الإشعار
    seenByUser: { type: Boolean, default: false },  // هل تم مشاهدة الإشعار من قبل المستخدم
});

const Notification = mongoose.model('Notification', NotificationSchema);

export default Notification;
