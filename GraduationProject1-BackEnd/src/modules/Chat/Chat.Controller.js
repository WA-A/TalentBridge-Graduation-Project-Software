import ChatModel from "../../Model/ChatModel.js";
import cloudinary from './../../../utls/Cloudinary.js';
import UserModel from "../../Model/User.Model.js";
import ProjectsModel from "../../Model/ProjectsModel.js";
import mongoose from 'mongoose';

import fs from 'fs';

export const sendMessage = async (req, res) => {
    try {
        const loggedInUserId = req.user._id;  // المستخدم الذي يرسل الرسالة
        const { userId, MessageContent, messageType = 'text' } = req.body;

        if (!userId || !MessageContent) {
            return res.status(400).json({ message: 'User ID and message content are required' });
        }

        // البحث عن محادثة بين المستخدمين
        let chat = await ChatModel.findOne({ users: { $all: [loggedInUserId, userId] } });

        // إذا لم توجد محادثة، يتم إنشاؤها
        if (!chat) {
            chat = new ChatModel({
                users: [loggedInUserId, userId], 
                messages: []
            });
        }

        // إنشاء الرسالة
        const newMessage = {
            sender: loggedInUserId,
            content: MessageContent,
            messageType,
            timestamp: new Date(),
        };

        // إضافة الرسالة إلى المحادثة
        chat.messages.push(newMessage);
        await chat.save();

        return res.status(200).json({ message: 'Message sent successfully', chat });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Failed to send message' });
    }
};
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


export const AddMessageToChat = async (req, res, next) => {
    try {
        const { MessageContent } = req.body;
        const loggedInUserId = req.user._id;  // المستخدم المتصل
        const otherUserId = req.params.otherUserId; // المستخدم الآخر

        if (!MessageContent || !otherUserId) {
            return next(new Error("Message content and other user ID are required."));
        }

        const existingChat = await ChatModel.findOne({
            users: { $all: [loggedInUserId, otherUserId] },
            project: null
        });

        if (existingChat) {
            const images = req.files['images'] ? await Promise.all(req.files['images'].map(async (file) => {
                const { secure_url, public_id } = await cloudinary.uploader.upload(file.path, { folder: `Chats/${loggedInUserId}` });
                return { secure_url, public_id, originalname: file.originalname };
            })) : [];

            const videos = req.files['videos'] ? await Promise.all(req.files['videos'].map(async (file) => {
                const { secure_url, public_id } = await cloudinary.uploader.upload(file.path, { folder: `Chats/${loggedInUserId}`, resource_type: "video" });
                return { secure_url, public_id, originalname: file.originalname };
            })) : [];

            const files = req.files['files'] ? await Promise.all(req.files['files'].map(async (file) => {
                const { secure_url, public_id } = await cloudinary.uploader.upload(file.path, { folder: `Chats/${loggedInUserId}` });
                return { secure_url, public_id, originalname: file.originalname };
            })) : [];

            const messageType = (images.length > 0) ? 'image' :
                (videos.length > 0) ? 'video' :
                (files.length > 0) ? 'file' : 'text';

            const newMessage = {
                sender: loggedInUserId,
                content: MessageContent,
                messageType,
                media: [...images, ...videos, ...files],
                timestamp: Date.now(),
            };

            existingChat.messages.push(newMessage);
            await existingChat.save();

            return res.status(200).json({
                message: "Message added successfully to existing chat.",
                chat: existingChat,
            });
        }

        // إنشاء دردشة جديدة إذا لم تكن موجودة
        const newChat = new ChatModel({
            users: [loggedInUserId, otherUserId],
            messages: [],
            project: null,
        });

        const images = req.files['images'] ? await Promise.all(req.files['images'].map(async (file) => {
            const { secure_url, public_id } = await cloudinary.uploader.upload(file.path, { folder: `Chats/${loggedInUserId}` });
            return { secure_url, public_id, originalname: file.originalname };
        })) : [];

        const videos = req.files['videos'] ? await Promise.all(req.files['videos'].map(async (file) => {
            const { secure_url, public_id } = await cloudinary.uploader.upload(file.path, { folder: `Chats/${loggedInUserId}`, resource_type: "video" });
            return { secure_url, public_id, originalname: file.originalname };
        })) : [];

        const files = req.files['files'] ? await Promise.all(req.files['files'].map(async (file) => {
            const { secure_url, public_id } = await cloudinary.uploader.upload(file.path, { folder: `Chats/${loggedInUserId}` });
            return { secure_url, public_id, originalname: file.originalname };
        })) : [];

        const messageType = (images.length > 0) ? 'image' :
            (videos.length > 0) ? 'video' :
            (files.length > 0) ? 'file' : 'text';

        const newMessage = {
            sender: loggedInUserId,
            content: MessageContent,
            messageType,
            media: [...images, ...videos, ...files],
            timestamp: Date.now(),
        };

        newChat.messages.push(newMessage);
        await newChat.save();

        return res.status(200).json({
            message: "Message added successfully to new chat.",
            chat: newChat,
        });
    } catch (error) {
        console.error("Error adding message:", error);
        return next(error);
    }
};


