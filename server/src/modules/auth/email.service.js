import nodemailer from "nodemailer";

const isTest = process.env.NODE_ENV === "test";

let transporter;

if (!isTest) {
  transporter = nodemailer.createTransport({
    host: "smtp-relay.brevo.com",
    port: 587,
    auth: {
      user: process.env.BREVO_SMTP_USER,
      pass: process.env.BREVO_SMTP_PASS,
    },
  });
}

export const sendOTPEmail = async (email, otp) => {
  if (isTest) {
    return;
  }

  await transporter.sendMail({
    from: '"AI SHIKSHAK" <no-reply@aishikshak.com>',
    to: email,
    subject: "Email Verification OTP",
    text: `Your verification OTP is ${otp}. It expires in 5 minutes.`,
  });
};