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
router.put('/updateownprojectcreated',auth(EndPoints.CreateProject),fileUpload(FileValue.file).fields([{ name:'FileProject'}]),ProjectController.UpdateProjectBySenior);
router.delete('/deleteownprojectcreated/:ProjectId',Validation(schema.DeleteProjectSchema),auth(EndPoints.CreateProject),ProjectController.DeleteProjectBySenior);
router.get('/GetProjectsByFieldAndSkills',auth(EndPoints.getProject),ProjectController.GetProjectsByFieldAndSkills);
router.get('/viewprojectbyfiled/:FieldId',auth(EndPoints.getProject),ProjectController.GetProjectsByField);
router.get('/filterprojects', auth(EndPoints.getProject), ProjectController.GetProjectsByFilters);
router.get('/GetProjectsProgressCompleteBySenior', auth(EndPoints.getProject), ProjectController.GetProjectsProgressCompleteBySenior);
router.get('/GetProjectsByUserRole', auth(EndPoints.getProject), ProjectController.GetProjectsByUserRole);
router.put('/UpdateProjectStatusToInProgress/:ProjectId',auth(EndPoints.CreateProject),ProjectController.UpdateProjectStatusToInProgress );
router.put('/UpdateProjectStatusToCompleted/::ProjectId',auth(EndPoints.CreateProject),ProjectController.UpdateProjectStatusToCompleted);

export default router