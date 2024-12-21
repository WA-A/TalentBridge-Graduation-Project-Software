import express from 'express';
import * as ExternalApiController  from './ExternealApi.controller.js';

const router = express.Router();

router.get('/getlanguages',ExternalApiController.GetLanguages);
router.get('/getskills',ExternalApiController.GetSkills);

export default router;
