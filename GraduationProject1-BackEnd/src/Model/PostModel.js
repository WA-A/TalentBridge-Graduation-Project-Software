import { Schema, Types, model } from 'mongoose';

const PostSchema = new Schema({
    Title: {
        type: String,
        required: true,
    },
    Body: {
        type: String,
        required: true,
    },
    Images: [
        {
            type: String,
            required: false,
        }
    ],
    Videos: [
        {
            type: String,
            required: false,
        }
    ],
    Files: [
        {
            type: String,
            required: false,
        }
    ],
    UserId: {
        type: Types.ObjectId,
        ref: 'User',
        required: true,
    },
    ProfileImage: {
        type: String,
        required: true,
    },
    like: [
        {
            type: Types.ObjectId,
            ref: 'User'
        }
    ],
}, {
    timestamps: true,
});

const PostModel = model('Post', PostSchema);
export default PostModel;
