import ChatModel from "../../Model/ChatModel.js";
import cloudinary from './../../../utls/Cloudinary.js';
import fs from 'fs';


export const CreateChat = async (req, res, next) => {
    try {
        const { OtherUserId, FirstMessage } = req.body;

        if (!FirstMessage || !OtherUserId) {
            return next(new Error("Both FirstMessage and OtherUserId are required."));
        }

        let media = [];

        if (req.files) {
            if (req.files['images']) {
                const images = await Promise.all(req.files['images'].map(async (file) => {
                    const { secure_url, public_id } = await cloudinary.uploader.upload(file.path, {
                        folder: `Chats/${req.user._id}`,
                    });
                    fs.unlinkSync(file.path);
                    return { secure_url, public_id };
                }));
                media.push(...images);
            }

            if (req.files['videos']) {
                const videos = await Promise.all(req.files['videos'].map(async (file) => {
                    const { secure_url, public_id } = await cloudinary.uploader.upload(file.path, {
                        resource_type: 'video',
                        folder: `Chats/${req.user._id}`,
                    });
                    fs.unlinkSync(file.path);
                    return { secure_url, public_id };
                }));
                media.push(...videos);
            }

            if (req.files['files']) {
                const files = await Promise.all(req.files['files'].map(async (file) => {
                    const { secure_url, public_id } = await cloudinary.uploader.upload(file.path, {
                        resource_type: 'auto',
                        folder: `Chats/${req.user._id}`,
                    });
                    fs.unlinkSync(file.path);
                    return { secure_url, public_id };
                }));
                media.push(...files);
            }
        }

        const messageType = media.length > 0 ? (
            media[0].secure_url ? 'image' : 
            media[0].video_url ? 'video' : 'file'
        ) : 'text';

        const chat = await ChatModel.create({
            users: [req.user._id, OtherUserId],
            messages: [
                {
                    sender: req.user._id,
                    content: FirstMessage,
                    messageType: messageType,
                    media: media,
                },
            ],
        });

        if (!chat) {
            return next(new Error("Failed to create the chat."));
        }

        return res.status(201).json({ message: "Chat created successfully.", chat });
    } catch (error) {
        console.error("Error creating chat:", error);
        return next(error);
    }
};


export const AddMessageToChat = async (req, res) => {
    try {
        const loggedInUserId = req.user.id;  
        const { ChatId, MessageContent, messageType = 'text', media = null } = req.body;

        if (!ChatId || !MessageContent) {
            return res.status(400).json({ message: 'Chat ID and message content are required' });
        }

        const chat = await ChatModel.findById(ChatId);
        if (!chat) {
            return res.status(404).json({ message: 'Chat not found' });
        }

        if (!chat.users.includes(loggedInUserId)) {
            return res.status(403).json({ message: 'You are not authorized to send messages in this chat' });
        }

        let uploadedMedia = [];

        if (req.files) {
            if (req.files['images']) {
                const images = await Promise.all(req.files['images'].map(async (file) => {
                    const { secure_url, public_id } = await cloudinary.uploader.upload(file.path, {
                        folder: `Chats/${loggedInUserId}`,
                    });
                    fs.unlinkSync(file.path);
                    return { secure_url, public_id };
                }));
                uploadedMedia.push(...images);
            }

            if (req.files['videos']) {
                const videos = await Promise.all(req.files['videos'].map(async (file) => {
                    const { secure_url, public_id } = await cloudinary.uploader.upload(file.path, {
                        resource_type: 'video',
                        folder: `Chats/${loggedInUserId}`,
                    });
                    fs.unlinkSync(file.path);
                    return { secure_url, public_id };
                }));
                uploadedMedia.push(...videos);
            }

            if (req.files['files']) {
                const files = await Promise.all(req.files['files'].map(async (file) => {
                    const { secure_url, public_id } = await cloudinary.uploader.upload(file.path, {
                        resource_type: 'auto',
                        folder: `Chats/${loggedInUserId}`,
                    });
                    fs.unlinkSync(file.path);
                    return { secure_url, public_id };
                }));
                uploadedMedia.push(...files);
            }
        }

        const finalMessageType = uploadedMedia.length > 0 ? (
            uploadedMedia[0].secure_url ? 'image' : 
            uploadedMedia[0].video_url ? 'video' : 'file'
        ) : messageType;

        chat.messages.push({
            sender: loggedInUserId,
            content: MessageContent,
            messageType: finalMessageType,
            media: uploadedMedia,
        });

        await ChatModel.findByIdAndUpdate(ChatId, { messages: chat.messages }, { new: true });

        return res.status(200).json({ message: 'Message added successfully', chat });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Failed to add message' });
    }
};


