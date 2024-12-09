import mongoose, { Schema, model,Types } from 'mongoose';


const ProjectsSchema = new Schema({
  ProjectName: {
    type: String,
    required: true,
    trim: true,
  },
  Description: {
    type: String,
    required: true,
    trim: true,
  },
  CreatedBySenior: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  RequiredSkills: [{ type: String }],
  Field: {
    type: String,
    required: true,
    trim: true, 
  },
  Status: {
    type: String,
    enum: ['Open', 'In Progress', 'Completed'],
    default: 'Open',
  },
  DurationInMounths: {
    type: Number,
    required: true, 
  },
  PositionRole:
    [{ type: String }]
  ,
  WorkLoaction:{
    type: String,
    default: 'Remotely'
  },
  Benefits: {  
    type: String,  
    required: true,  
    trim: true,      
  },
  FileProject:[
    {
        type:Object,
        required: false,
    }
],
Price:{
  type: String,
},
  created_at: {
    type: Date,
    default: Date.now,
  },
  updated_at: {
    type: Date,
    default: Date.now,
  },
  juniors_applied: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', 
  }],
  createdBy:{type:Types.ObjectId,ref:'User'},
  updatedBy:{type:Types.ObjectId,ref:'User'},
},
{
 // timestamps:true,
   toJSON:{virtuals:true},
   toObject:{virtuals:true}
});

// // Middleware to update the 'updated_at' field automatically before each save
// ProjectsSchema.pre('save', function (next) {
//   this.updated_at = Date.now();
//   next();
// });


const ProjectsModel = model('Projects',ProjectsSchema); 
export default ProjectsModel;
