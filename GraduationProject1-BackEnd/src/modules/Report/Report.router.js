import { Router } from "express";
const router = Router();
import * as ReportController from './Report.controller.js';
import { auth } from "../../MiddleWare/auth.js";
import { EndPoints } from "./Report.Role.js";
import { Validation } from "../../MiddleWare/Validation.js";
import fileUpload, { FileValue } from "./../../../utls/Multer.js";


router.post('/createreport/:ProjectId',auth(EndPoints.CreateReport),ReportController.CreateReport);

export default router