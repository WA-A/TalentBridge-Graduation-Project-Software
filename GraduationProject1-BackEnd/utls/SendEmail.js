import nodemailer from "nodemailer";

export async function SendEmail(to, subject, html) {
    try {
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
            to,
            subject,
            html,
        });

        console.log("Email sent: ", info.messageId);
        return info;
    } catch (error) {
        console.error("Error sending email: ", error.message);
        throw error;
    }
}
