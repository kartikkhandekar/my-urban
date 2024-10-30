const Customer=require('../models/customer-model')
const Booking=require("../models/booking-model")
const {validationResult}=require('express-validator');
const customerCltr={}

customerCltr.createProfile = async (req, res) => {
  console.log('Request received at:', new Date());
  console.log('Request body:', JSON.stringify(req.body, null, 2))

  if (req.file) {
      console.log('Uploaded file:', JSON.stringify(req.file, null, 2))
  }

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
      console.log('Validation errors:', JSON.stringify(errors.array(), null, 2));
      return res.status(400).json({ errors: errors.array() });
  }
  const body = req.body;

  try {
      const customer = new Customer(body);
      customer.userId = req.user.id
      customer.profilePic = req.file.path
      console.log('Profile Pic URL:', customer.profilePic);
      console.log('Creating customer with:', JSON.stringify(customer, null, 2));
      await customer.save();
      res.json(customer);
  } catch (err) {
      console.error('Error saving customer:', err.message);
      res.status(500).json({ error: 'Something went wrong' });
  }
};


customerCltr.updateProfile = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
  }

  const body = req.body;
  const userId = req.user.id;

  try {
      let customer = await Customer.findOne({ userId });

      if (!customer) {
          return res.status(400).json({ msg: 'No customer found' });
      }
      customer.name = body.name;
      customer.phone = body.phone;
      customer.address = body.address;
      customer.profilePic=req.file.path
      await customer.save();
      res.json(customer); 
  } catch (err) {
      console.error('Error updating customer:', err.message);
      res.status(500).json({ msg: 'Server error' });
  }
};



customerCltr.allCustomers=async(req,res)=>{
   try{ 
     const customers=await Customer.find().populate('userId',['email'])
    if(!customers){
        return res.json({error:'No records found'})
    }
    res.status(200).json(customers)
  }catch(err){
    res.status(500).json({error:'somthing went wrong'})

  }
}

customerCltr.singleCustomer=async(req,res)=>{
    try{ 
        
        const customers=await Customer.findOne({userId:req.user.id}).populate('userId',['email'])
     if(!customers){
         return res.json({error:'No records found'})
     }
     res.status(200).json(customers)
   }catch(err){
     res.status(500).json({error:'somthing went wrong'})
   }
 }

 customerCltr.delete=async(req,res)=>{
    try{
        const id=req.params.customerId
        const customer=await Customer.findOneAndDelete({userId:req.user.id,_id:id})
        if(!customer){
           return res.json({error:'Record not found'})
        }
        res.status(200).json(customer)

    }catch(err){
        res.status(500).json({error:'somthing went wrong'})

    }
 }



 customerCltr.updateStatus = async (req, res) => {
  const errors=validationResult(req)
  if(!errors.isEmpty()){
      return res.status(400).json({errors:errors.array()})
  }
  try {
      const { bookingId } = req.params;
      const { status } = req.body;

      // Ensure the request is coming from a service provider
      const booking = await Booking.findById({_id:bookingId,customerId:req.user.id})
      if (!booking) {
          return res.status(404).json({ message: 'Booking not found' });
      }
       
      // Only the service provider can update isAccepted

      console.log(req.user.id.toString(),booking.customerId.toString())
      
      if (req.user.id.toString() !== booking.customerId.toString()) {
          return res.status(403).json({ message: 'Access denied' });
      }

      if(booking.isAccepted === false){
           return res.status(400).json({errors:'Still Service-Provider Not accepted Your Service'})
      }

      booking.status = status
      await booking.save()
      res.status(200).json(booking)
  } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
  }
};

module.exports=customerCltr