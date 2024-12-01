import mongoose, { Schema, model } from 'mongoose';


const ApplicationSchema = new Schema({
   ProfileLink: {
      type: String,
      required: true,
   },
   NumberOfTrain: {
      type: String,
   },
   IsDeleted: { 
      type: Boolean,
      default: false,
   },
   Status: {
      type: String,
      enum: [
         'Pending',
         'Accepted',
         'Rejected',
      ],
      required: true
   },
   createdBy:{type:Types.ObjectId,ref:'Application'},
   updatedBy:{type:Types.ObjectId,ref:'Application'},
},

   {
      timestamps: true,
   }
);


const AplicationModel = model('Application', ApplicationSchema);
export default AplicationModel;