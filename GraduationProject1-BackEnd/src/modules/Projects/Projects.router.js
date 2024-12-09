import { Router } from "express";
const router = Router();
import * as ProjectController from './Projects.controller.js';
import { auth } from "../../MiddleWare/auth.js";
import { EndPoints } from "./Projects.Role.js";
import * as schema from './Projects.Validation.js'
import { Validation } from "../../MiddleWare/Validation.js";
import fileUpload, { FileValue } from "./../../../utls/Multer.js";



router.post('/createproject',auth(EndPoints.CreateProject),fileUpload(FileValue.file).fields([{ name:'FileProject'}]),ProjectController.CreateProject);
router.get('/viewownprojectcreated',auth(EndPoints.CreateProject),ProjectController.GetProjectsBySenior);
router.put('/updateownprojectcreated/:ProjectId',auth(EndPoints.CreateProject),fileUpload(FileValue.file).fields([{ name:'FileProject'}]),ProjectController.UpdateProjectBySenior);
router.delete('/deleteownprojectcreated/:ProjectId',Validation(schema.DeleteProjectSchema),auth(EndPoints.CreateProject),ProjectController.DeleteProjectBySenior);
router.get('/viewprojectbyfiled',Validation(schema.GetProjectsByFieldSchema),auth(EndPoints.CreateProject),ProjectController.GetProjectsByField);

export default router