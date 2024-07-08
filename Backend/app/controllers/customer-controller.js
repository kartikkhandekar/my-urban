const Customer=require('../models/customer-model')
const {validationResult}=require('express-validator')
const customerCltr={}

customerCltr.create=async (req,res)=>{
  const errors=validationResult(req)
  if(!errors.isEmpty()){
    return res.json({errors:errors.array()})
  }
  try{
    const body=req.body
    const customer=new Customer(body)
    customer.userId=req.user.id
    await customer.save()
    res.status(200).json(customer)
  }catch(err){
    res.status(500).json({error:'somthing went wrong'})
  }
}

customerCltr.update=async(req,res)=>{
    const errors=validationResult(req)
  if(!errors.isEmpty()){
    return res.json({errors:errors.array()})
  }
  try{
      const id=req.params.customerId
      const body=req.body
      const customer=await Customer.findOneAndUpdate({userId:req.user.id,_id:id},body,{new:true})

      if(!customer){
        return res.json({error:'record not found'})
      }
      res.status(200).json(customer)
  }catch(err){
    res.status(500).json({error:'somthing went wrong'})

  }
}

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
        const id=req.params.customerId
        const customers=await Customer.findOne({userId:req.user.id,_id:id}).populate('userId',['email'])
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

module.exports=customerCltr