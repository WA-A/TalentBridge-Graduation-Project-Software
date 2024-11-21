import { Router } from "express";
import {auth }from "../../MiddleWare/auth.js";
import * as CommentController from './Comment.Controller.js'
import fileUpload, { FileValue } from "../../../utls/Multer.js";
import { AsyncHandler } from "../../../utls/CatchError.js";
import { EndPoints } from "./Comment.Role.js";
import { Validation } from "../../MiddleWare/Validation.js";
import * as schema from './Chat.Validation.js';
const router = Router();

router.post('/createchat',Validation(schema.CreateCommentSchema),auth(EndPoints.CreateComment),fileUpload(FileValue.image).fields([{ name: 'images'}, { name: 'videos'}, { name: 'files'}]),CommentController.CreateComment);

export default router;