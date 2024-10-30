import { Router } from "express";
import { auth } from "../../MiddleWare/auth.js";
import * as PostController from './Post.Controller.js';
import fileUpload, { FileValue } from "./../../../utls/Multer.js";
import { AsyncHandler } from "./../../../utls/CatchError.js";
import { EndPoints } from "./Post.Role.js";
import { Validation } from "../../MiddleWare/Validation.js";
import * as schema from './Post.Validation.js';

const router = Router();


router.post('/createpost',auth(EndPoints.CreatePost),Validation(schema.CreatePostSchema),fileUpload(FileValue.image).fields([{ name: 'images'}, { name: 'videos'}, { name: 'files'} ]),PostController.CreatePost);
router.put('/updatepost/:postId',Validation(schema.UpdatePostSchema),auth(EndPoints.CreatePost),fileUpload(FileValue.image).fields([{ name: 'images'}, { name: 'videos'}, { name: 'files'} ]),PostController.UpdatePost);
router.get('/getpost/:userId',auth(EndPoints.CreatePost),PostController.GetUserPosts);
router.get('/getallpost',auth(EndPoints.CreatePost),PostController.GetAllPosts);
router.delete('/deletepost/:postId',auth(EndPoints.CreatePost),PostController.DeletePost);


export default router;
