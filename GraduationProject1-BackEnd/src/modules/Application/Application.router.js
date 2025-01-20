import { Router } from "express";
const router = Router();
import * as ApplicationController from './Application.controller.js'
import { auth } from "../../MiddleWare/auth.js";
import { EndPoints } from "./Application.Role.js";
import { Validation } from "../../MiddleWare/Validation.js";
import * as schema from './Application.Validation.js';



router.post('/createapplicationtrain',auth(EndPoints.CreateApplication),ApplicationController.createapplicationtrain);//jenior senior
router.get('/getApplicationsBySenior',auth(EndPoints.getApplication),ApplicationController.getApplicationsBySenior);//senior
router.get('/getApplicationsByProject/:projectId',auth(EndPoints.getApplication),ApplicationController.getApplicationsByProject);//senior
router.get('/getApplicationById/:applicationId',auth(EndPoints.CreateApplication),ApplicationController.getApplicationById);//jenior //senior
router.delete('/deleteApplication/:applicationId',auth(EndPoints.CreateApplication),ApplicationController.deleteApplication);//jenior senior
router.put('/approveApplication/:applicationId',auth(EndPoints.getApplication),ApplicationController.approveApplication); //senior
router.get('/getProjectByApplicationId/:applicationId',auth(EndPoints.CreateApplication),ApplicationController.getProjectByApplicationId); //jenior //senior
router.get('/getPendingRequests',auth(EndPoints.CreateApplication),ApplicationController.getPendingRequests);
export default router