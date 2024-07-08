const {Schema,model}=require('mongoose')
const customerSchema=new Schema({
    userId:{
        type:Schema.Types.ObjectId,
        ref:'User'
    },
    name:String,
    phone:Number,
    address:String
},{timestamps:true})

const Customer=model('Customer',customerSchema)
module.exports=Customer