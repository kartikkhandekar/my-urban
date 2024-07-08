const ServiceProvider=require('../models/serviceProvider-model')
const {validationResult}=require('express-validator')
const serviceProviderCltr={}

serviceProviderCltr.create=async (req,res)=>{
    const errors=validationResult(req)
    if(!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()})
    }
    const body=req.body
    try{
       const serviceProvider=new ServiceProvider(body)
       serviceProvider.userId=req.user.id
       await serviceProvider.save()
       res.status(200).json(serviceProvider)
    }
    catch(err){
        res.status(500).json({ errors: 'something went wrong'})
    }

}

serviceProviderCltr.update=async(req,res)=>{
    const errors=validationResult(req)
    if(!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()})
    }
    const body=req.body
    try{
        const id=req.params.serviceId
      const response=await ServiceProvider.findOneAndUpdate({userId:req.user.id, _id:id},body,{new:true})
      res.status(200).json(response)
    }catch(err){
        res.status(500).json({ errors: 'something went wrong'})

    }
}

serviceProviderCltr.updateByAdmin=async(req,res)=>{
    const errors=validationResult(req)
    if(!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()})
    } 
    try{
        const providerId=req.params.id
        const body=req.body
        const response=await ServiceProvider.findById(providerId)
        response.isVerified=body.isVerified
        await response.save()
        res.json(response)

    }catch(err){
        res.status(500).json({ errors: 'something went wrong'})

    }
}

serviceProviderCltr.allProviders=async (req,res)=>{
   try{
     const response =await ServiceProvider.find().populate('userId',['email'])
     res.status(400).json(response)
   }catch(err){
    
    res.status(500).json({ errors: 'something went wrong'})

   }
}

serviceProviderCltr.singleProvider=async (req,res)=>{

    try{
        const providerId=req.params.id
        const response =await ServiceProvider.findById(providerId).populate('userId',['email'])
        res.status(200).json(response)

    }catch(err){
        res.status(500).json({ errors: 'something went wrong'})
    }
}

serviceProviderCltr.delete=async (req,res)=>{
    try{
        const providerId=req.params.id
        const response=await ServiceProvider.findOneAndDelete({userId:req.user.id,_id:providerId})
        if(!response){
           return  res.status(401).json({error:'record not found'})
        }
            res.status(200).json(response)

    }catch(err){
        res.status(500).json({ errors: 'something went wrong'})
    }
}

module.exports=serviceProviderCltr