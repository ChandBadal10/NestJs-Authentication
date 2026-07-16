import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';



@Injectable()
export class MailService {
    private transporter = nodemailer.createTransport({
        service: 'gmail',

        auth: {
            user: process.env.SENDER_EMAIL,
            pass: process.env.EMAIL_PASSWORD,
        },
    });

    async sendEmail(
        to: string,
        subject: string,
        html: string,
    ) {
        try{
            await this.transporter.sendMail({
                from: process.env.SENDER_EMAIL,
                to,
                subject,
                html,
            });

            return {
                success: true,
                message: "Email sent successfully",
            }
        } catch(error: any) {
            return {
                success: false,
                message: "Failed to send email",
                error: error.message,
            }
        }
    }
}




