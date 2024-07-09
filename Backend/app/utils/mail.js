const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail', // You can use other services like SendGrid, Mailgun, etc.
  auth: {
    user:process.env.EMAIL,
    pass: process.env.PASS_KEY,
  },
});

const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString(); // Generates a 6-digit OTP
  };
  
const sendOTPEmail = async (email, username) => {
    const otp = generateOTP(); // Generate OTP
    const mailOptions = {
      from: process.env.EMAIL,
      to: email,
      subject: 'Your OTP for Password Reset',
      text: `Dear ${username},
  
  Your OTP for resetting your password is: ${otp}
  
  Please use this OTP to complete the password reset process. This OTP is valid for 10 minutes.
  
  If you did not request a password reset, please ignore this email.
  
  Best regards,
  Urban Company`,
    };
  
    try {
      await transporter.sendMail(mailOptions);
      console.log('OTP email sent successfully');
      return otp; // Return the generated OTP for further processing
    } catch (error) {
      console.error('Error sending OTP email:', error);
      throw new Error('Failed to send OTP email');
    }
  };

module.exports=sendOTPEmail