import { Router } from "express";
import { auth } from "../../MiddleWare/auth.js";
import * as ChatController from './Chat.Controller.js'
import fileUpload, { FileValue } from "../../../utls/Multer.js";
import { AsyncHandler } from "../../../utls/CatchError.js";
import { EndPoints } from "./Chat.Role.js";
import { Validation } from "../../MiddleWare/Validation.js";
import * as schema from './Chat.Validation.js';
const router = Router();

router.post('/createchat', auth(EndPoints.CreateChat), fileUpload(FileValue.image).fields([{ name: 'images' }, { name: 'videos' }, { name: 'files' }]), ChatController.CreateChat);
router.post('/addmessagetochat', auth(EndPoints.CreateChat), fileUpload(FileValue.image).fields([{ name: 'images' }, { name: 'videos' }, { name: 'files' }]), ChatController.AddMessageToChat);
router.get('/getallchats', auth(EndPoints.CreateChat), ChatController.GetAllChats);
router.get('/getchatmessages/:ChatId', auth(EndPoints.CreateChat), ChatController.GetChatMessages);
router.get('/getchatusers', auth(EndPoints.GetChatUsers), ChatController.GetChatUsers); 


router.put('/updatemessageinchat', auth(EndPoints.CreateChat), fileUpload(FileValue.image).fields([{ name: 'images' }, { name: 'videos' }, { name: 'files' }]), ChatController.UpdateMessageInChat)
router.delete('/deletemessageinchat', auth(EndPoints.CreateChat), ChatController.DeleteMessageFromChat)
router.delete('/deletechat', auth(EndPoints.CreateChat), ChatController.DeleteChat)
router.post('/markmessagesasread', auth(EndPoints.CreateChat), ChatController.MarkMessagesAsRead);
router.get('/getunreadmessagescount/:ChatId', auth(EndPoints.CreateChat), ChatController.GetUnreadMessagesCount);
router.post('/searchmessages', auth(EndPoints.CreateChat), ChatController.SearchMessages);

export default router;