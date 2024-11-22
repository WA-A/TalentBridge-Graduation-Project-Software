import { Router } from "express";
import {auth }from "../../MiddleWare/auth.js";
import * as ChatController from './Chat.Controller.js'
import fileUpload, { FileValue } from "../../../utls/Multer.js";
import { AsyncHandler } from "../../../utls/CatchError.js";
import { EndPoints } from "./Chat.Role.js";
import { Validation } from "../../MiddleWare/Validation.js";
import * as schema from './Chat.Validation.js';
const router = Router();

router.post('/createchat',auth(EndPoints.CreateChat),ChatController.CreateChat);
router.post('/addmessagetochat',auth(EndPoints.CreateChat),ChatController.AddMessageToChat);

export default router;