const Review=require('../models/review-model')
const Booking=require('../models/booking-model')
const Service=require('../models/service-model')
const { validationResult } = require('express-validator')
const Customer = require('../models/customer-model')
const reviewcltr={}

reviewcltr.create = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const bookingId=req.params.bookingId  
  const body=req.body
  try {
    const  book =await Booking.findById(bookingId)
    const serviceId=book.services[0].serviceId
    const review = new Review(body);

    review.service = serviceId
    review.customerId = req.user.id;
    review.comment=body.comment
    review.rating=body.rating
    const noOfReviews = await Review.countDocuments({ service: serviceId });
    const service = await Service.findById(serviceId);
    const prevRating = service.rating;
    const newRating =
      (prevRating * noOfReviews + body.rating) / (noOfReviews + 1);
    service.rating = newRating;
    await service.save()
    await review.save()
    const booking = await Booking.findOneAndUpdate(
      { bookingId: bookingId },
      { $set: { isReview: true} },
      { new: true }
    );
    await booking.save()
    res.status(201).json(review);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "internal server error" });
  }
};

//  reviewcltr.update=async(req,res)=>{
//     try{
//        const review=req.params.reviewId
//        const serviceProviderId=req.params.providerId
//        const body=req.body
//        const update=await Review.findByIdAndUpdate({customerId:req.user.id,_id:review,serviceProviderId:serviceProviderId},body,{new:true})
//        if(!update){
//          return res.status(400).json({error:'Record not Found'})
//        }
//        res.status(200).json(update)
       
//     }catch(err){
//       res.status(500).json({error:'Somthing went wrong'})
//     }
//  }

//  reviewcltr.single=async(req,res)=>{
//    try{
//      const providerId=req.params.providerId
//      const reviewId=req.params.reviewId
//      const review=await Review.findOne({_id:reviewId,serviceProviderId:providerId})
//      if(!review){
//       return res.status(400).json({error:"Record Not Found"})
//      }
//      res.status(200).json(review)
//    }catch(err){
//       res.status(500).json({error:'Somthing went wrong'})

//    }
//  }

 
//  reviewcltr.particularProvider=async(req,res)=>{
//    try{
//      const providerId=req.params.providerId
//      const review=await Review.find({serviceProviderId:providerId})
//      if(!review){
//       return res.status(400).json({error:"Record Not Found"})
//      }
//      res.status(200).json(review)
//    }catch(err){
//       res.status(500).json({error:'Somthing went wrong'})

//    }
//  }

 reviewcltr.all=async(req,res)=>{
   try{
     const review=await Review.find()
     if(!review){
      return res.status(400).json({error:"Record Not Found"})
     }
     res.status(200).json(review)
   }catch(err){
      res.status(500).json({error:'Somthing went wrong'})

   }
 }

 reviewcltr.delete=async (req, res) => {
  const userId = req.user.id;
  const id = req.params.id;
  const customer = await Customer.findOne({ _id: userId });
  if (!customer) {
    res.status(403).json({ error: "you are not authorised for deleting this record" })
  }
  try {
    const review = await Review.findOneAndDelete({ _id: id })
    res.json(review)
  } catch (err) {
    console.log(err);
    res.json({ error: "internal server error" })
  }
}
module.exports=reviewcltr