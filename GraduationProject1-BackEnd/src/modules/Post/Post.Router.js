import { Router } from "express";
import { auth } from "../../MiddleWare/auth.js";
import * as PostController from './Post.Controller.js';
import fileUpload, { FileValue } from "./../../../utls/Multer.js";
import { AsyncHandler } from "./../../../utls/CatchError.js";
import { EndPoints } from "./Post.Role.js";

const router = Router();


router.post('/createpost',auth(EndPoints.CreatePost),fileUpload(FileValue.image).fields([{ name: 'images'}, { name: 'videos'}, { name: 'files'} ]),PostController.CreatePost);

export default router;
