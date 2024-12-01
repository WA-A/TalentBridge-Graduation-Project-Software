import { Router } from "express";
const router = Router();
import * as ApplicationController from './Application.controller.js'
import { auth } from "../../MiddleWare/auth.js";
import { EndPoints } from "./Application.Role.js";
import { Validation } from "../../MiddleWare/Validation.js";
import * as schema from './Application.Validation.js';



router.post('/createapplicationtrain',auth(EndPoints.CreateApplication),ApplicationController.CreateApplication);


export default router