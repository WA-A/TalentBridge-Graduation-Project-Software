import { Router } from "express";
const router = Router();
import * as UserController from './User.controller.js'
import fileUpload, { FileValue } from "../../../utls/Multer.js";
import { auth } from "../../MiddleWare/auth.js";
import { EndPoints } from "./User.Role.js";
import { Validation } from "../../MiddleWare/Validation.js";
import * as schema from './User.Validation.js';



router.post('/createprofile',auth(EndPoints.CreateProfile),fileUpload(FileValue.image).single('PictureProfile'),UserController.CreateProfile);

export default router