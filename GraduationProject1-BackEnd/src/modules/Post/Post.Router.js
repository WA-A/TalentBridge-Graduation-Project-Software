import { Router } from "express";
import { auth } from "../../middleware/auth.js";
import * as PostController from './Post.Controller.js';
import fileUpload, { FileValue } from "./../../../utls/Multer.js";
import { AsyncHandler } from "./../../../utls/CatchError.js";
import { EndPoints } from "./Post.Role.js";
import { Validation } from "../../MiddleWare/Validation.js";
import * as schema from './Post.Validation.js';

const router = Router();


router.put('/updatepost/:postId',auth(EndPoints.CreatePost),fileUpload(FileValue.image).fields([{ name: 'images'}, { name: 'videos'}, { name: 'files'} ]),PostController.UpdatePost);
router.get('/getpost',auth(EndPoints.CreatePost),PostController.GetUserPosts);
router.get('/getallpost',auth(EndPoints.CreatePost),PostController.GetAllPosts);
router.delete('/deletepost/:postId',auth(EndPoints.CreatePost),PostController.DeletePost);

router.post('/createpost',auth(EndPoints.CreatePost),fileUpload(FileValue.image).fields([{ name: 'images'}, { name:'videos'}, { name:'files'} ]),PostController.CreatePost);
export default router;
