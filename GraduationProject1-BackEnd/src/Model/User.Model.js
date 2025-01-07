import mongoose, { Schema, model } from 'mongoose';


const UserSchema = new Schema({
   FullName: {
      type: String,
      required: true,
      min: 4,
      max: 20
   },
   UserName: {
      type: String,
      min: 4,
      max: 20
   },
   Email: {
      type: String,
      unique: true,
      required: true, 
   },
   Password: {
      type: String,
      required: true
   },
   ConfirmPassword: {
      type: String,
      default: false
   },
   PhoneNumber: {
      type: String
   },
   Location: {
      type: String
   },
   BirthDate: {
      type: Date,
      required: true // Make this field mandatory
   },
   Gender: {
      type: String,
      enum: ['Male', 'Female'],
   },
   IsDeleted: { // delete user and may return after delete
      type: Boolean,
      default: false,
   },
   PictureProfile: {
      type: Object
   },
   CoverImage: {
      type: Object
   },
   About: {
      type: String,
   },
   Bio: {
      type: String,
   },
   YearsOfExperience: {
      type: Number,
      required: function () { return this.Role === 'Senior'; }
   },
   Role: {
      type: String,
      default: 'Junior',
      enum: ['Junior', 'Senior', 'Admin'],
   },
   SendCode: {
      type: String,
      default: null,
   },
   NewPassword: {
      type: String,
   },
   ConfirmNewPassword: {
      type: String,
      default: false
   },
   Field:[
      {
         id: { type: Number, required: true },
         sub_specialization: { type: String, required: true },
         code: { type: String, required: true }
      }
   ],
    // الحقول الجديدة
    Experiences: [
      {
         name: String,
         jobTitle: String,
         startDate: Date,
         endDate: Date,
         isContinuing: Boolean,
         Description:String,
      }
   ],

   Education: [
      {
         universityName: String,
         degree: String,
         fieldOfStudy: String
      }
   ],


   Recommendations: [
      {
         text: String,
         author: String,
         date: Date
      }
   ],

Certifications: [
   {
      title: { type: String, required: true },
      issuingOrganization: { type: String, required: true },
      issueDate: { type: String, required: true },
      expirationDate: { type: String, default: null },
      credentialType: { type: String, enum: ['link', 'image'], required: true },
      certificationImageData: {type: Object},
      certificationLinkData:{type: String},
   }
],

Languages: [
   {
      id: { type: Number, required: true },
      name: { type: String, required: true },
      code: { type: String, required: true }
   }
],

Skills: [
   {
      id: { type: Number, required: true },
      name: { type: String, required: true },
      code: { type: String, required: true },
      Rate: { type: Number, required: true, min: 1, max: 5 }
   }
],
deviceToken: {  // حقل جديد لتخزين توكن الجهاز
   type: String,
   default: null,  // يمكن أن يكون null إذا لم يكن هناك توكن
 },

},

   {
      timestamps: true,
   }
);


const UserModel = model('User', UserSchema);
export default UserModel;