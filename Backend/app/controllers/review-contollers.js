const Review=require('../models/review-model')
const Booking=require('../models/booking-model')
const Service=require('../models/service-model')
const { validationResult } = require('express-validator')
const Customer = require('../models/customer-model')
const reviewcltr={}



reviewcltr.create = async (req, res) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() })
  } 

  const bookingId = req.params.bookingId
  const { comment, rating } = req.body

  try {
    const booking = await Booking.findById(bookingId)
    if (!booking) {
      return res.status(404).json({ error: "Booking not found" })
    }

    const serviceId = booking.services[0].serviceId
    const review = new Review({
      service: serviceId,
      customerId: req.user.id,
      comment,
      rating
    });

    const noOfReviews = await Review.countDocuments({ service: serviceId })
    console.log(noOfReviews)
    const service = await Service.findById(serviceId)
    if (!service) {
      return res.status(404).json({ error: "Service not found" })
    }

    const prevRating = service.rating;
    console.log(prevRating)
    const newRating = (prevRating * noOfReviews) + rating / (noOfReviews + 1)
   
    service.rating = newRating;

    await service.save()
    await review.save()

    booking.isReview = true
    await booking.save()

    res.status(201).json(review)
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Internal server error" })
  }
}




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

 
 reviewcltr.particular=async(req,res)=>{
   try{
    const serviceId=req.params.serviceId
     const review=await Review.find({service:serviceId}).populate('customerId').populate('service')
     if(!review){
      return res.status(400).json({error:"Record Not Found"})
     }
     res.status(200).json(review)
   }catch(err){
      res.status(500).json({error:'Somthing went wrong'})

   }
 }

 reviewcltr.all=async(req,res)=>{
   try{
     const review=await Review.find().populate('customerId').populate('service')
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