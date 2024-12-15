import express from 'express';
import * as ExternalApiController  from './ExternealApi.controller.js';

const router = express.Router();

router.get('/getlanguages',ExternalApiController.GetLanguages);

export default router;
