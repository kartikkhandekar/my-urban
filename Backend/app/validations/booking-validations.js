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
    custom: {
        options: function (value, { req }) {
          const inputDate = new Date(value);
          const today = new Date();
          
          // Resetting the time to midnight for comparison
          today.setHours(0, 0, 0, 0);
          inputDate.setHours(0, 0, 0, 0);
  
          if (inputDate < today) {
            throw new Error('Date should not be greater than today')
          } else {
            return true;
          }
        }
    }
 },
 slot:{
    exists:{
        errorMessage:'slot is required'
    },
    notEmpty:{
        errorMessage:'slot cannot be empty'
    },
    trim:true,
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