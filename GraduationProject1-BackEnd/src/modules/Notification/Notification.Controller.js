import Notification from '../../Model/Notfication.js';
import CommentModel from '../../Model/CommentModel.js'; 
import PostModel from '../../Model/PostModel.js';
import UserModel from '../../Model/User.Model.js';
import mongoose from 'mongoose';

// وظيفة لإرسال الإشعار باستخدام Expo Push Notification
const sendPushNotification = async (expoPushToken, title, body, data) => {
  const message = {
      to: expoPushToken,
      sound: 'default',
      title,
      body,
      data,
  };

  await fetch('https://exp.host/--/api/v2/push/send', {
      method: 'POST',
      headers: {
          Accept: 'application/json',
          'Accept-encoding': 'gzip, deflate',
          'Content-Type': 'application/json',
      },
      body: JSON.stringify(message),
  });
};
export const getUserNotifications = async (req, res) => {
    try {
      const userId = req.user._id;  // الحصول على الـ userId من التوكن المفكك
      
      // جلب جميع الإشعارات للمستخدم
      const notifications = await Notification.find({ userId })
        .sort({ dateSent: -1 })  // ترتيب الإشعارات حسب تاريخ الإرسال من الأحدث إلى الأقدم
        .exec();
  
      // التأكد من أن الإشعارات موجودة
      if (!notifications || notifications.length === 0) {
        return res.status(404).json({ message: 'No notifications found' });
      }
  
      // إضافة commentId إذا كانت الإشعار من نوع "comment"
      const notificationsWithCommentId = await Promise.all(notifications.map(async (notification) => {
        if (notification.notificationType === 'comment' && notification.commentId) {
          // جلب التعليق المرتبط باستخدام commentId
          const comment = await CommentModel.findById(notification.commentId).exec();
          if (comment) {
            // إضافة commentId إلى الإشعار
            notification.comment = {
              _id: comment._id,
              text: comment.Text,
              postId: comment.PostId,
              userId: comment.UserId,
            };
          }
        }
        return notification;
      }));
  
      // إرسال الإشعارات للمستخدم مع commentId إذا كان موجودًا
      return res.status(200).json({
        message: 'Notifications fetched successfully',
        notifications: notificationsWithCommentId,
      });
  
    } catch (error) {
      console.error('Error fetching notifications:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  };
  

// دالة إنشاء الإشعار
export const createCommentNotification = async (req, res) => {
    try {
        const { postId, commentContent, userId, commentId } = req.body;

        // الحصول على بيانات البوست وصاحبه
        const post = await PostModel.findById(postId).populate('UserId');
        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }
        const postd = await PostModel.findById(postId)
        .populate('UserId', 'FullName PictureProfile'); // إحضار بيانات المستخدم المرتبطة بالمنشور

    if (!postd) {
        return res.status(404).json({ message: "Post not found." });
    }

        const postOwner = post.UserId; // صاحب البوست
        if (!postOwner) {
            return res.status(404).json({ message: "Post owner not found" });
        }

        // التحقق إذا كان المعلق هو صاحب البوست
        if (postOwner._id.toString() === userId) {
            console.log("Comment made by the post owner. No notification will be sent.");
            return res.status(200).json({ message: "No notification needed for post owner." });
        }

        // التحقق من وجود deviceToken لصاحب البوست
        if (!postOwner.deviceToken) {
            return res.status(400).json({ message: "Post owner does not have a device token" });
        }

        // البحث عن اسم المستخدم الذي علق
        const commentingUser = await UserModel.findById(userId).select('FullName');
        if (!commentingUser) {
            return res.status(404).json({ message: "Commenting user not found" });
        }

        // إنشاء الإشعار في قاعدة البيانات
        const newNotification = new Notification({
            userId: postOwner._id,
            type: 'comment',
            title: 'New comment on your post',
            message: `${commentingUser.FullName} commented on your post: "${commentContent}"`,
            action: `/posts/${postId}/comments/${commentId}`,
            data: { postId, commentId },
            priority: 'medium',
        });
    

        await newNotification.save();
    

        // إرسال الإشعار باستخدام Expo Push Notifications
        await sendPushNotification(
            postOwner.deviceToken,
            'New Comment Notification',
            `${commentingUser.FullName} commented on your post: "${commentContent}"`,
            { postId, commentId,postd, notificationType:'comment' }
        );

        return res.status(201).json({
            message: "Comment notification created and sent successfully",
            notification: newNotification,
        });
    } catch (error) {
        console.error("Error creating comment notification:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};


export const createCommentNotificationforweb = async (req, res) => {
  console.log(req.body);
  try {
      const { postId, commentContent, userId, commentId } = req.body;

      // الحصول على بيانات البوست وصاحبه
      const post = await PostModel.findById(postId).populate('UserId');
      if (!post) {
          return res.status(404).json({ message: "Post not found" });
      }

      const postOwner = post.UserId;  // صاحب البوست
      if (!postOwner) {
          return res.status(404).json({ message: "Post owner not found" });
      }

      // التحقق من وجود deviceToken لصاحب البوست
      if (!postOwner.deviceToken) {
          return res.status(400).json({ message: "Post owner does not have a device token" });
      }

      // البحث عن اسم المستخدم الذي علق
      const commentingUser = await UserModel.findById(userId).select('FullName');
      if (!commentingUser) {
          return res.status(404).json({ message: "Commenting user not found" });
      }

      // إنشاء الإشعار في قاعدة البيانات
      const newNotification = new Notification({
          userId: postOwner._id,
          type: 'comment',
          title: 'New comment on your post',
          message: `${commentingUser.FullName} commented on your post: "${commentContent}"`,
          action: `/posts/${postId}/comments/${commentId}`,
          data: { postId, commentId },
          priority: 'medium',
      });

      await newNotification.save();

      // إرسال الإشعار باستخدام Expo Push Notifications
      await sendPushNotification(
          postOwner.deviceToken,
          'New Comment Notification',
          `${commentingUser.FullName} commented on your post: "${commentContent}"`,
          { postId, commentId}
      );

      return res.status(201).json({
          message: "Comment notification created and sent successfully",
          notification: newNotification,
      });
  } catch (error) {
      console.error("Error creating comment notification:", error);
      return res.status(500).json({ message: "Internal server error" });
  }
};


export const UpdateNotificationStatus = async (req, res, next) => {
    try {
        const { notificationId } = req.params;
        const { status } = req.body;

        // تحقق من أن الحقل "status" موجود
        if (!status) {
            return res.status(400).json({ message: "Status is required" });
        }

        // البحث عن الإشعار وتحديث حالته
        const notification = await Notification.findByIdAndUpdate(
            notificationId,
            { status },
            { new: true } // إرجاع الكائن المعدل
        );

        if (!notification) {
            return res.status(404).json({ message: "Notification not found" });
        }

        return res.status(200).json({ message: "Notification status updated successfully", notification });
    } catch (error) {
        console.error("Error updating notification status:", error);
        return next(error);
    }
};


export const toggleLike = async (req, res) => {
  try {
    console.log("Request Body:", req.body);

    const { postId, userId } = req.body;

    if (!postId || !userId) {
      return res.status(400).json({ message: "postId and userId are required" });
    }

    const post = await PostModel.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    console.log("Initial Likes:", post.like);

    const userObjectId = new mongoose.Types.ObjectId(userId); // استخدام new مع ObjectId
    const isLiked = post.like.some(like => like.equals(userObjectId)); // التحقق باستخدام equals

    if (isLiked) {
      // إزالة اللايك
      post.like = post.like.filter(like => !like.equals(userObjectId)); // الإزالة باستخدام equals
      console.log("Removed User:", userId);
    } else {
      // إضافة اللايك
      post.like.push(userObjectId);
      console.log("Added User:", userId);
      await createLikeNotification(postId, userId);
    }

    await post.save(); // حفظ التغييرات في قاعدة البيانات
    console.log("Updated Likes:", post.like);

    return res.status(200).json({
      message: isLiked ? "Like removed" : "Like added",
      likeCount: post.like.length,
    });
  } catch (error) {
    console.error("Error in toggleLike:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};


// دالة إنشاء إشعار عندما يتم إضافة إعجاب
export const createLikeNotification = async (postId, userId) => {
    try {
      console.log(`Creating notification for postId: ${postId}, userId: ${userId}`);
  
      // استرجاع بيانات البوست وصاحبه
      const post = await PostModel.findById(postId).populate('UserId', 'FullName deviceToken');
      if (!post) {
        console.log("Post not found for notification");
        return;
      }
  
      const postd = await PostModel.findById(postId)
      .populate('UserId', 'FullName PictureProfile'); // إحضار بيانات المستخدم المرتبطة بالمنشور

  if (!postd) {
      return res.status(404).json({ message: "Post not found." });
  }
      const postOwner = post.UserId; // صاحب البوست
      if (!postOwner || postOwner._id.toString() === userId) {
        console.log("Notification not needed for the post owner or invalid post owner");
        return;
      }
  
      if (!postOwner.deviceToken) {
        console.log("Post owner does not have a device token");
        return;
      }
  
      const likingUser = await UserModel.findById(userId).select('FullName');
      if (!likingUser) {
        console.log("Liking user not found");
        return;
      }
  
      // إنشاء الإشعار في قاعدة البيانات
      const newNotification = new Notification({
        userId: postOwner._id, // صاحب البوست سيتلقى الإشعار
        type: 'like',
        title: 'New like on your post',
        message: `${likingUser.FullName} liked your post`,
        action: `/posts/${postId}`, // الرابط الذي يؤدي إلى المنشور
        data: { postId },
        priority: 'medium',
      });
  
      await newNotification.save();
  
      // إرسال الإشعار باستخدام Expo Push Notifications
      await sendPushNotification(
        postOwner.deviceToken,
        'New Like Notification',
        `${likingUser.FullName} liked your post`,
        { postId,postd, notificationType: 'like' }
      );
  
      console.log("Notification created and sent successfully");
    } catch (error) {
      console.error("Error creating notification:", error.message);
    }
  };