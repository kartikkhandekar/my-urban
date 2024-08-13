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
        const service=new Service(body)
        service.serviceProvider=req.user.id
        await service.save()
        
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
        const update=await Service.findOneAndUpdate({serviceProvider:req.user.id,_id:serviceId},body,{new:true})
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
        const service=await Service.findById(serviceId).populate('serviceProvider',(['username','email']))
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
        const service=await Service.find().populate('serviceProvider',(['username','email']))
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


serviceCltr.category=async(req,res)=>{
    try {
           const category=req.params.category
        const services = await Service.find({category})
        if(!services){
            return res.status(404).json({error:'No Record Found'})
        }
        res.status(200).json(services)
    } catch (error) {
        console.error(error);
        throw new Error('Error fetching services by category');
    }
}

module.exports=serviceCltr