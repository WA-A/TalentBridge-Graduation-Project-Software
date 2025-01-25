import { Router } from "express";
const router = Router();
import * as AdminController from './Admin.controller.js';
import { auth } from "../../MiddleWare/auth.js";
import { Validation } from "../../MiddleWare/Validation.js";
import fileUpload, { FileValue } from "../../../utls/Multer.js";
import { EndPoints } from "./Admin.role.js";



router.get('/getallrequestseniortoadmin',auth(EndPoints.GetAllRequestSeniorToAdmin),AdminController.GetAllRequestSeniorToAdmin);
router.patch('/adminacceptofseniorrequest/:UserId',auth(EndPoints.GetAllRequestSeniorToAdmin),AdminController.AdminAcceptofSeniorRequest);
router.post('/addnewfields',auth(EndPoints.GetAllRequestSeniorToAdmin),AdminController.AddNewFields);
export default router