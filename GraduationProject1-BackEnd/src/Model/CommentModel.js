import { Schema, Types, model } from 'mongoose';

const CommentSchema = new Schema({
    Text: {
        type: String,
    },
    Images: [ 
        {
            type: Object,
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
