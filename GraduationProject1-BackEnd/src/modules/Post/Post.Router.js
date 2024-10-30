import { Router } from "express";
import {auth }from "../../MiddleWare/auth.js";
import * as PostController from './Post.Controller.js'
import fileUpload, { FileValue } from "./../../../utls/Multer.js";
import { AsyncHandler } from "./../../../utls/CatchError.js";
const router = Router();

//router.post('/createpost',auth,fileUpload(FileValue.image).single('images'),AsyncHandler(PostController.CreatePost));

export default router;