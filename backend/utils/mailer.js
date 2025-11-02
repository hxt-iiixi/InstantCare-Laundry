import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: process.env.SMTP_SECURE === "true",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

const MAIL_FROM = process.env.MAIL_FROM || process.env.SMTP_USER;
const SUPPORT_EMAIL = process.env.SUPPORT_EMAIL || process.env.SMTP_USER;

export const sendMail = async ({ to, subject, text, html }) => {
  return transporter.sendMail({
    from: MAIL_FROM,
    to,
    subject,
    text,
    html,
  });
};

export const sendOTPEmail = async (to, otp) => {
  await sendMail({
    to,
    subject: "Your AMPOWER OTP",
    text: `Your OTP code is: ${otp}. It will expire in 10 minutes.`,
  });
};

// Sends the contact form to your support inbox
export const sendContactEmail = async ({ fromEmail, fromName, phone, message }) => {
  const subject = `New Contact Message — ${fromName} (${fromEmail})`;
  const text = [
    `Name: ${fromName}`,
    `Email: ${fromEmail}`,
    `Phone: ${phone || "N/A"}`,
    ``,
    `Message:`,
    `${message}`,
  ].join("\n");

  await sendMail({ to: SUPPORT_EMAIL, subject, text });
};

// Optional: auto-reply to the sender
export const sendContactAutoReply = async ({ to, name }) => {
  const subject = "We received your message — AmPower";
  const text = `Hi ${name || "there"},\n\nThanks for reaching out to AmPower. We received your message and will get back to you shortly.\n\n— AmPower Team`;
  await sendMail({ to, subject, text });
};
