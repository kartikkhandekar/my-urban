
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
    }
}

module.exports=serviceValidation