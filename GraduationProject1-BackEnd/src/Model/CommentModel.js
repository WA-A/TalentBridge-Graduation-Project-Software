import { Schema, Types, model } from 'mongoose';

const CommentSchema = new Schema({
    Text: {
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
    PostId: {
        type: Types.ObjectId,
        ref: 'Post',
        required: true,
    }
}, {
    timestamps: true,
});

const CommentModel = model('Comment', CommentSchema);
export default CommentModel;
