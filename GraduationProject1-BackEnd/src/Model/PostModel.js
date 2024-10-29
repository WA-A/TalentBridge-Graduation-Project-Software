import { Schema, Types, model } from 'mongoose';

const PostSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    body: {
        type: String,
        required: true,
    },
    images: [
        {
            type: String,
            required: false,
        }
    ],
    videos: [
        {
            type: String,
            required: false,
        }
    ],
    files: [
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
    profileImage: {
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
