import nodemailer from "nodemailer";
import SMTPTransport from "nodemailer/lib/smtp-transport";

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  family: 4, // IPv4 fix
  auth: {
    user: process.env.EMAIL_USER!,
    pass: process.env.EMAIL_PASS!
  }
} as SMTPTransport.Options);

export const sendOTPEmail = async (email: string, otp: string) => {
  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Password Reset OTP",
    text: `Your OTP is ${otp}`
  });
};