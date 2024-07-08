const Booking=require('../models/booking-model')
const {validationResult}=require('express-validator')
const bookingCltr={}

bookingCltr.create=async(req,res)=>{
    const errors=validationResult(req)
    if(!errors.isEmpty()){
        return res.json({errors:errors.array()})
    }
    try{
       const body=req.body
       const serviceId=req.params.providerId
       const booking=new Booking(body)
       booking.customerId=req.user.id
       booking.serviceProviderId=serviceId
       await booking.save()
       res.status(200).json(booking)
    }catch(err){
          res.status(500).json({error:'Somthing went wrong'})
    }
}

bookingCltr.allBookings=async(req,res)=>{
    const bookings=await Booking.find().populate('customerId',['name','phone','address']).populate('serviceProviderId',['serviceProviderName','price','phone','address'])
    if(bookings){
        return res.status(200).json(bookings)
    }
    res.json({error:'No record found'})
}

bookingCltr.single=async (req,res)=>{
   try{
     const id=req.params.bookingId
    const response =await Booking.findById(id).populate('customerId',['name','phone','address']).populate('serviceProviderId',['serviceProviderName','price','phone','address'])
    res.status(200).json(response)
   }catch(err){
    res.status(500).json({error:'Something went wrong'})
   }
}

bookingCltr.update=async (req,res)=>{
    const errors=validationResult(req)
    if(!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()})
    }
    try{
      const id=req.params.bookingId
      const body=req.body
      const response=await Booking.findOneAndUpdate({customerId:req.user.id,_id:id},body,{new:true})
      res.status(200).json(response)
    }catch(err){
         res.status(500).json({error:'Somthing went wrong'})
    }
}

bookingCltr.updateByAdmin=async (req,res)=>{
    const errors=validationResult(req)
    if(!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()})
    }
    try{
       const body=req.body
       const id=req.params.bookingId
       const response=await Booking.findByIdAndUpdate(id,body,{new:true})
       res.status(200).json(response)
    }catch(err){
        res.status(500).json({error:'Somthing went wrong'})

    }
}

bookingCltr.accepted=async (req,res)=>{
    const errors=validationResult(req)
    if(!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()})
    }
    try{
      const body=req.body
      const providerId=req.params.providerId
      const bookingId=req.params.bookingId
      const response=await Booking.findOneAndUpdate({serviceProviderId:providerId,_id:bookingId},body,{new:true})
      res.status(200).json(response)
    }catch(err){
        res.status(500).json({error:'Somthing went wrong'})
    }
}

bookingCltr.delete=async(req,res)=>{
    const bookingId=req.params.bookingId
    try{
         const response=await Booking.findOneAndDelete({customerId:req.user.id,_id:bookingId},{new:true})
         if(response){
            res.status(200).json(response)
         }else{
            res.status(400).json({error:'record not found'})
         }
    }catch(err){
        res.status(500).json({error:'somthing wemt wrong'})
    }
}
module.exports=bookingCltr