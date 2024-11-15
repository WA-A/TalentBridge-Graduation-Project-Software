import mongoose, { Schema, model } from 'mongoose';


const UserSchema = new Schema({
   FullName:{
      type: String,
       required:true,
       min:4,
       max:20
    }, 
    UserName:{
      type: String,
       min:4,
       max:20
    },
    Email:{
        type:String,
        unique:true
     },
     Password:{
        type:String,
        required:true
     },
     ConfirmPassword:{
      type:String,
      default:false
   },
     PhoneNumber:{
      type:String
     },
    Address:{
    type:String
    },
    BirthDate: {
      type:Date,
      required: true // Make this field mandatory
  },
    Location:{
      type:String
      },
     Gender:{
        type:String,
        enum:['Male','Female'],
     },
     IsDeleted:{ // delete user and may return after delete
      type:Boolean,
      default:false,
      },
     PictureProfile:{
      type:Object
     },
     About:{
      type:String,
     },
     Bio:{
      type:String,
     },
     YearsOfExperience: {
      type: Number,
      required: function() { return this.Role === 'Senior'; } 
   },
     Role:{
        type:String,
        default:'Junior',
        enum:['Junior','Senior','Admin'],
     },
     SendCode:{
      type:String,
        default:null,
     },
     ConfirmEmail:{
      type:String,
      default:false
   },
   Field: { 
      type: String, 
      enum: ['IT', 'Digital Marketing', 'Decor Design', 'Graphic Design'], 
      required: true 
   }
    },
    {
     timestamps:true,
    }  
);
 

const UserModel = model('User',UserSchema); 
export default UserModel;