import { Router } from "express";
import { auth } from "../../MiddleWare/auth.js";
import * as ChatController from './Chat.Controller.js'
import fileUpload, { FileValue } from "../../../utls/Multer.js";
import { EndPoints } from "./Chat.Role.js";

const router = Router();

router.post('/createchat', auth(EndPoints.CreateChat),fileUpload(FileValue.image).fields([{ name: 'images' }, { name: 'videos' }, { name: 'files' }]), ChatController.CreateChat);
router.post('/addmessagetochat/:otherUserId',auth(EndPoints.CreateChat),fileUpload(FileValue.image.concat(FileValue.video, FileValue.file)).fields([
    { name: 'images', maxCount: 5 }, // السماح بتحميل 5 صور
    { name: 'videos', maxCount: 5 }, // السماح بتحميل 5 فيديوهات
    { name: 'files', maxCount: 10 }, // السماح بتحميل 10 ملفات (بما في ذلك ملفات ZIP)
]),ChatController.AddMessageToChat);
router.get('/getallchats',auth(EndPoints.CreateChat),ChatController.GetAllChats);
router.get('/getchatmessages/:userId', auth(EndPoints.CreateChat), ChatController.GetChatMessages);
router.get('/getchatusers', auth(EndPoints.GetChatUsers), ChatController.GetChatUsers); 
router.get('/GetChatBetweenUsers/:otherUserId', auth(EndPoints.CreateChat), ChatController.GetChatBetweenUsers);


router.put('/updatemessageinchat', auth(EndPoints.CreateChat),fileUpload(FileValue.image).fields([{ name: 'images' }, { name: 'videos' }, { name: 'files' }]), ChatController.UpdateMessageInChat)
router.delete('/deletemessageinchat', auth(EndPoints.CreateChat), ChatController.DeleteMessageFromChat)
router.delete('/deletechat', auth(EndPoints.CreateChat), ChatController.DeleteChat)
router.post('/markmessagesasread', auth(EndPoints.CreateChat), ChatController.MarkMessagesAsRead);
router.get('/getunreadmessagescount/:ChatId', auth(EndPoints.CreateChat), ChatController.GetUnreadMessagesCount);
router.post('/searchmessages',auth(EndPoints.CreateChat), ChatController.SearchMessages);
router.post('/CreateChatProject',auth(EndPoints.CreateChat),ChatController.CreateChatProject);
router.get('/GetAllChatsProject/:projectId',auth(EndPoints.CreateChat),ChatController.GetAllChatsProject);
router.post('/AddUserToChatProject',auth(EndPoints.CreateChat),ChatController.AddUserToChatProject);
router.post('/AddmessageToChatProject/:projectId',auth(EndPoints.CreateChat),fileUpload(FileValue.image.concat(FileValue.video, FileValue.file)).fields([
        { name: 'images', maxCount: 5 }, // السماح بتحميل 5 صور
        { name: 'videos', maxCount: 5 }, // السماح بتحميل 5 فيديوهات
        { name: 'files', maxCount: 10 }, // السماح بتحميل 10 ملفات (بما في ذلك ملفات ZIP)
    ]),
    ChatController.AddmessageToChatProject
);
router.delete('/deletechatProject/:projectId/:messageId', auth(EndPoints.CreateChat),ChatController.DeleteChatProject)


export default router;