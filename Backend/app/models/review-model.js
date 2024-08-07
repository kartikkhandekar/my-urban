const {Schema,model}=require('mongoose')
const reviewSchema=new Schema({
  rating:Number,
  comment:String,
  customerId:{
     type:Schema.Types.ObjectId,
     ref:'User'
  },
  service:{
     type:Schema.Types.ObjectId,
     ref:'Service'
  }
},{timestamps:true})

const Review=model('Review',reviewSchema)

module.exports=Review