export const GetChatBetweenUsers = async (req, res, next) => {
    try {
        const loggedInUserId = req.user._id;  // المستخدم المتصل
        const otherUserId = req.params.otherUserId;  // المستخدم الآخر الذي تريد الحصول على الدردشة معه

        // التحقق من وجود otherUserId
        if (!otherUserId) {
            return next(new Error("Other user ID is required."));
        }

        // البحث عن دردشة بين المستخدمين تحتوي على مشروع null
        const chat = await ChatModel.findOne({
            users: { $all: [loggedInUserId, otherUserId] },
            project: null
        })
        .populate({
            path: 'messages.sender',  // جلب بيانات المرسل المرتبط بكل رسالة
            select: 'FullName UserName PictureProfile Role'  // تحديد الحقول التي نحتاجها للمُرسلين
        })
        .populate({
            path: 'users',  // جلب تفاصيل جميع المستخدمين المرتبطين بالشات
            select: 'FullName UserName PictureProfile'  // الحقول المطلوبة للمستخدمين
        });

        // إذا لم توجد دردشة، تعيين متغير للإشارة إلى أنه لا توجد دردشة
        if (!chat) {
            return res.status(404).json({
                message: "No chat found between these users with project null.",
                chatExists: false  // المتغير الذي يشير إلى أنه لا توجد دردشة
            });
        }

        // إعادة الشات مع تفاصيل المستخدمين والرسائل
        return res.status(200).json({
            message: "Chat found successfully.",
            chat,
            chatExists: true  // المتغير الذي يشير إلى أن الدردشة موجودة
        });

    } catch (error) {
        console.error("Error fetching chat:", error);
        return next(error);
    }
};


export const GetAllChats = async (req, res) => {
    try {
        const loggedInUserId = req.user._id;  // الحصول على معرف المستخدم المتصل

        // العثور على جميع الدردشات التي تضم المستخدم المتصل
        const chats = await ChatModel.find({
            users: loggedInUserId  
        }).populate('users', 'PictureProfile FullName');  // تحميل صورة الملف الشخصي واسم المستخدم لكل مستخدم

        if (chats.length === 0) {
            return res.status(404).json({ message: 'No chats found for this user' });
        }

        // الآن سنقوم بتهيئة الرد ليتضمن صورة المستخدمين واسمائهم في كل شات
        const chatDetails = await Promise.all(chats.map(async (chat) => {  // استخدام async داخل map
            let usersInfo = [];
            let chatType = 'multiple users';  // افتراضًا أنها دردشة عدة مستخدمين
            let projectId = null;  // في حال كانت دردشة فردية، لا حاجة لإرجاع projectId
            let projectName = null;  // هنا نضيف المتغير لاسم المشروع

            // التحقق من وجود بيانات للمستخدمين
            if (!chat.users || chat.users.length === 0) {
                return {
                    chatId: chat._id,
                    usersInfo: [],  // إذا كانت البيانات غير متوفرة
                    chatType: 'unknown',
                    lastMessage: chat.lastMessage,
                    createdAt: chat.createdAt
                };
            }

            // تحديد نوع الدردشة بناءً على وجود projectId
            if (chat.project) {
                // إذا كانت دردشة تحتوي على مشروع
                chatType = 'multiple users';  // إذا كانت دردشة جماعية
                projectId = chat.project;  // إضافة الـ projectId للدردشة الجماعية
                // نحاول جلب اسم المشروع باستخدام projectId
                const project = await ProjectsModel.findById(projectId);
                if (project) {
                    projectName = project.ProjectName;  // الحصول على اسم المشروع
                }
            } else {
                // إذا كانت دردشة فردية بين شخصين
                chatType = 'individual';  // إذا كانت دردشة فردية

                // التحقق من الـ userId في الدردشة الفردية
                const otherUser = chat.users.find(user => user._id.toString() !== loggedInUserId.toString());

                if (otherUser) {
                    // إذا كانت دردشة فردية، نرجع بيانات المستخدم الآخر فقط
                    usersInfo = [{
                        userId: otherUser._id,  // إضافة الـ userId الخاص بالمستخدم الآخر
                        profileImage: otherUser.PictureProfile,
                        name: otherUser.FullName
                    }];
                }
            }

            return {
                chatId: chat._id,
                usersInfo,  // صور وأسماء المستخدمين بالإضافة إلى معرّفهم
                chatType,  // نوع الدردشة
                projectId,  // إرجاع الـ projectId إذا كانت دردشة جماعية
                projectName,  // إرجاع اسم المشروع إذا كانت دردشة جماعية
                lastMessage: chat.lastMessage,
                createdAt: chat.createdAt
            };
        }));

        // ترتيب المحادثات بترتيب عكسي حسب تاريخ الإنشاء (أحدث المحادثات أولاً)
        const sortedChatDetails = chatDetails.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

        return res.status(200).json({ message: 'Chats retrieved successfully', chatDetails: sortedChatDetails });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Failed to retrieve chats' });
    }
};



