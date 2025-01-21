import mongoose, { Schema, model } from 'mongoose';

const AdminSchema = new Schema({

    IsDeleted: {
      type: Boolean,
      default: false,
    },
    
}, {
   timestamps: true,
});

const AdminModel = model('Admin', AdminSchema);
export default AdminModel;
