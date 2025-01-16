import mongoose, { Schema, model,Types } from 'mongoose';


const ProjectsSchema = new Schema(
  {
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
      ref: "User",
      required: true,
    },
    RequiredSkills: [
      {
          id: { type: Number, required: true },
          name: { type: String, required: true },
          code: { type: String, required: true },
          Rate: { type: Number, required: true, min: 1, max: 5 }
      }
  ],
    Fields: [
      {
        id: { type: Number, required: true },
        sub_specialization: { type: String, required: true },
        code: { type: String, required: true },
      },
    ],
    Roles: [
      {
        roleName: { type: String, required: true }, // اسم الدور (مثال: 'Backend', 'Frontend')
        users: [
          {
            userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // معرف المستخدم
            status: {
              type: String,
              enum: ["Pending", "Approved", "Rejected"],
              default: "Pending",
            },
            appliedAt: { type: Date, default: Date.now }, // تاريخ الطلب
          },
        ],
      },
    ],
    Status: {
      type: String,
      enum: ["Open", "In Progress", "Completed"],
      default: "Open",
    },
    DurationInMounths: {
      type: String,
      required: true,
    },
    WorkLoaction: {
      type: String,
      default: "Remotely",
    },
    Benefits: {
      type: String,
      required: true,
      trim: true,
    },
    FileProject: [
      {
        type: Object,
        required: false,
      },
    ],
    Price: {
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
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);


// // Middleware to update the 'updated_at' field automatically before each save
// ProjectsSchema.pre('save', function (next) {
//   this.updated_at = Date.now();
//   next();
// });


const ProjectsModel = model('Projects',ProjectsSchema); 
export default ProjectsModel;
