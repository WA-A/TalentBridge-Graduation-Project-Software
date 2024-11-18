import { Schema, Types, model } from 'mongoose';

const ChatSchema = new Schema({
    users: [{ 
        type: Types.ObjectId, 
        ref: 'User', 
        required: true 
    }],  
    
    messages: [{
        sender: {
            type: Types.ObjectId,
            ref: 'User', 
            required: true,
        },
        message: {
            type: String,
            required: function() { return this.messageType === 'text'; },
        },
        messageType: { 
            type: String, 
            enum: ['text', 'image', 'video', 'file'], 
            required: true,
        },
        
        images: [{
            type: Object, 
            required: function() { return this.messageType === 'image'; },
        }],
        videos: [{
            type: Object, 
            required: function() { return this.messageType === 'video'; },
        }],
        files: [{
            type: Object, 
            required: function() { return this.messageType === 'file'; },
        }],
    }],  
    timestamp: { 
        type: Date, 
        default: Date.now, 
    },
    createdAt: { 
        type: Date, 
        default: Date.now,  
    },
    updatedAt: { 
        type: Date, 
        default: Date.now,  
    }
}, {
    timestamps: true,
});



const ChatModel = model('Chat', ChatSchema);
export default ChatModel;
