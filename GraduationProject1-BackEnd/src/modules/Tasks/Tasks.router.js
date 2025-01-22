import { Router } from "express";
const router = Router();
import * as TasksController from './Tasks.controller.js';
import { auth } from "../../MiddleWare/auth.js";
import { EndPoints } from "./Task.Role.js";
import * as schema from './Tasks.Validation.js';
import { Validation } from "../../MiddleWare/Validation.js";
import fileUpload, { FileValue } from "../../../utls/Multer.js";

router.post('/createtasks',auth(EndPoints.CreateTask),fileUpload(FileValue.file).fields([{ name:'TaskFile'}]),TasksController.CreateTask);
router.get('/getalltasksbysenior/:ProjectId',auth(EndPoints.GetAllTaskBySenior),TasksController.GetAllTasksBySenior);
router.get('/getalltasksforjunior/:UserId',auth(EndPoints.GetAllTasksForJunior),TasksController.GetAllTasksForJunior);
router.delete('/deletetask/:ProjectId',auth(EndPoints.DeleteTask),TasksController.DeleteTask);
router.post('/submittask/:ProjectId',auth(EndPoints.SubmitTask),fileUpload(FileValue.file).fields([{ name:'SubmitFile'}]),TasksController.SubmitTask);
router.get('/getallubmissionsforjunior/:ProjectId',auth(EndPoints.GetAllJuniorSubmissions),TasksController.GetAllJuniorSubmissions);



export default router