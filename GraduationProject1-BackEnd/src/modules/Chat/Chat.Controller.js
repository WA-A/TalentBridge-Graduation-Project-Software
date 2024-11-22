import ChatModel from "../../Model/ChatModel.js";



export const CreateChat = async (req, res) => {
    try {
        const loggedInUserId = req.user.id; 

        const { otherUserId, firstMessage } = req.body; 

        if (!otherUserId) {
            return res.status(400).json({ message: 'Other user ID is required to create a chat' });
        }

        if (!firstMessage || !firstMessage.content) {
            return res.status(400).json({ message: 'The first message is required' });
        }

        const newChat = new ChatModel({
            users: [loggedInUserId, otherUserId],
            messages: [
                {
                    sender: loggedInUserId, 
                    content: firstMessage.content, 
                    messageType: firstMessage.messageType || 'text', 
                    media: firstMessage.media || null, 
                }
            ]
        });

        await newChat.save();

        return res.status(201).json({ message: 'Chat created successfully', chat: newChat });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'An error occurred while creating the chat' });
    }
};




export const AddMessageToChat = async (req, res) => {
    try {
        const loggedInUserId = req.user.id;  
        const { chatId, messageContent, messageType = 'text', media = null } = req.body;

        if (!chatId || !messageContent) {
            return res.status(400).json({ message: 'Chat ID and message content are required' });
        }

        const chat = await ChatModel.findById(chatId);
        if (!chat) {
            return res.status(404).json({ message: 'Chat not found' });
        }

        if (!chat.users.includes(loggedInUserId)) {
            return res.status(403).json({ message: 'You are not authorized to send messages in this chat' });
        }

        chat.messages.push({
            sender: loggedInUserId,
            content: messageContent,
            messageType: messageType,
            media: media,
        });

        await chat.save();
        return res.status(200).json({ message: 'Message added successfully', chat });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Failed to add message' });
    }
};


