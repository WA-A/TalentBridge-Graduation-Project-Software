import express from 'express';
import * as ExternalApiFieldsController  from './ExternealApiFields.controller.js';
import {auth} from '../src/middleware/auth.js';
import { EndPoints } from './ExternalApiFields.role.js';
const router = express.Router();


router.get('/getfields',ExternalApiFieldsController.GetFields);



export default router;
