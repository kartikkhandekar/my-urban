const Customer=require('../models/customer-model')

const customerValidation={
   userId:{
        custom:{
            options:async function(value,{req}){
                const customer=await Customer.findOne({userId:req.user.id})
                if(customer){
                    throw new Error('profile already taken')
                }else{
                    return true
                }
            }
        }
    },
    name:{
        exists: {
            errorMessage: 'phone is required'            
        },
        notEmpty: {
            errorMessage: 'phone cannot be empty'
        },
        trim:true
    },phone:{
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
                const user = await Customer.findOne({ phone: value })
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

const customerUpdateValidation={
   
    name:{
        exists: {
            errorMessage: 'phone is required'            
        },
        notEmpty: {
            errorMessage: 'phone cannot be empty'
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


customerUpdateStatusValidation={
    status:{
        exists: {
            errorMessage: 'status is required'            
        },
        notEmpty: {
            errorMessage: 'status cannot be empty'
        },
        isIn:{
             options:[['pending','completed']],
             errorMessage:'status should be pending or completed'

        },
        trim:true
    }
}
module.exports={customerValidation,customerUpdateStatusValidation,customerUpdateValidation}