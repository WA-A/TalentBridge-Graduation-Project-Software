import { Router } from "express";
const router = Router({caseSensitive:true});
import * as AuthController from './auth.controller.js';
import { CheckEmail } from "../../MiddleWare/CheckEmail.js";
import { AsyncHandler } from "../../../utls/CatchError.js";
import { Validation } from "../../MiddleWare/Validation.js";
import * as schema from './Auth.Validation.js';
import { auth } from "../../MiddleWare/auth.js";
import passport from "../auth/GoogleAuth.js"


router.post('/signup',CheckEmail,AuthController.SignUp); //,Validation(schema.RegisterSchema)
router.post('/signin',AsyncHandler(AuthController.SignIn)); //,Validation(schema.LoginSchema)
router.patch('/sendcode',AuthController.SendCode); //,Validation(schema.SendCodeSchema)
router.patch('/forgotpassword',AsyncHandler(AuthController.ForgotPassword)); //,Validation(schema.ForgetPasswordSchema)
router.patch('/changepassword',AuthController.ChangePassword); 
//router.get('/confirmemail/:token',AuthController.ConfirmEmail);


//  Google OAuth
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
router.get('/google/callback', passport.authenticate('google', { failureRedirect: '/' }), (req, res) => {
  res.redirect('/profile'); // Go Profile after sign success
});
export default router