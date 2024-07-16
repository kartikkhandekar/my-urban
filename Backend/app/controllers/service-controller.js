const ServiceProvider=require('../models/serviceProvider-model')
const Service=require('../models/service-model')
const {validationResult}=require('express-validator')
const serviceCltr={}

serviceCltr.create=async(req,res)=>{
    const errors=validationResult(req)
    if(!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()})
    }

    try{
        const body=req.body
        const id=req.params.serviceProviderId
        const service=new Service(body)
        service.serviceProvider=id
        await service.save()
        const update = await ServiceProvider.findOneAndUpdate( {userId:req.user.id} , { $push: { service: service._id } }, { new: true });
        if (!update) {
            return res.status(404).json({ error: 'provider not found' });
        }
        res.status(200).json(service)
    }catch(err){
        res.status(500).json({error:'Somthing went wrong'})
    }
}

serviceCltr.update=async(req,res)=>{
    const errors=validationResult(req)
    if(!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()})
    }
    try{
        const body=req.body
        const serviceId=req.params.serviceId
        const update=await Service.findOneAndUpdate({serviceProviderId:req.user.id,_id:serviceId},body,{new:true})
        if(!update){
            return res.status(404).json({error:'Record Not Found'})
        }
        res.status(200).json(update)
    }catch(err){
        res.status(500).json({error:'Somthing went wrong'})

    }
}

serviceCltr.single=async(req,res)=>{
    try{
        const serviceId=req.params.serviceId
        const service=await Service.findById(serviceId).populate('serviceProvider')
        if(!service){
            return res.status(404).json({error:"Record Not Found"})
        }
        res.status(200).json(service)
    }catch(err){
        res.status(500).json({error:'Somthing went wrong'})
    }
}

serviceCltr.all=async(req,res)=>{
    try{
        const service=await Service.find()
        if(!service){
            return res.status(404).json({error:'No Records Found'})
        }
        res.status(200).json(service)
    }catch(err){
        res.status(500).json({error:'Somthing went wrong'})
    }
}

serviceCltr.delete=async(req,res)=>{
    try{
        const serviceId=req.params.serviceId
        const service=await Service.findOneAndDelete({_id:serviceId},{new:true})
        if(!service){
            return res.status(404).json({error:'No Records Found'})
        }
        res.status(200).json(service)
    }catch(err){
        res.status(500).json({error:'Somthing went wrong'})
    }
}


serviceCltr.updateByAdmin=async(req,res)=>{
    const errors=validationResult(req)
    if(!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()})
    } 
    try{
        const serviceId=req.params.seriveId
        const body=req.body
        const response=await Service.findById(serviceId)
        if(response){
            response.isVerified=body.isVerified
            await response.save()
            return res.json(response)
        }
         res.status(404).json({error:'No Records Found'})
    }catch(err){
        res.status(500).json({ errors: 'something went wrong'})

    }
}
module.exports=serviceCltr