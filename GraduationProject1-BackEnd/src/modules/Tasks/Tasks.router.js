import { Router } from "express";
const router = Router();
import * as TasksController from './Tasks.controller.js';
import { auth } from "../../MiddleWare/auth.js";
import { EndPoints } from "./Task.Role.js";
import * as schema from './Tasks.Validation.js';
import { Validation } from "../../MiddleWare/Validation.js";
import fileUpload, { FileValue } from "../../../utls/Multer.js";

router.post('/createtasks', auth(EndPoints.CreateTask), fileUpload(FileValue.file).fields([{ name: 'TaskFile' }]), TasksController.CreateTask);
router.get('/getalltasksbysenior/:ProjectId', auth(EndPoints.GetAllTaskBySenior), TasksController.GetAllTasksBySenior);
router.get('/getalltasksforjunior/:UserId', auth(EndPoints.GetAllTasksForJunior), TasksController.GetAllTasksForJunior);
router.delete('/deletetask/:ProjectId', auth(EndPoints.DeleteTask), TasksController.DeleteTask);
router.get('/GetProjectTasks/:ProjectId', auth(EndPoints.GetAllTasksForJunior),TasksController.GetProjectTasks);

// Submission
router.post('/submittask/:ProjectId', auth(EndPoints.SubmitTask), fileUpload(FileValue.file).fields([{ name: 'SubmitFile' }]), TasksController.SubmitTask);
router.patch('/updatesubmittask/:ProjectId', auth(EndPoints.UpdateSubmitTask), fileUpload(FileValue.file).fields([{ name: 'SubmitFile' }]), TasksController.UpdateSubmitTask);
router.get('/getallsubmissionsforjunior/:ProjectId', auth(EndPoints.GetAllJuniorSubmissions), TasksController.GetAllJuniorSubmissions);
router.get('/getallsubmissionsbysenior/:ProjectId', auth(EndPoints.GetTaskSubmissionsBySenior), TasksController.GetTaskSubmissionsBySenior);
router.get('/GetReviewForTaskSubmission/:ProjectId/:TaskId/:SubmissionId', auth(EndPoints.SubmitTask), TasksController.GetReviewForTaskSubmission);

// Review

router.post('/addreviewtosubmit/:ProjectId',auth(EndPoints.AddReviewToSubmission),TasksController.AddReviewToSubmission);
router.post('/reviewskills/:ProjectId',auth(EndPoints.ReviewSkills),TasksController.ReviewSkills);
router.put('/UpdateTaskinformations/:ProjectId',auth(EndPoints.CreateTask),TasksController.updateTaskDatesAndStatus);
router.post('/addTaskAssigneesAndFile/:ProjectId',auth(EndPoints.CreateTask),fileUpload(FileValue.file).fields([{ name:'TaskFile'}]),TasksController.addTaskAssigneesAndFile);
router.put('/CompleteTask/:ProjectId',auth(EndPoints.CreateTask),TasksController.CompleteTask);

export default router;