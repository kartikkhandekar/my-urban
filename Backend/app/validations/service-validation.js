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
       
        trim:true
    },
    category:{
        exists:{
            errorMessage:'Category is required'
        },
        notEmpty:{
            errorMessage:'Category cannot be empty'
        },isIn: {
            options: [['Painting & Decor','AC Repair and service' ,'Electrician,Plumber & Carpenter', 'Bathroom and Kitchen cleaning' , "Men's Salon & Massage","Women's Salon & Spa"]],
            errorMessage: "category should either be a Painting & Decor,AC Repair and service ,Electrician,Plumber & Carpenter, Bathroom and Kitchen cleaning , Men's Salon & Massage,Women's Salon & Spa"
        },trim:true
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

const serviceUpdateValidation={
    servicename:{
        exists:{
            errorMessage:'servicename is required'
        },
        notEmpty:{
            errorMessage:'servicename cannot be empty'
        },
       
        trim:true
    },
    category:{
        exists:{
            errorMessage:'Category is required'
        },
        notEmpty:{
            errorMessage:'Category cannot be empty'
        },isIn: {
            options: [['Painting & Decor','AC Repair and service' ,'Electrician,Plumber & Carpenter', 'Bathroom and Kitchen cleaning' , "Men's Salon & Massage","Women's Salon & Spa"]],
            errorMessage: "category should either be a Painting & Decor,AC Repair and service ,Electrician,Plumber & Carpenter, Bathroom and Kitchen cleaning , Men's Salon & Massage,Women's Salon & Spa"
        },trim:true
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

module.exports={serviceValidation,serviceUpdateValidation,adminUpdate}