export const GetChatMessages = async (req, res, next) => {
    try {
        const currentUserId = req.user._id; // المستخدم الحالي
        let targetUserId = req.params.userId; // المستخدم المدخل

        console.log("Current User ID:", currentUserId);
        console.log("Target User ID:", targetUserId);

        // التحقق من أن كلا المستخدمين يملكان ObjectId صالح
        if (!mongoose.isValidObjectId(currentUserId) || !mongoose.isValidObjectId(targetUserId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid user ID format.",
                messages: [],
            });
        }

        // البحث عن محادثة تحتوي فقط على المستخدمين الاثنين
        const chat = await ChatModel.findOne({
            users: { $all: [currentUserId, targetUserId] } // يجب أن يحتوي الـ array على المستخدمين الاثنين
        });

        if (!chat) {
            return res.status(200).json({
                success: false,
                message: "No chat found between these users.",
                messages: [],
            });
        }

        return res.status(200).json({
            success: true,
            chats: chat.messages || [],
        });

    } catch (error) {
        console.error("Error fetching chat messages:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error.",
            messages: [],
        });
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


export const MarkMessagesAsRead = async (req, res, next) => {
    try {
        const { ChatId } = req.body;

        const chat = await ChatModel.findById(ChatId);
        if (!chat) {
            return next(new Error("Chat not found."));
        }

        chat.messages.forEach((message) => {
            if (message.sender.toString() !== req.user._id.toString()) {
                message.isRead = true;
            }
        });

        await chat.save();

        return res.status(200).json({ message: "Messages marked as read." });
    } catch (error) {
        console.error("Error marking messages as read:", error);
        return next(error);
    }
};


export const GetUnreadMessagesCount = async (req, res, next) => {
    try {
        const { ChatId } = req.params;

        const chat = await ChatModel.findById(ChatId);
        if (!chat) {
            return next(new Error("Chat not found."));
        }

        const unreadCount = chat.messages.filter(
            (message) => !message.isRead && message.sender.toString() !== req.user._id.toString()
        ).length;

        return res.status(200).json({ unreadCount });
    } catch (error) {
        console.error("Error getting unread messages count:", error);
        return next(error);
    }
};


export const SearchMessages = async (req, res, next) => {
    try {
        const { ChatId, Query } = req.body;

        if (!ChatId || !Query) {
            return next(new Error("ChatId and query are required."));
        }

        const chat = await ChatModel.findById(ChatId);
        if (!chat) {
            return next(new Error("Chat not found."));
        }

        const matchingMessages = chat.messages.filter((message) =>
            message.content.toLowerCase().includes(Query.toLowerCase())
        );

        return res.status(200).json({ matchingMessages });
    } catch (error) {
        console.error("Error searching messages:", error);
        return next(error);
    }
};

