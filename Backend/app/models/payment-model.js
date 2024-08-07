const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const paymentSchema = new Schema({
    bookingId: {
        type: Schema.Types.ObjectId,
        ref: 'Booking',
        required: true
    },
    customerId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    paymentStatus: {
        type: String,
        enum: ['pending', 'Successful', 'Failed'],
        default: 'pending'
    },
    paymentType: {
        type: String,
        default:null
    },
    transactionId: {
        type: String,
        required: true
    }
}, { timestamps: true });

const Payment = model('Payment', paymentSchema);

module.exports = Payment;
