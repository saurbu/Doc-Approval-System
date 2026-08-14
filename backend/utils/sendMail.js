import dotenv from "dotenv";
dotenv.config();
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendMail = async (to, subject, html) => {
  try {
    console.log("Sending email to:", to);
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      console.log("Email credentials not provided in .env, skipping email sending.");
      return;
    }
    const info = await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to,
      subject,
      html,
    });
    console.log("Email sent:", info.response);
  } catch (err) {
    console.warn("Mail warning (Creation succeeded without sending email):", err.message);
  }
};

export default sendMail;