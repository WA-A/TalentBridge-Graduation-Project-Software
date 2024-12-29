import express from 'express';
import * as ExternalApiFieldsController  from './ExternealApiFields.controller.js';
import {auth} from '../src/middleware/auth.js';
import { EndPoints } from './ExternalApiFields.role.js';
const router = express.Router();


router.get('/getfields',ExternalApiFieldsController.GetFields);
 router.post('/addfields',auth(EndPoints.AddFields),ExternalApiFieldsController.AddFields);
 router.delete('/deletefields',auth(EndPoints.AddFields),ExternalApiFieldsController.DeleteFields);
// router.get('/getuserfields',auth(EndPoints.AddFields),ExternalApiFieldsController);



export default router;
