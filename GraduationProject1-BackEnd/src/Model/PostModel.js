import { Schema, Types, model } from 'mongoose';

const PostSchema = new Schema({
    Body: {
        type: String,
        required: true,
    },
    Images: [
        {
            type:Object,
            required: false,
        }
    ],
    Videos: [
        {
            type:Object,
            required: false,
        }
    ],
    Files: [
        {
            type:Object,
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

// Adding a virtual field to calculate time difference since post creation
PostSchema.virtual('timeAgo').get(function () {
    return moment(this.createdAt).fromNow(); // `fromNow` gives relative time (e.g., "5 minutes ago")
});

const PostModel = model('Post', PostSchema);
export default PostModel;
