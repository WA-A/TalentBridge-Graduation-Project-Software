import mongoose, { Schema, model } from 'mongoose';

const ApplicationTrainSchema = new Schema({
   userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Projects",
      required: true,
    },
    roleName: {
      type: String,  // تخزين اسم الدور (مثل: "Frontend"، "Backend")
      required: true,
    },
    roleId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Projects.Roles",  // ربط الدور بنموذج الأدوار في المشروع
      required: true,
    },
    NumberOfTrain: {
      type: String,
    },
    Email: {
      type: String,
    },
    PhoneNumber: {
      type: String,
    },
    IsDeleted: {
      type: Boolean,
      default: false,
    },
    deletedAt: {
      type: Date,  // تاريخ الحذف
    },
    Status: {
      type: String,
      enum: ['Pending', 'Accepted', 'Rejected'],
      required: true,
      default: 'Pending',
    },
    notes: {
      type: String,  // ملاحظات الجنيور
      required: false,
    },
}, {
   timestamps: true,
});

const ApplicationTrainModel = model('ApplicationTrain', ApplicationTrainSchema);
export default ApplicationTrainModel;