export const GetAllChats = async (req, res) => {
    try {
        const loggedInUserId = req.user.id;  

        const chats = await ChatModel.find({
            users: loggedInUserId  
        });

        if (chats.length === 0) {
            return res.status(404).json({ message: 'No chats found for this user' });
        }

        return res.status(200).json({ message: 'Chats retrieved successfully', chats });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Failed to retrieve chats' });
    }
};





export const UpdateMessageInChat = async (req, res, next) => {
    try {
        const { ChatId, MessageId, NewContent, NewMedia, MessageType = 'text' } = req.body;  // بيانات الطلب

        if (!ChatId || !MessageId || !NewContent) {
            return next(new Error("ChatId, MessageId, and new content are required."));
        }

        const chat = await ChatModel.findById(ChatId);
        if (!chat) {
            return next(new Error("Chat not found."));
        }

        const message = chat.messages.id(MessageId);
        if (!message) {
            return next(new Error("Message not found."));
        }

        if (message.sender.toString() !== req.user._id.toString()) {
            return next(new Error("You are not authorized to edit this message."));
        }

        message.content = NewContent;
        message.messageType = MessageType;
        message.media = NewMedia || message.media; 

        let media = [];

        if (req.files) {
            if (req.files['images']) {
                const images = await Promise.all(req.files['images'].map(async (file) => {
                    const { secure_url, public_id } = await cloudinary.uploader.upload(file.path, {
                        folder: `Chats/${req.user._id}`,
                    });
                    fs.unlinkSync(file.path);
                    return { secure_url, public_id };
                }));
                media.push(...images);
            }

            if (req.files['videos']) {
                const videos = await Promise.all(req.files['videos'].map(async (file) => {
                    const { secure_url, public_id } = await cloudinary.uploader.upload(file.path, {
                        resource_type: 'video',
                        folder: `Chats/${req.user._id}`,
                    });
                    fs.unlinkSync(file.path);
                    return { secure_url, public_id };
                }));
                media.push(...videos);
            }

            if (req.files['files']) {
                const files = await Promise.all(req.files['files'].map(async (file) => {
                    const { secure_url, public_id } = await cloudinary.uploader.upload(file.path, {
                        resource_type: 'auto',
                        folder: `Chats/${req.user._id}`,
                    });
                    fs.unlinkSync(file.path);
                    return { secure_url, public_id };
                }));
                media.push(...files);
            }
        }

        if (media.length > 0) {
            message.media = media;
        }

        message.messageType = media.length > 0 ? (
            media[0].secure_url ? 'image' :
            media[0].video_url ? 'video' : 'file'
        ) : 'text';

        await chat.save();

        return res.status(200).json({ message: "Message updated successfully.", chat });
    } catch (error) {
        console.error("Error editing message:", error);
        return next(error);
    }
};


export const DeleteMessageFromChat = async (req, res, next) => {
    try {
        const { ChatId, MessageId } = req.body;

        if (!ChatId || !MessageId) {
            return next(new Error("Both chatId and messageId are required."));
        }

        const chat = await ChatModel.findById(ChatId);
        if (!chat) {
            return next(new Error("Chat not found."));
        }

        const message = chat.messages.id(MessageId);
        if (!message) {
            return next(new Error("Message not found."));
        }

        if (message.sender.toString() !== req.user._id.toString()) {
            return next(new Error("You are not authorized to delete this message."));
        }

        message.remove();

        await chat.save();

        return res.status(200).json({
            message: "Message deleted successfully.",
            chat,
        });
    } catch (error) {
        console.error("Error deleting message:", error);
        return next(error);
    }
};


export const DeleteChat = async (req, res, next) => {
    try {
        const { ChatId } = req.body;

        if (!ChatId) {
            return next(new Error("ChatId is required."));
        }

        const chat = await ChatModel.findById(ChatId);
        if (!chat) {
            return next(new Error("Chat not found."));
        }

        if (!chat.users.includes(req.user._id)) {
            return next(new Error("You are not authorized to delete this chat."));
        }

        await ChatModel.findByIdAndDelete(ChatId);

        return res.status(200).json({
            message: "Chat deleted successfully.",
        });
    } catch (error) {
        console.error("Error deleting chat:", error);
        return next(error);
    }
};
