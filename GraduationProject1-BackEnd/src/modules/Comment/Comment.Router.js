import { Router } from "express";
import {auth }from "../../MiddleWare/auth.js";
import * as CommentController from './Comment.Controller.js'
import fileUpload, { FileValue } from "../../../utls/Multer.js";
import { AsyncHandler } from "../../../utls/CatchError.js";
import { EndPoints } from "./Comment.Role.js";
const router = Router();

router.post('/createcomment',auth(EndPoints.CreateComment),fileUpload(FileValue.image).fields([{ name: 'images'}, { name: 'videos'}, { name: 'files'}]),AsyncHandler(CommentController.CreateComment));
export default router;