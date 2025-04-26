const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER ,
      pass: process.env.EMAIL_PASSWORD
    }
  });

  // Function to send email
const sendNotification = async (to, subject, message) => {
    try {
      await transporter.sendMail({
        from: `"Go Bites" <${process.env.EMAIL_USER}>`,
        to,
        subject,
        text: message,
      });
      console.log("Email sent successfully to", to);
    } catch (error) {
      console.error("Error sending email:", error);
    }
  };
  
  module.exports = sendNotification;