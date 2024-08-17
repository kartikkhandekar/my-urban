const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail', 
  auth: {
    user:process.env.EMAIL,
    pass: process.env.PASS_KEY,
  },
});

const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString(); 
  };
  
const sendOTPEmail = async (email, username) => {
    const otp = generateOTP()
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
      return otp
    } catch (error) {
      console.error('Error sending OTP email:', error);
      throw new Error('Failed to send OTP email');
    }
  };


  
  const accpetedMail = async (email, username) => {
    const mailOptions = {
      from: process.env.EMAIL,
      to: email,
      subject: 'Your Service Provider Application Has Been Accepted',
      html: `
     
               <h1>Congratulations, ${username}!</h1>
                <p>We are pleased to inform you that your application to become a service provider on our platform has been accepted.</p>
                <p>You can now start offering your services to customers and manage your profile on our platform.</p>
                <p>Thank you for joining us, and we look forward to a successful partnership!</p>
                <br>
                <p>Best regards,</p>
                <p>MyUrban</p>
               
           `,
  
    };
  
    try {
      await transporter.sendMail(mailOptions);
      console.log('Email sent successfully');
    
    } catch (error) {
      console.error('Error sending  email:', error);
      throw new Error('Failed to send  email');
    }
  };

  const rejectedMail = async (email, username) => {
    const mailOptions = {
      from: process.env.EMAIL,
      to: email,
      subject: 'Your Service Provider Application Has Been Rejected',
      html: `
     
                <h1>Dear ${username},</h1>
                <p>Thank you for your interest in becoming a service provider on our platform.</p>
                <p>After careful consideration, we regret to inform you that we are unable to accept your application at this time.</p>
                <p>If you have any questions or would like to apply again in the future, please feel free to reach out to us.</p>
                <br>
                <p>Best regards,</p>
                <p>MyUrban</p>`,
  
    };
  
    try {
      await transporter.sendMail(mailOptions);
      console.log('Email sent successfully');
    
    } catch (error) {
      console.error('Error sending OTP email:', error);
      throw new Error('Failed to send OTP email');
    }
  };


 const accpetedBookingMail = async (email,bookingDetails) => {
    const mailOptions = {
      from: process.env.EMAIL,
      to: email,
      subject: 'Booking Accepted',
      html: `
        <h1>Booking Accepted</h1>
        <p>Dear Customer,</p>
        <p>Your booking for the following service has been accepted:</p>
        <ul>
         <li>Service: ${bookingDetails.services[0].serviceId.serviceName}</li>
          <li>Date: ${bookingDetails.date}</li>
          <li>Time: ${bookingDetails.slot}</li>
          <li>Service Provider: ${bookingDetails.services[0].serviceProviderId.username}</li>
        </ul>
        <p>Thank you for choosing our service!</p>
        <br>
        <p>Best regards,</p>
        <p>MyUrban</p>
      `,
  
    };
  
    try {
      await transporter.sendMail(mailOptions);
      console.log('Email sent successfully');
    
    } catch (error) {
      console.error('Error sending  email:', error);
      throw new Error('Failed to send  email');
    }
  };

  const rejectedBookingMail = async (email, bookingDetails) => {
    const mailOptions = {
      from: process.env.EMAIL,
      to: email,
      subject: 'Booking Rejected',
      html: `
        <h1>Booking Rejected</h1>
        <p>Dear Customer,</p>
        <p>We regret to inform you that your booking for the following service has been rejected:</p>
        <ul>
          <li>Service: ${bookingDetails.services[0].serviceId.serviceName}</li>
          <li>Date: ${bookingDetails.date}</li>
          <li>Time: ${bookingDetails.slot}</li>
          <li>Service Provider: ${bookingDetails.services[0].serviceProviderId.username}</li>
        </ul>
        <p>If you have any questions or need further assistance, please contact our support team.</p>
        <p>Thank you for understanding.</p>
        <br>
        <p>Best regards,</p>
        <p>MyUrban</p>
      `,
  
    };
  
    try {
      await transporter.sendMail(mailOptions);
      console.log('Email sent successfully');
    
    } catch (error) {
      console.error('Error sending OTP email:', error);
      throw new Error('Failed to send OTP email');
    }
  };



  

// Function to send an email
const sendRemainderMail = async (to, subject, text) => {
  try {
      await transporter.sendMail({
          from: process.env.EMAIL,
          to,
          subject,
          text
      });
      console.log('Email sent successfully to', to);
  } catch (error) {
      console.error('Error sending email:', error);
  }
}

module.exports={sendOTPEmail,sendRemainderMail,accpetedMail,rejectedMail,accpetedBookingMail,rejectedBookingMail}