import mongoose, { Schema, model } from 'mongoose';


const ApplicationTrainSchema = new Schema({
   ProfileLink: {
      type: String,
      required: true,
   },
   NumberOfTrain: {
      type: String,
   },
   Email:{
      type: String,
   },
   PhoneNumber:{
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
      required: true,
      default:'Pending'
   },
},

   {
      timestamps: true,
   }
);


const ApplicationTrainModel = model('ApplicationTrain', ApplicationTrainSchema);
export default ApplicationTrainModel;