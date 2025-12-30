// const nodemailer = require("nodemailer");


// const transporter = nodemailer.createTransport({
//   host: process.env.SMTP_HOST,
//   port: process.env.SMTP_PORT ? parseInt(process.env.SMTP_PORT) : 587,
//   secure: process.env.SMTP_SECURE === "true", 
//   auth: {
//     user: process.env.SMTP_USER,
//     pass: process.env.SMTP_PASS,
//   },
// });

// transporter.verify().then(() => {
//   console.log("SMTP transporter is ready");
// }).catch(err => {
//   console.error("SMTP transporter error:", err.message);
// });

// exports.sendMail = async ({ to, subject, html }) => {
//   try {
//     const info = await transporter.sendMail({
//       from: `"FashionX" <${process.env.SMTP_USER}>`,
//       to,
//       subject,
//       html,
//     });
//     console.log("Email sent:", info.messageId);
//     return info;
//   } catch (err) {
//     console.error("Error sending email:", err.message);
//     throw err; 
//   }
// };
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT ? parseInt(process.env.SMTP_PORT) : 587,
  secure: process.env.SMTP_SECURE === "true",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

transporter.verify()
  .then(() => console.log("SMTP transporter is ready"))
  .catch(err => console.error("SMTP transporter error:", err.message));

/**
 * sendMail - dërgon email me dizajn FASHIONSTORE
 * @param {Object} params
 * @param {string} params.to - email-i i marrësit
 * @param {string} params.subject - subjekti i email-it
 * @param {string} params.html - HTML për email (mund të jetë teksti ose link)
 */
exports.sendMail = async ({ to, subject, html }) => {
  try {
    // Shtojmë dizajnin FASHIONSTORE rreth HTML-it ekzistues
    const emailHtml = `
      <div style="font-family: Arial, sans-serif; background-color: #f9f9f9; padding: 30px;">
        <div style="max-width: 600px; margin: auto; background: #fff; border-radius: 10px; padding: 20px; text-align: center; box-shadow: 0 4px 10px rgba(0,0,0,0.1);">
          <h1 style="font-size: 36px; color: #000; margin-bottom: 20px;">FASHIONSTORE</h1>
          <div style="color: #555; font-size: 16px; text-align: left;">
            ${html} <!-- ky është HTML i dërguar nga parametri -->
          </div>
          <p style="color: #777; font-size: 14px; margin-top: 20px; text-align: center;">
            If you did not request this, please ignore this email.
          </p>
        </div>
      </div>
    `;

    const info = await transporter.sendMail({
      from: `"FashionStore" <${process.env.SMTP_USER}>`,
      to,
      subject,
      html: emailHtml,
    });

    console.log("Email sent:", info.messageId);
    return info;
  } catch (err) {
    console.error("Error sending email:", err.message);
    throw err;
  }
};
