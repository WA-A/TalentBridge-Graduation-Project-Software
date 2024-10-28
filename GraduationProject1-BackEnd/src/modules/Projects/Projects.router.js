import { Router } from "express";
const router = Router();
import * as ProjectController from './Projects.controller.js';
import { auth } from "../../MiddleWare/auth.js";
import { EndPoints } from "./Projects.Role.js";


router.post('/createproject',auth(EndPoints.CreateProject),ProjectController.CreateProject);
router.get('/viewownprojectcreated',auth(EndPoints.CreateProject),ProjectController.GetProjectsBySenior);
router.put('/updateownprojectcreated/:ProjectId',auth(EndPoints.CreateProject),ProjectController.UpdateProjectBySenior);
 
// router.get('/viewpwnprofile',auth(EndPoints.CreateProfile),ProjectController.ViewOwnProfile);
export default router