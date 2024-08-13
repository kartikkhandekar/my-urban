// const {Schema,model}=require('mongoose')

// const bookingSchema=new Schema({
//     customerId:{
//         type:Schema.Types.ObjectId,
//         ref:'User'
//     },
//     serviceProviderId:{
//         type:Schema.Types.ObjectId,
//         ref:'Service'
//     },
//     date:Date,
//     status:{
//         type:String,
//         default:'pending'
//     },
//     payment:{
//         type:String,
//         default:'pending'
//     },
//     description:String,
//     isAccepted:{
//         type:Boolean,
//         default:false
//     }
// },{timestamps:true})

// const Booking=model('Booking',bookingSchema)

// module.exports=Booking


const mongoose = require('mongoose')
const { Schema, model } = mongoose

const bookingSchema = new Schema({
    customerId: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    services: [{
        serviceId: {
            type: Schema.Types.ObjectId,
            ref: 'Service'
        },
        serviceProviderId: {
            type: Schema.Types.ObjectId,
            ref: 'User'
        }
    }],
    date: Date,
    slot:String,
    status: {
        type: String,
        default: 'pending'
    },
    address:String,
    payment: {
        type: Schema.Types.ObjectId,
        ref: 'Payment'
    },
    paymentStatus:{
         type: String,
        default: 'pending'
    },
    amount:Number,
    description: String,
    isAccepted: {
        type: Boolean,
        default: false
    },
    isReview: {
        type: Boolean,
        default: false,
      }
}, { timestamps: true })

const Booking = model('Booking', bookingSchema)

module.exports = Booking
