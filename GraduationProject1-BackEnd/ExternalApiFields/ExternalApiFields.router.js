import express from 'express';
import * as ExternalApiSkillsController  from './ExternealApiFields.controller.js';
import {auth} from '../src/middleware/auth.js';
import { EndPoints } from './ExternalApiSkills.role.js';
const router = express.Router();



export default router;
