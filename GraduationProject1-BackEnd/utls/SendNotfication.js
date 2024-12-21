import nodemailer from 'nodemailer';
import Notification from './../src/Model/Notfication.js';  

export async function SendNotification(userId, to, subject, html) {
    try {
        const notification = new Notification({
            userId,
            message: html,  
        });

        await notification.save();

        
        const transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 587,
            secure: false,
            auth: {
                user: process.env.EmailSender,
                pass: process.env.PassSender,
            },
            tls: {
                rejectUnauthorized: false,
            },
            connectionTimeout: 10000,
        });

        const info = await transporter.sendMail({
            from: `Wasan Email <${process.env.EmailSender}>`,
            userId,
            to,
            subject,
            html,
        });

        console.log("Email sent: ", info.messageId);
        return info;
    } catch (error) {
        console.error("Error sending notification: ", error.message);
        throw error;
    }
}
