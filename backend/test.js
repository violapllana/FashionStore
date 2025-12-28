require("dotenv").config();
const nodemailer = require("nodemailer");

async function testEmail() {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: 587,
      secure: false, // TLS/STARTTLS
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    });

    const info = await transporter.sendMail({
      from: `"FashionX" <${process.env.SMTP_USER}>`,
      to: "violapllana11@gmail.com", // vendos email-in tënd për test
      subject: "Test Email from FashionStore",
      text: "Ky është një test email-i nga nodemailer me App Password."
    });

    console.log("Email sent successfully:", info.messageId);
  } catch (err) {
    console.log("Error sending email:", err);
  }
}

testEmail();
