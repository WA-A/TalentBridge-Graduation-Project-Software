import { Router } from "express";
import { auth } from "../../MiddleWare/auth.js";
import * as NotificationController from './Notification.Controller.js';
import { EndPoints } from "./Notification.Role.js";

const router = Router();

router.post('/createCommentNotification',auth(EndPoints.CreateNotification),NotificationController.createCommentNotification);
router.post('/createLikeNotification',auth(EndPoints.CreateNotification),NotificationController.createLikeNotification);
router.post('/createCommentNotificationforweb',auth(EndPoints.CreateNotification),NotificationController.createCommentNotificationforweb);
router.get('/getUserNotifications',auth(EndPoints.CreateNotification),NotificationController.getUserNotifications);
router.patch('/UpdateNotificationStatus/:notificationId',auth(EndPoints.CreateNotification),NotificationController.UpdateNotificationStatus);
router.post('/toggleLike',auth(EndPoints.CreateNotification),NotificationController.toggleLike);
export default router;
