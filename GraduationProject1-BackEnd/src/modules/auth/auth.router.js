import { Router } from "express";
const router = Router({caseSensitive:true});
import * as AuthController from './Auth.controller.js';
import { CheckEmail } from "../../MiddleWare/CheckEmail.js";
import { AsyncHandler } from "../../../utls/CatchError.js";
import { Validation } from "../../MiddleWare/Validation.js";
import * as schema from './Auth.Validation.js';





router.post('/signup',CheckEmail,AsyncHandler(AuthController.SignUp)); //,Validation(schema.RegisterSchema)
router.post('/signin',AsyncHandler(AuthController.SignIn)); //,Validation(schema.LoginSchema)
router.patch('/sendcode',AsyncHandler(AuthController.SendCode)); //,Validation(schema.SendCodeSchema)
router.patch('/forgotpassword',AsyncHandler(AuthController.ForgotPassword)); //,Validation(schema.ForgetPasswordSchema)
//router.get('/confirmemail/:token',AuthController.ConfirmEmail);







export default router