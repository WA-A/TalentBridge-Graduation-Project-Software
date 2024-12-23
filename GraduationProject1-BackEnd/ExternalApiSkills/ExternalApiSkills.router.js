import express from 'express';
import * as ExternalApiSkillsController  from './ExternealApiSkills.controller.js';
import {auth} from '../src/middleware/auth.js';
import { EndPoints } from './ExternalApiSkills.role.js';
const router = express.Router();

// Api Skills
router.get('/getskills',ExternalApiSkillsController.GetSkills);
router.post('/addskills',auth(EndPoints.AddSkills),ExternalApiSkillsController.AddSkills);
router.delete('/deleteskills',auth(EndPoints.AddSkills),ExternalApiSkillsController.DeleteSkill);



export default router;
