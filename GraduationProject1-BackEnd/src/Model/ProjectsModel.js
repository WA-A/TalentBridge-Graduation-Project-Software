import mongoose, { Schema, model } from 'mongoose';

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
        Rate: { type: Number, required: true, min: 1, max: 5 },
      },
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
        roleName: { type: String, required: true },
        users: [
          {
            userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
            status: {
              type: String,
              enum: ["Pending", "Approved", "Rejected"],
              default: "Pending",
            },
            appliedAt: { type: Date, default: Date.now },
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
      type: Number,
    },
    Tasks: [
      {
        PhaseName: { type: String, required: true },
        TaskName: { type: String, required: true, trim: true },
        Description: { type: String, required: false, trim: true },
        AssignedTo: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        TaskRoleName: { type: String, required: true },
        TaskStatus: {
          type: String,
          enum: ["Pending", "In Progress", "Completed"],
          default: "Pending",
        },
        Priority: {
          type: String,
          enum: ["Low", "Medium", "High"],
          default: "Medium",
        },
        StartDate: { type: Date, required: true },
        EndDate: { type: Date, required: true },
        created_at: { type: Date, default: Date.now },
        updated_at: { type: Date, default: Date.now },
      },
    ],
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

const ProjectsModel = model('Projects', ProjectsSchema);
export default ProjectsModel;
