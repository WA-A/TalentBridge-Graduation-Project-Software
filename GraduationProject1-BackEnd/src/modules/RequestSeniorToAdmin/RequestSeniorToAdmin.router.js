import { Router } from "express";
const router = Router();
import * as RequestSeniorToAdminController from './RequestSeniorToAdmin.controller.js';
import { auth } from "../../MiddleWare/auth.js";
import { Validation } from "../../MiddleWare/Validation.js";
import fileUpload, { FileValue } from "../../../utls/Multer.js";



router.post('/createrequestseniortoadmin',fileUpload(FileValue.file).fields([{ name:'Certifications'}]),RequestSeniorToAdminController.CreateRequestSeniorToAdmin);

export default router