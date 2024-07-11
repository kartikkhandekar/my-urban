const {Schema,model}=require('mongoose')

const serviceSchema=new Schema({
  serivename:String,
  description:String,
  price:Number,
  serviceProvider:{
    type:Schema.Types.ObjectId,
    ref:'ServiceProvider'
  }
},{timestamps:true})

const Service=model("Service",serviceSchema)

module.exports=Service