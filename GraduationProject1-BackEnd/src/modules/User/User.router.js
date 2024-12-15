import { Router } from "express";
const router = Router();
import * as UserController from './User.controller.js'
import fileUpload, { FileValue } from "../../../utls/Multer.js";
import { auth } from "../../MiddleWare/auth.js";
import { EndPoints } from "./User.Role.js";
import { Validation } from "../../MiddleWare/Validation.js";
import * as schema from './User.Validation.js';


//router.post('/createprofile',Validation(schema.CreateProfileSchema),auth(EndPoints.CreateProfile),fileUpload(FileValue.image).single('PictureProfile'),UserController.CreateProfile);
const { upload, processImage } = fileUpload(FileValue.image);


router.post(
    '/createprofile',
    auth(EndPoints.CreateProfile),
    fileUpload(FileValue.image).fields([
        { name: 'PictureProfile', maxCount: 1 },
        { name: 'CoverImage', maxCount: 1 },
    ]),
    UserController.CreateProfile
);
router.patch(
    '/updateprofile',
    auth(EndPoints.CreateProfile),                
    fileUpload(FileValue.image).fields([
        { name: 'PictureProfile', maxCount: 1 },
        { name: 'CoverImage', maxCount: 1 },
    ]),
    UserController.UpdateProfile
);


router.get('/viewownprofile', auth(EndPoints.CreateProfile), UserController.ViewOwnProfile);
router.get('/viewotherprofile/:userId', auth(EndPoints.CreateProfile), UserController.ViewOtherProfile);
router.get('/test', UserController.test);
router.get('/searchUsers/:user', auth(EndPoints.CreateProfile), UserController.searchUsers);

export default router