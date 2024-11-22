import { Schema, Types, model } from 'mongoose';

const ChatSchema = new Schema(
    {
        users: [
            {
                type: Types.ObjectId,
                ref: 'User',
                required: true, 
            },
        ],
        messages: [
            {
                _id: { type: Types.ObjectId, auto: true },
                sender: {
                    type: Types.ObjectId,
                    ref: 'User',
                    required: true, 
                },
                content: {
                    type: String,
                    required: function () {
                        return this.messageType === 'text'; 
                    },
                },
                messageType: {
                    type: String,
                    enum: ['text', 'image', 'video', 'file'], 
                    required: true,
                },
                media: {
                    type: Object, 
                    required: function () {
                        return ['image', 'video', 'file'].includes(this.messageType); 
                    },
                },
                timestamp: {
                    type: Date,
                    default: Date.now, 
                },
            },
        ],
    },
    {
        timestamps: true, 
    }
);

const ChatModel = model('Chat', ChatSchema);

export default ChatModel;
