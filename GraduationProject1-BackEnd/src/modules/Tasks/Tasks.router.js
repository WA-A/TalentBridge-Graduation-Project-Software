import { Router } from "express";
const router = Router();
import * as TasksController from './Tasks.controller.js';
import { auth } from "../../MiddleWare/auth.js";
import { EndPoints } from "./Task.Role.js";
import * as schema from './Tasks.Validation.js';
import { Validation } from "../../MiddleWare/Validation.js";
import fileUpload, { FileValue } from "../../../utls/Multer.js";




export default router