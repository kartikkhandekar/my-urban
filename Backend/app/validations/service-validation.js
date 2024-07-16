
const serviceValidation={
    servicename:{
        exists:{
            errorMessage:'servicename is required'
        },
        notEmpty:{
            errorMessage:'servicename cannot be empty'
        },
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