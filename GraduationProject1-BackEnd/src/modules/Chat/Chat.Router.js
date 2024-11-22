import { Router } from "express";
import {auth }from "../../MiddleWare/auth.js";
import * as ChatController from './Chat.Controller.js'
import fileUpload, { FileValue } from "../../../utls/Multer.js";
import { AsyncHandler } from "../../../utls/CatchError.js";
import { EndPoints } from "./Chat.Role.js";
import { Validation } from "../../MiddleWare/Validation.js";
import * as schema from './Chat.Validation.js';
const router = Router();

router.post('/createchat',auth(EndPoints.CreateChat),fileUpload(FileValue.image).fields([{ name: 'images'}, { name: 'videos'}, { name: 'files'} ]),ChatController.CreateChat);
router.post('/addmessagetochat',auth(EndPoints.CreateChat),fileUpload(FileValue.image).fields([{ name: 'images'}, { name: 'videos'}, { name: 'files'} ]),ChatController.AddMessageToChat);
router.get('/getallchats',auth(EndPoints.CreateChat),ChatController.GetAllChats);
router.put('/updatemessageinchat',auth(EndPoints.CreateChat),fileUpload(FileValue.image).fields([{ name: 'images'}, { name: 'videos'}, { name: 'files'} ]),ChatController.UpdateMessageInChat)
router.delete('/deletemessageinchat',auth(EndPoints.CreateChat),ChatController.DeleteMessageFromChat)

export default router;