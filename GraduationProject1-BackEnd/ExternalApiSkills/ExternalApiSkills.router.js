import express from 'express';
import * as ExternalApiSkillsController  from './ExternealApiSkills.controller.js';
import {auth} from '../src/middleware/auth.js';
import { EndPoints } from './ExternalApiSkills.role.js';
const router = express.Router();

// Api Skills
router.get('/getskills',ExternalApiSkillsController.GetSkills);



export default router;
