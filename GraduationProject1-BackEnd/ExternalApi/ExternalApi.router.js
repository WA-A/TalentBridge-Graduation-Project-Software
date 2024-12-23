import express from 'express';
import * as ExternalApiController  from './ExternealApi.controller.js';
import {auth} from '../src/middleware/auth.js';
import { EndPoints } from './ExternalApi.role.js';
const router = express.Router();

//  Api Languages
router.get('/getlanguages',ExternalApiController.GetLanguages);
router.post('/addlanguages',auth(EndPoints.AddLanguages),ExternalApiController.AddLanguages);

// Api Skills
router.get('/getskills',ExternalApiController.GetSkills);

export default router;
