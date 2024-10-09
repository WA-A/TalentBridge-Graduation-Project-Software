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
     IsDeleted:{ // delete user and may return after delete
     type:Boolean,
     default:false,
     },
     Password:{
        type:String,
        required:true
     },
     Phone:{
      type:String
     },
    Address:{
    type:String
    },
     ConfirmEmail:{
        type:Boolean,
        default:false
     },
     gender:{
        type:String,
        enum:['Male','Female'],
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
     YearsOfExperience:{
      type:Number
     },
     Status:{
        type:String,
        default:'Active',
        enum:['Active','NotActive'],
     },
     Role:{
        type:String,
        default:'Junior',
        enum:['Junior','Senior','Admin'],
     },
     SendCode:{
      type:String,
        default:null,
     }
    },
    {
     timestamps:true,
    }  
);
 

const UserModel = model('User',UserSchema); // no relation in mongodb [ no sql]
export default UserModel;