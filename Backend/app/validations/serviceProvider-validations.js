const ServiceProvider=require('../models/serviceProvider-model')
const serviceProviderValidation={
    userId:{
        custom:{
            options:async function(value,{req}){
                const serviceProvider=await ServiceProvider.findOne({userId:req.user.id})
                console.log(serviceProvider)
                if(serviceProvider){
                    throw new Error('Profile already taken')
                }else {
                    console.log(serviceProvider)
                    return true
                }
            }
        }
    },
    serviceProviderName :{
        exists: {
            errorMessage: 'serviceProviderName is required'
        },
        notEmpty: {
            errorMessage: 'serviceProviderName cannot be blank'
        },
        trim:true
    },
    
    phone:{
        exists: {
            errorMessage: 'phone is required'            
        },
        notEmpty: {
            errorMessage: 'phone cannot be empty'
        },
        isLength: {
            options: {min: 10, max: 10},
            errorMessage: 'phone should be 10 numbers'
        },
        custom: {
            options: async function(value){
                const user = await ServiceProvider.findOne({ phone: value })
                if(user) {
                    throw new Error('phone no already taken')
                } else {
                    return true 
                }
            }
        },
        trim: true 
    },
    address:{
        exists: {
            errorMessage: 'address is required'            
        },
        notEmpty: {
            errorMessage: 'address cannot be empty'
        },
        trim:true
    }
   
    
}

const serviceProviderUpdateValidation={
    serviceProviderName :{
        exists: {
            errorMessage: 'serviceProviderName is required'
        },
        notEmpty: {
            errorMessage: 'serviceProviderName cannot be blank'
        },
        trim:true
    },
   
    address:{
        exists: {
            errorMessage: 'address is required'            
        },
        notEmpty: {
            errorMessage: 'address cannot be empty'
        },
        trim:true
    },
   phone:{
        exists: {
            errorMessage: 'phone is required'            
        },
        notEmpty: {
            errorMessage: 'phone cannot be empty'
        },
        isLength: {
            options: {min: 10, max: 10},
            errorMessage: 'phone should be 10 numbers'
        },
        
        trim: true 
    },
   
    
}


module.exports={serviceProviderValidation,serviceProviderUpdateValidation}