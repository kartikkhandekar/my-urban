const reviewValidation={
   
    comment:{
        in:['body'],
        exists:{
            errorMessage:'comment is required'
        },
        notEmpty:{
            errorMessage:'comment cannot be empty'
        },
        trim:true
    },
    rating:{
        exists:{
            errorMessage:'comment is required'
        },
        notEmpty:{
            errorMessage:'comment cannot be empty'
        },
        trim:true,
        custom:{
            options:async function(value){
                if(value < 0 && value > 6){
                    throw new Error('rating should be greaterthen 0 and less then 5')
                }else {
                     return true 
                }
            }
        }
    }
}
module.exports=reviewValidation