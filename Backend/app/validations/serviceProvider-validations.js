const ServiceProvider=require('../models/serviceProvider-model')
const serviceProviderValidation={
    userId:{
        custom:{
            options:async function(value,{req}){
                const serviceProvider=await ServiceProvider.findOne({userId:req.user.id})
                if(serviceProvider){
                    throw new Error('Profile already taken')
                }else {
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
    description :{
        exists: {
            errorMessage: 'serviceProviderName is required'
        },
        notEmpty: {
            errorMessage: 'serviceProviderName cannot be blank'
        },
        trim:true
    },
    category :{
        exists: {
            errorMessage: 'category is required'
        },
        notEmpty: {
            errorMessage: 'category cannot be blank'
        },
        trim:true
    },
    price :{
        exists: {
            errorMessage: 'price is required'
        },
        notEmpty: {
            errorMessage: 'price cannot be blank'
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
    description :{
        exists: {
            errorMessage: 'serviceProviderName is required'
        },
        notEmpty: {
            errorMessage: 'serviceProviderName cannot be blank'
        },
        trim:true
    },
    category :{
        exists: {
            errorMessage: 'category is required'
        },
        notEmpty: {
            errorMessage: 'category cannot be blank'
        },isIn: {
            options: [['painting of walls and furniture','plumber','AC Repair and service,Bathroom and Kitchen cleaning','Salon for kids and men','Salon for women']],
            errorMessage: 'category should either be a painting of walls and furniture , plumber, AC Repair and service , Bathroom and Kitchen cleaning , Salon for kids and men , Salon for women'
        },
        trim:true
    },
    price :{
        exists: {
            errorMessage: 'price is required'
        },
        notEmpty: {
            errorMessage: 'price cannot be blank'
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
module.exports={serviceProviderValidation,serviceProviderUpdateValidation,adminUpdate}