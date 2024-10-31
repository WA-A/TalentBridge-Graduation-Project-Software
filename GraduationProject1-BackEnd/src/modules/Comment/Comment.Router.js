import { Router } from "express";
import {auth }from "../../MiddleWare/auth.js";
import * as CommentController from './Comment.Controller.js'
import fileUpload, { FileValue } from "../../../utls/Multer.js";
import { AsyncHandler } from "../../../utls/CatchError.js";
import { EndPoints } from "./Comment.Role.js";
const router = Router();

router.post('/createcomment/:PostId',auth(EndPoints.CreateComment),fileUpload(FileValue.image).fields([{ name: 'images'}, { name: 'videos'}, { name: 'files'}]),CommentController.CreateComment);
router.put('/updatecomment/:CommentId',auth(EndPoints.CreateComment),fileUpload(FileValue.image).fields([{ name: 'images'}, { name: 'videos'}, { name: 'files'} ]),CommentController.UpdateComment);
router.get('/getallcomments/:PostId',auth(EndPoints.CreateComment),CommentController.GetAllComments);
router.delete('/deletecomment/:CommentId',auth(EndPoints.CreateComment),CommentController.DeleteComment);
export default router;