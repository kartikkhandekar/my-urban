const ServiceProvider =require('../models/serviceProvider-model')
const Service=require('../models/service-model')
const serviceValidation={
    servicename:{
        exists:{
            errorMessage:'servicename is required'
        },
        notEmpty:{
            errorMessage:'servicename cannot be empty'
        },
        custom:{
             options:async function(value,{req}){
                const service=await Service.findOne({serviceProvider:req.user.id,servicename:value})
                if(service){
                    throw new Error('ServiceName is already')
                }else{
                    return true
                }
             }
        },
        // custom:{
        //     options:async function(value,{req}){
        //        const provider=await ServiceProvider.findById(req.user.id)
        //        if(provider.category.includes('painting of walls and furniture')){
        //           if(value == 'AC repair(split/window)' || value == 'Gas leak fix and refill' || value == 'Install and Repair'){
        //             return true
        //           }else{
        //             throw new Error('service should be either one of this [AC repair(split/window),Gas leak fix and refill,Install and Repair]')
        //           }
        //        }
        //     }
        // },
        trim:true
    },
    price:{
        exists:{
            errorMessage:'price is required'
        },
        notEmpty:{
            errorMessage:'price cannot be empty'
        },
        trim:true,
        custom:{
            options: function(value,{req}){
                 if(value <= 0){
                      throw new Error('price should more then 0')
                 }else{
                    return true
                 }
            }
        }
    },
    description:{
        exists:{
            errorMessage:'description is required'
        },
        notEmpty:{
            errorMessage:'description cannot be empty'
        },
        trim:true
    },
    duration:{
        exists:{
            errorMessage:'duration is required'
        },
        notEmpty:{
            errorMessage:'duration cannot be empty'
        }
    }
}

const adminUpdate={
    isVerified :{
        exists: {
            errorMessage: 'verified is required'
        },
        notEmpty: {
            errorMessage: 'verified cannot be blank'
        },
        trim:true,
    }
}

module.exports={serviceValidation,adminUpdate}