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

module.exports=serviceCltr