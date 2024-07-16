const {Schema,model}=require('mongoose')

const serviceSchema=new Schema({
  serivename:String,
  description:String,
  price:Number,
  serviceProvider:{
    type:Schema.Types.ObjectId,
    ref:'ServiceProvider'
  },
  isVerified:{
     type:Boolean,
     default:false
  }
},{timestamps:true})

const Service=model("Service",serviceSchema)

module.exports=Service