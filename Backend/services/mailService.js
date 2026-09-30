import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: "gmail",
  host: "smtp.gmail.com",
  port: 465,
  secure: true, // use STARTTLS (upgrade connection to TLS after connecting)
  auth: {
    user: process.env.AUTH_EMAIL,
    pass: process.env.AUTH_PASS,
  },
});

export const sendMail = async ({ email, emailSubject, mailBody }) => {
  try {
    const info = await transporter.sendMail({
      from: `"Sleek Review" <${process.env.AUTH_EMAIL}>`, // sender address
      to: email, // list of recipients
      subject: emailSubject, // subject line
      html: mailBody, // HTML body
    });

    console.log("Email sent: ", info.messageId);
  }
  catch (error) {
    console.error("Error sending email: ", error);
  }
}