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
const sendNotification = async (req,res) => {
    try {

      const{to,subject,message} = req.body;
      await transporter.sendMail({
        from: `"Go Bites" <${process.env.EMAIL_USER}>`,
        to,
        subject,
        html: `
          <div style="font-family: Arial, sans-serif; background-color: #f9f9f9; padding: 20px;">
            <div style="max-width: 600px; margin: auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 0 10px rgba(0,0,0,0.1);">
              <div style="background-color: #16a34a; padding: 20px; text-align: center;">
                <h1 style="color: white; margin: 0;">Go Bites</h1>
              </div>
              <div style="padding: 20px;">
                <p style="font-size: 16px; color: #333;">Hello there,</p>
                <p style="font-size: 16px; color: #333;">${message}</p>
      
                <div style="margin: 30px 0; text-align: center;">
                  <a href="http://localhost:5173/customer/dashboard" target="_blank" style="background-color: #16a34a; color: white; padding: 12px 25px; text-decoration: none; border-radius: 5px; font-weight: bold;">Visit Go Bites</a>
                </div>
      
                <p style="font-size: 14px; color: #777;">If you did not expect this email, you can ignore it.</p>
              </div>
              <div style="background-color: #f0f0f0; padding: 15px; text-align: center; font-size: 12px; color: #888;">
                &copy; ${new Date().getFullYear()} Go Bites. All rights reserved.
              </div>
            </div>
          </div>
        `,
      });
      
      
      console.log("Email sent successfully to", to);
    } catch (error) {
      console.error("Error sending email:", error);
    }
  };
  
  module.exports = sendNotification;