import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  private transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: false,

    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  // Generic Email Sender
  async sendEmail(
  to: string,
  subject: string,
  html: string,
) {
  try {
    await this.transporter.sendMail({
      from: process.env.SENDER_EMAIL,
      to,
      subject,
      html,
    });

    console.log("Email sent successfully");
  } catch (error: any) {
    console.log("Mail Error:", error);

    throw error;
  }
}

  // Send Verification OTP
  async sendVerifyOtp(email: string, otp: string) {
    return this.sendEmail(
      email,
      'Verify Your Email',
      `
      <div style="font-family: Arial, sans-serif; max-width:600px; margin:auto; padding:20px;">
        <h2>Email Verification</h2>

        <p>Hello,</p>

        <p>Thank you for registering.</p>

        <p>Your verification OTP is:</p>

        <h1 style="color:#2563eb; letter-spacing:5px;">
          ${otp}
        </h1>

        <p>This OTP will expire in <b>10 minutes</b>.</p>

        <p>If you did not request this, please ignore this email.</p>

        <hr>

        <small>This is an automated email. Please do not reply.</small>
      </div>
      `,
    );
  }

  // Send Password Reset OTP
  async sendResetOtp(email: string, otp: string) {
  console.log("Sending reset OTP to:", email);

  return this.sendEmail(
    email,
    "Reset Your Password",
    `
    <h2>Password Reset</h2>
    <p>Your OTP is:</p>
    <h1>${otp}</h1>
    `,
  );
}
}