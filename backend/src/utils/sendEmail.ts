import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

interface EmailOptions {
    email: string;
    subject: string;
    message: string;
}

export const sendEmail = async (options: EmailOptions): Promise<any> => {
    const isFakeMode = process.env.EMAIL_TEST === "FAKE";

    // FIX 1: Safely read the dynamic From-Address directly from your active .env profile variables
    const emailSender = isFakeMode
        ? "noreply@alphamall.com"
        : (process.env.RE_EMAIL_FROM || "onboarding@resend.dev");

    const userName = isFakeMode ? process.env.EMAIL_USER : process.env.RE_EMAIL_USER;
    const userPass = isFakeMode ? process.env.EMAIL_PASSWORD : process.env.RE_EMAIL_PASSWORD;
    const mailHost = isFakeMode ? process.env.EMAIL_HOST : process.env.RE_EMAIL_HOST;
    const mailPort = isFakeMode ? (process.env.EMAIL_PORT || "2525") : (process.env.RE_EMAIL_PORT || "587");
    const mailDomainCompany = isFakeMode ? "Mailtrap" : "Resend";

    const transporter = nodemailer.createTransport({
        host: mailHost,
        port: parseInt(mailPort),
        secure: mailPort === "465",
        auth: {
            user: userName,
            pass: userPass,
        },
        // FIX 2: Bypasses self-signed certificate constraints often rejected by modern local engines
        tls: {
            rejectUnauthorized: false
        },
        debug: true,
        logger: true
    });

    // FIX 3: Read dynamically from incoming payload options instead of hardcoding the recipient
    const mailOptions = {
        from: `"AlphaMall Marketplace" <${emailSender}>`,
        to: options.email, // ✅ Dynamically handles target addresses now!
        subject: options.subject,
        html: options.message,
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log(`📨 Email sent successfully to ${mailDomainCompany} (${options.email}):`, info.messageId);
        return info;
    } catch (error) {
        console.error(`❌ Nodemailer SMTP Connection Crash Details(${mailDomainCompany}):`, error);
        throw error;
    }
};
