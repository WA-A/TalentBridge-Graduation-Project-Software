import { Router } from "express";
const router = Router();
import * as UserController from './User.controller.js'
import fileUpload, { FileValue } from "../../../utls/Multer.js";
import { auth } from "../../MiddleWare/auth.js";
import { EndPoints } from "./User.Role.js";


router.post('/createprofile',auth(EndPoints.CreateProfile),fileUpload(FileValue.PictureProfile).single('PictureProfile'),UserController.createProfile);
router.get('/viewpwnprofile',auth(EndPoints.CreateProfile),UserController.ViewOwnProfile);
router.patch('/updateownprofile',auth(EndPoints.CreateProfile),UserController.UpdateOwnProfile);
export default router