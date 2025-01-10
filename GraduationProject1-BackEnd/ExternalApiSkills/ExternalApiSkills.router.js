import express from 'express';
import * as ExternalApiSkillsController  from './ExternealApiSkills.controller.js';
import {auth} from '../src/middleware/auth.js';
import { EndPoints } from './ExternalApiSkills.role.js';
const router = express.Router();

// Api Skills
router.get('/getskills',ExternalApiSkillsController.GetSkills);
router.post('/addskills',auth(EndPoints.AddSkills),ExternalApiSkillsController.AddSkills);
router.post('/addskillwithouttoken',ExternalApiSkillsController.AddSkillWithoutToken);
router.delete('/deleteskills',auth(EndPoints.AddSkills),ExternalApiSkillsController.DeleteSkill);
router.get('/getuserskills',auth(EndPoints.AddSkills),ExternalApiSkillsController.GetUserSkills);
router.post('/addmoreskills',auth(EndPoints.AddSkills),ExternalApiSkillsController.AddMoreSkills);



export default router;
