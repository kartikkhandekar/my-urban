const cron = require('node-cron')
const Booking = require('../models/booking-model'); 
const nodemailer = require('nodemailer');
require('dotenv').config()


const checkPendingBookings = async () => {
    try {
        const now = new Date();


        const transporter = nodemailer.createTransport({
            service: 'gmail', 
            auth: {
            user:process.env.EMAIL,
            pass: process.env.PASS_KEY,
        },
        });


        
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
        const bookings = await Booking.find({
            isAccepted: 'false',
            
        }).populate('services.serviceProviderId');

        for (const booking of bookings) {
            for (const service of booking.services) {
                const serviceProviderEmail = service.serviceProviderId.email; // Assuming email field in User model
                const subject = `New Booking Request #${booking._id}`;
                const text = `
                Dear Service Provider,

                You have a new booking request that requires your attention.

                Booking ID: ${booking._id}
                Date: ${booking.date}
                Address: ${booking.address}

                Please respond to this booking request as soon as possible.

                Regards,
                MyUrban
                `;

                await sendRemainderMail(serviceProviderEmail, subject, text)
            }
            
        }
    } catch (error) {
        console.error('Error checking bookings:', error);
    }
};

// Schedule the task to run every hour
cron.schedule('0 0 1 1 *', () => {
    console.log('Running  reminder job...')
    checkPendingBookings() 
  })
console.log('Cron is running...');

module.exports=checkPendingBookings