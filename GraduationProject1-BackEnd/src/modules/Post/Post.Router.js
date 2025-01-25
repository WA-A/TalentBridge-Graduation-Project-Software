import { Router } from "express";
import { auth } from "../../middleware/auth.js";
import * as PostController from './Post.Controller.js';
import fileUpload, { FileValue } from "./../../../utls/Multer.js";
import { AsyncHandler } from "./../../../utls/CatchError.js";
import { EndPoints } from "./Post.Role.js";
import { Validation } from "../../MiddleWare/Validation.js";
import * as schema from './Post.Validation.js';

const router = Router();



router.put('/updatepost/:postId',auth(EndPoints.CreatePost),  fileUpload(FileValue.image.concat(FileValue.video, FileValue.file)).fields([
    { name: 'images', maxCount: 5 }, // السماح بتحميل 5 صور
    { name: 'videos', maxCount: 5 }, // السماح بتحميل 5 فيديوهات
    { name: 'files', maxCount: 10 }, // السماح بتحميل 10 ملفات (بما في ذلك ملفات ZIP)
]),PostController.UpdatePost);
router.get('/getpost',auth(EndPoints.CreatePost),PostController.GetUserPosts);
router.get('/getallpost',auth(EndPoints.CreatePost),PostController.GetAllPosts);
router.delete('/deletepost/:postId',auth(EndPoints.CreatePost),PostController.DeletePost);
router.get('/GetPostById/:postId',auth(EndPoints.CreatePost),PostController.GetPostById);


router.post(
    '/CreatePost',
    auth(EndPoints.CreatePost),
    fileUpload(FileValue.image.concat(FileValue.video, FileValue.file)).fields([
        { name: 'images', maxCount: 5 }, // السماح بتحميل 5 صور
        { name: 'videos', maxCount: 5 }, // السماح بتحميل 5 فيديوهات
        { name: 'files', maxCount: 10 }, // السماح بتحميل 10 ملفات (بما في ذلك ملفات ZIP)
    ]),
    PostController.CreatePost
);


export default router;