// دالة جلب بيانات المستخدمين في الشات
export const GetChatUsers = async (req, res) => {
    try {
        const loggedInUserId = req.user.id; // ID المستخدم الحالي من الـ JWT أو الطلب
         console.log(loggedInUserId);
 
        // البحث عن جميع الدردشات الخاصة بالمستخدم
        const chats = await ChatModel.find({
            users: loggedInUserId
        });

        if (chats.length === 0) {
            return res.status(404).json({ message: "No chats found for this user." });
        }

        // استخراج جميع معرفات المستخدمين في هذه الدردشات
        const userIds = new Set(); // Set لضمان عدم التكرار
        chats.forEach(chat => {
            chat.users.forEach(userId => {
                if (userId.toString() !== loggedInUserId) {
                    userIds.add(userId.toString()); // تجاهل معرف المستخدم الحالي
                }
            });
        });

        // التأكد من وجود مستخدمين
        if (userIds.size === 0) {
            return res.status(404).json({ message: "No other users found in chats." });
        }

        // جلب بيانات المستخدمين
        const users = await UserModel.find({
            _id: { $in: Array.from(userIds) } // جلب فقط المستخدمين الموجودين في الدردشات
        }).select("FullName PictureProfile _id"); // استرجاع الاسم الكامل والصورة والمعرف فقط

        return res.status(200).json({
            message: "Chat users retrieved successfully",
            users,
        });
    } catch (error) {
        console.error("Error fetching chat users:", error);
        return res.status(500).json({ message: error.message });
    }
};

export const CreateChatProject = async (req, res) => {
    try {
        const { FirstMessage, ProjectId } = req.body;

        if (!FirstMessage || !ProjectId) {
            return next(new Error("FirstMessage and ProjectId are required."));
        }

        // جلب المشروع
        const project = await ProjectsModel.findById(ProjectId);
        if (!project) {
            return next(new Error("Project not found."));
        }

        // التحقق من الأشخاص في الأدوار وحالتهم Approved
        const approvedUsers = [];
        project.Roles.forEach((role) => {
            if (role.users) {  // Ensure that users is defined
                role.users.forEach((user) => {
                    if (user && user.status === "Approved") {  // Ensure user is defined
                        approvedUsers.push(user.userId);
                    }
                });
            }
        });
        

        // التحقق من عدم إرسال الرسالة لصاحب التوكن
        const recipients = approvedUsers.filter(
            (userId) => userId.toString() !== req.user._id.toString()
        );

        let media = [];

        // رفع الوسائط إذا كانت موجودة
        if (req.files) {
            // نفس الكود الحالي لمعالجة الصور والفيديوهات والملفات
        }

        const messageType =
            media.length > 0
                ? media[0].secure_url
                    ? "image"
                    : media[0].video_url
                    ? "video"
                    : "file"
                : "text";

        // إذا لم يكن هناك مستلمون، أنشئ دردشة فارغة
        if (recipients.length === 0) {
            const chat = await ChatModel.create({
                users: [req.user._id], // فقط المرسل
                project: ProjectId,
                messages: [
                    {
                        sender: req.user._id,
                        content: FirstMessage,
                        messageType: messageType,
                        media: media,
                    },
                ],
            });

            return res.status(201).json({
                message: "Chat created successfully (without recipients).",
                chat,
            });
        }

        // إنشاء محادثات لكل مستلم
        const chats = await Promise.all(
            recipients.map(async (recipient) => {
                return await ChatModel.create({
                    users: [req.user._id, recipient],
                    project: ProjectId,
                    messages: [
                        {
                            sender: req.user._id,
                            content: FirstMessage,
                            messageType: messageType,
                            media: media,
                        },
                    ],
                });
            })
        );

        return ({
            chats,
        });
    }  catch (error) {
        console.error("Error creating chat:", error);
       
    }
};




export const AddUserToChatProject = async (req, res, next) => {
    try {
        const { ProjectId, UserId } = req.body;

        // تحقق من وجود بيانات المشروع والمستخدم
        if (!ProjectId || !UserId) {
            return next(new Error("ProjectId and UserId are required."));
        }

        // جلب المشروع من قاعدة البيانات
        const project = await ProjectsModel.findById(ProjectId);
        if (!project) {
            return next(new Error("Project not found."));
        }

        // تحقق من أن المستخدم ليس بالفعل جزءاً من المشروع
        const userIsInProject = project.Roles.some(role =>
            role.users.some(user => user.userId.toString() === UserId)
        );

        if (!userIsInProject) {
            return next(new Error("User is not part of the project."));
        }

        // جلب الدردشة الحالية
        const chat = await ChatModel.findOne({ project: ProjectId });
        if (!chat) {
            return next(new Error("Chat not found for the project."));
        }

        // التحقق من أن المستخدم ليس بالفعل في الدردشة
        if (chat.users.includes(UserId)) {
            return next(new Error("User is already in the chat."));
        }

        // إضافة المستخدم إلى الدردشة
        chat.users.push(UserId);

        // حفظ التعديلات
        await chat.save();

        return res.status(200).json({
            message: "User added to the chat successfully.",
            chat,
        });
    } catch (error) {
        console.error("Error adding user to chat:", error);
        return next(error);
    }
};

