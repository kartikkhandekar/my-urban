const {Schema,model}=require('mongoose')

const bookingSchema=new Schema({
    customerId:{
        type:Schema.Types.ObjectId,
        ref:'User'
    },
    serviceProviderId:{
        type:Schema.Types.ObjectId,
        ref:'ServiceProvider'
    },
    date:Date,
    status:{
        type:String,
        default:'pending'
    },
    payment:{
        type:String,
        default:'pending'
    },
    description:String,
    isAccepted:{
        type:Boolean,
        default:false
    }
},{timestamps:true})

const Booking=model('Booking',bookingSchema)

module.exports=Booking