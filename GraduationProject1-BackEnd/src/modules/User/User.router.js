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


router.post('/addExperience', auth(EndPoints.CreateProfile), UserController.addExperience);
router.post('/addEducation', auth(EndPoints.CreateProfile), UserController.addEducation);
router.post('/addLanguage', auth(EndPoints.CreateProfile), UserController.addLanguage);

router.post(
    '/addCertification',
    auth(EndPoints.CreateProfile),
    fileUpload(FileValue.image).fields([
        { name: 'CertificationImage', maxCount: 1 } // إذا كنت تحتاج لرفع ملف واحد فقط
    ]),
    UserController.addCertification
);

router.delete('/deleteexperience/:experienceId', auth(EndPoints.CreateProfile), UserController.deleteexperience);
router.delete('/deleteeducation/:educationId', auth(EndPoints.CreateProfile), UserController.deleteeducation);
router.delete('/deleteCertification/:certificationId', auth(EndPoints.CreateProfile), UserController.deleteCertification);
router.put('/updateExperience/:experienceId', auth(EndPoints.CreateProfile), UserController.updateExperience);
router.put('/updateEducation/:educationId', auth(EndPoints.CreateProfile), UserController.updateEducation);
router.put('/updateLanguage', auth(EndPoints.CreateProfile), UserController.updateLanguage);

router.put(
    '/updateCertification/:certificationId',auth(EndPoints.CreateProfile),
    fileUpload(FileValue.image).fields([
        { name: 'CertificationImage', maxCount: 1 } // إذا كنت تحتاج لرفع ملف واحد فقط
    ]),
    UserController.updateCertification
);

router.get('/getAllExperiences', auth(EndPoints.CreateProfile), UserController.getAllExperiences);
router.get('/getAllCertifications', auth(EndPoints.CreateProfile), UserController.getAllCertifications);
router.get('/getAllEducation', auth(EndPoints.CreateProfile), UserController.getAllEducation);
export default router