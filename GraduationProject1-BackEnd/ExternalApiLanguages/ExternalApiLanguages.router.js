import express from 'express';
import * as ExternalApiLanguagesController  from './ExternealApiLanguages.controller.js';
import {auth} from '../src/middleware/auth.js';
import { EndPoints } from './ExternalApiLanguages.role.js';
const router = express.Router();

//  Api Languages
router.get('/getlanguages',ExternalApiLanguagesController.GetLanguages);
router.post('/addlanguages',auth(EndPoints.AddLanguages),ExternalApiLanguagesController.AddLanguages);
router.delete('/deletelanguages/',auth(EndPoints.AddLanguages),ExternalApiLanguagesController.DeleteLanguages);
router.get('/GetLanguagesUser',auth(EndPoints.AddLanguages),ExternalApiLanguagesController.GetLanguagesUser)


export default router;
