const bookingValidation={
 date:{
    exists:{
        errorMessage:'date is required'
    },
    notEmpty:{
        errorMessage:'date cannot be empty'
    },
    trim:true,
    isDate:{
        errorMessage:' date is invaild'
    },
    custom:{
        options: function (value){
          if(new Date(value) <= new Date()){
             throw new Error('Date should be greater then today or today')
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
    trim:true,
 }
}

const bookingUpdateValidation={
    date:{
        exists:{
            errorMessage:'date is required'
        },
        notEmpty:{
            errorMessage:'date cannot be empty'
        },
        trim:true,
        isDate:{
            errorMessage:' date is invaild'
        },
        custom:{
            options: function (value){
              if(new Date() >= new Date(value)){
                 throw new Error('Date should be greater then today or today')
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
        trim:true,
     }
}

const bookingAccepted={
    isAccepted:{
        exists:{
            errorMessage:'isAccepted is required'
        },
        notEmpty:{
            errorMessage:'isAccepted cannot be empty'
        },
        trim:true,
    }
}

const bookingUpdateByAdmin={
status:
   { 
    exists:{
        errorMessage:'description is required'
    },
    notEmpty:{
        errorMessage:'description cannot be empty'
    }, isIn:{
        options:[['pending','completed','comfirmed','canceled']],
        errorMessage:'payment status should either pending,completed,comfirmed,canceled'
   },
    trim:true,
  },
  payment:{
    exists:{
        errorMessage:'description is required'
    },
    notEmpty:{
        errorMessage:'description cannot be empty'
    },
    isIn:{
           options:[['pending','completed']],
           errorMessage:'payment status should either pending or completed'
    },
    trim:true,
  }
}

module.exports={bookingValidation,bookingUpdateValidation,bookingAccepted,bookingUpdateByAdmin}