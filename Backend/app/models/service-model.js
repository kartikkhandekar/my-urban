const {Schema,model}=require('mongoose')

const serviceSchema=new Schema({
  servicename:String,
  category:String,
  description:[String],
  price:Number,
  serviceProvider:{
    type:Schema.Types.ObjectId,
    ref:'User'
  },
  rating:{
    type: Number,
    default: 0,
  },
  duration:String
 
},{timestamps:true})

const Service=model("Service",serviceSchema)

module.exports=Service