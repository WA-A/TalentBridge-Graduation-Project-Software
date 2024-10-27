import mongoose, { Schema, model } from 'mongoose';


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
  RequiredSkills: {
    type: [String], // Array of skill names
    required: true,
  },
  Status: {
    type: String,
    enum: ['Open', 'In Progress', 'Completed'],
    default: 'Open',
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
  timestamps:true,
   toJSON:{virtuals:true},
   toObject:{virtuals:true}
});

// Middleware to update the 'updated_at' field automatically before each save
projectSchema.pre('save', function (next) {
  this.updated_at = Date.now();
  next();
});


const ProjectsModel = model('Projects',ProjectsSchema); 
export default ProjectsModel;
