// const mongoose=require('mongoose')
// const {Schema,model}=mongoose
// const serviceProviderSchema=new Schema({
//     userId: {
//         type: Schema.Types.ObjectId,
//              ref: 'User'
//      }, 
//      profilePic:String,
//      aadhaarPhoto:String,
//      serviceProviderName :String,
//      category :[String],
//      service:[{
//        type:Schema.Types.ObjectId,
//        ref:'Sevice'
//      }],
//      phone:Number,
//      review:[{
//       type:Schema.Types.ObjectId,
//         ref:'Review',
//      }],

//      address:String
     
// },{timestamps:true})

// const ServiceProvider=model('ServiceProvider',serviceProviderSchema)

// module.exports=ServiceProvider

const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const serviceProviderSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }, 
    profilePic: String,
    aadhaarPhoto: String,
    serviceProviderName: String,
    category: [String],
    service: [{
        type: Schema.Types.ObjectId,
        ref: 'Service'
    }],
    phone: Number,
    review: [{
        type: Schema.Types.ObjectId,
        ref: 'Review',
    }],
    address: String
}, { timestamps: true });

const ServiceProvider = model('ServiceProvider', serviceProviderSchema);

module.exports = ServiceProvider;