export const GetAllChatsProject = async (req, res) => {
    try {
        const loggedInUserId = req.user._id; // الحصول على id المستخدم الحالي
        const { projectId } = req.params;    // الحصول على projectId من الـ URL

        // العثور على الشات الخاص بالمشروع بناءً على المشروع والمستخدم
        const chats = await ChatModel.find({
            project: projectId,  // استخدم projectId في البحث
            users: loggedInUserId // البحث باستخدام loggedInUserId في الـ users
        })
        .populate({
            path: 'messages.sender',  // جلب بيانات المرسل المرتبط بكل رسالة
            select: 'FullName UserName PictureProfile Role'  // تحديد الحقول التي نحتاجها
        })
        .populate({
            path: 'users',  // جلب تفاصيل جميع المستخدمين المرتبطين بالشات
            select: 'FullName PictureProfile UserName' // الحقول المطلوبة للمستخدمين
        });

        if (chats.length === 0) {
            return res.status(404).json({ message: 'No chats found for this user in the given project' });
        }

        // إعادة الشات مع تفاصيل المستخدمين
        return res.status(200).json({ message: 'Chats retrieved successfully', chats });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Failed to retrieve chats' });
    }
};


export const DeleteChatProject = async (req, res) => {
    try {
        const loggedInUserId = req.user._id; // الحصول على ID المستخدم الحالي
        const { projectId, messageId } = req.params; // الحصول على projectId و messageId من الـ URL

        // العثور على الشات المرتبط بالمشروع والمستخدم
        const chat = await ChatModel.findOne({
            project: projectId,
            users: loggedInUserId,
            "messages._id": messageId, // التأكد من وجود الرسالة داخل الشات
        });

        if (!chat) {
            return res.status(404).json({ message: 'Chat or message not found' });
        }

        // حذف الرسالة من المصفوفة
        chat.messages = chat.messages.filter(
            (message) => message._id.toString() !== messageId
        );

        // حفظ الشات بعد التعديل
        await chat.save();

        return res.status(200).json({ message: 'Message deleted successfully' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Failed to delete message' });
    }
};


export const AddmessageToChatProject = async (req, res, next) => {
    try {
        const { MessageContent } = req.body;
        const { projectId } = req.params;

        // التحقق من وجود MessageContent و projectId
        if (!projectId) {
            return next(new Error("MessageContent and ProjectId are required."));
        }

        // العثور على المحادثة بناءً على projectId
        const chat = await ChatModel.findOne({ project: projectId });
        if (!chat) {
            return next(new Error("Chat not found for the provided ProjectId."));
        }

        const UserId = req.user._id; // استخراج UserId

        // رفع الصور إلى Cloudinary
        const images = req.files['images'] ? await Promise.all(req.files['images'].map(async (file) => {
            const { secure_url, public_id } = await cloudinary.uploader.upload(file.path, { folder: `Chats/${UserId}` });
            return { secure_url, public_id, originalname: file.originalname };
        })) : [];

        // رفع الفيديوهات إلى Cloudinary
        const videos = req.files['videos'] ? await Promise.all(req.files['videos'].map(async (file) => {
            const { secure_url, public_id } = await cloudinary.uploader.upload(file.path, { folder: `Chats/${UserId}`, resource_type: "video" });
            return { secure_url, public_id, originalname: file.originalname };
        })) : [];

        // رفع الملفات (مثل PDFs) إلى Cloudinary
        const files = req.files['files'] ? await Promise.all(req.files['files'].map(async (file) => {
            const { secure_url, public_id } = await cloudinary.uploader.upload(file.path, { folder: `Chats/${UserId}` });
            return { secure_url, public_id, originalname: file.originalname };
        })) : [];

        // تحديد نوع الرسالة بناءً على الملفات الموجودة
        const messageType = (images.length > 0) ? 'image' :
            (videos.length > 0) ? 'video' :
            (files.length > 0) ? 'file' : 'text';

        // إنشاء الرسالة الجديدة
        const newMessage = {
            sender: req.user._id, // الشخص الذي أرسل الرسالة
            content: MessageContent,
            messageType, // تحديد نوع الرسالة
            media: [...images, ...videos, ...files], // جميع الوسائط
            timestamp: Date.now(),
        };

        // إضافة الرسالة إلى المحادثة
        chat.messages.push(newMessage);

        // حفظ التغييرات
        await chat.save();

        return res.status(200).json({
            message: "Message added successfully.",
            chat,
        });
    } catch (error) {
        console.error("Error adding message:", error);
        return next(error);
    }
};
