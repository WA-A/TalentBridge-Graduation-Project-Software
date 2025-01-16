import mongoose, { Schema, model } from 'mongoose';


const RequestSeniorToAdminSchema = new Schema({
    PreviousExperiences: { // 'خبرات سابقة'
        type: String, 
        required: true, 
      },
      Motivation: { // 'لماذا يريد الشخص أن يصبح سينيور'
        type: String,
        required: true,
      },
      Contribution: { // 'كيف يمكنه المساهمة في تطوير الفرق الجينيور'
        type: String,
        required: true,
      },
      Certifications: { 
        type: [String], 
        required: false, 
      },
      Major: { 
        type: String, 
        required: true, 
      },
   IsDeleted: { 
      type: Boolean,
      default: false,
   },
},

   {
      timestamps: true,
   }
);


const RequestSeniorToAdminModel = model('RequestSeniorToAdmin', RequestSeniorToAdminSchema);
export default RequestSeniorToAdminModel;