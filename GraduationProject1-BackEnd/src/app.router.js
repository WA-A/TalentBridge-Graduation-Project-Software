import connectDB from '../DB/ConnectDB.js';
import AuthRouter from './modules/auth/auth.router.js';
import UserRouter from './modules/User/User.router.js';
import ProjectRouter from './modules/Projects/Projects.router.js'
import PostRouter from './modules/Post/Post.Router.js'
import CommentRouter from './modules/Comment/Comment.Router.js'
import ChatRouter from "./modules/Chat/Chat.Router.js"
import ExternalApiLanguagesRouter from "./../ExternalApiLanguages/ExternalApiLanguages.router.js"
import ExternalApiSkillsRouter from "./../ExternalApiSkills/ExternalApiSkills.router.js"
import ExternalApiFieldsRouter from './../ExternalApiFields/ExternalApiFields.router.js'
import NotificationRouter from './modules/Notification/Notification.Router.js'
import RequestSeniorToAdminRouter from './modules/RequestSeniorToAdmin/RequestSeniorToAdmin.router.js'
import ApplicationTrainRouter from "./modules/Application/Application.router.js"
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config(); 


const Appinit = (app,express)=>{
    app.use(express.json());
    app.use(cors())
    connectDB();
    app.use('/user',UserRouter);
    app.use('/auth',AuthRouter);
    app.use('/project',ProjectRouter);
    app.use('/post',PostRouter);
    app.use('/comment',CommentRouter);
    app.use('/chat',ChatRouter);
    app.use('/externalapiLanguages',ExternalApiLanguagesRouter);
    app.use('/externalapiSkills',ExternalApiSkillsRouter);
    app.use('/externalapiFields',ExternalApiFieldsRouter);
    app.use('/applicationtrain',ApplicationTrainRouter);
    app.use('/notification',NotificationRouter);
    app.use('/requestseniortoadmin',RequestSeniorToAdminRouter);


    
    app.use('*',(req,res)=>{
        return res.status(404).json({message:"Page not Found"});
    });

    app.use( (err,req,res,next)=>{ // global error is 4 parameter than middelware is 3 parameter
     res.json({message:err.message});
    });
 
}
export default Appinit ;