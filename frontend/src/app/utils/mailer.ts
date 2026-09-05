/* eslint-disable @typescript-eslint/no-explicit-any */

import nodemailer from "nodemailer";
import { envVars } from "../../config/env";
import ejs from "ejs";
import path from "path";


const transporter = nodemailer.createTransport({
    host: envVars.EMAIL_SENDER.SMTP_HOST,
    secure: true,
    auth: {
        user: envVars.EMAIL_SENDER.SMTP_USER,
        pass: envVars.EMAIL_SENDER.SMTP_PASS,
    },
    port: Number(envVars.EMAIL_SENDER.SMTP_PORT)
});


interface SendEmailOptions {
    to: string,
    subject: string,
    templateName: string,
    expiresIn?: string,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    templateData: Record<string, any>;
    attachments?: {
        filename: string,
        content: Buffer | string,
        contentType: string
    }[]
}

interface TemplateData {
  name?: string;
  otp?: string;
  expiresIn?: string;
  [key: string]: any; 
}

export const sendEmail = async ({ subject, templateName, templateData, to, attachments, expiresIn }: SendEmailOptions) => {
    try {
        const mergedTemplateData: TemplateData = { ...templateData, expiresIn };
        const templatePath = path.resolve(process.cwd(), `src/app/templates/${templateName}.ejs`);
        const html = await ejs.renderFile(templatePath, mergedTemplateData);

         await transporter.sendMail({
            from: envVars.EMAIL_SENDER.SMTP_FROM,
            to,
            subject,
            html,
            attachments: attachments?.map(attachment => {
                return {
                    filename: attachment.filename,
                    content: attachment.content,
                    contentType: attachment.contentType
                }
            }),
            
        });

        // console.log("Email sent successfully!", info);

    } catch (err) {
        console.log("Error in sending email", err);
    }

}