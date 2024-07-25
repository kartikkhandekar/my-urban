require('dotenv').config()
const configdb=require('./config/db')
const userCltr=require('./app/controllers/user-controller')
const serviceProviderCltr=require('./app/controllers/serviceProvider-controller')
const customerCltr=require('./app/controllers/customer-controller')
const bookingCltr=require('./app/controllers/booking-controllers')
const reviewcltr=require('./app/controllers/review-contollers')
const serviceCltr=require("./app/controllers/service-controller")
const authenticateUser=require('./app/middlewares/authentication')
const authorizeUser=require('./app/middlewares/authorization')
const {userRegisterValidationSchema,userUpdateValidation}=require('./app/validations/user-register')
const userLoginValidationSchema=require('./app/validations/user-login')
const {otpValidationSchema,forgotEmailValidationSchema}=require('./app/validations/forgetPassword')
const {serviceProviderValidation,serviceProviderUpdateValidation}=require('./app/validations/serviceProvider-validations')
const {customerValidation,customerUpdateValidation}=require('./app/validations/customer-validation')
const {bookingValidation,bookingUpdateValidation,bookingUpdateByAdmin,bookingAccepted}=require('./app/validations/booking-validations')
const reviewValidation=require('./app/validations/review-validatons')
const {serviceValidation,adminUpdate}=require("./app/validations/service-validation")
const upload=require('./app/middlewares/multer')
const express=require('express')
const cors=require('cors')
const path=require('path')
const {checkSchema}=require('express-validator')
const app=express()
app.use(express.json())
app.use(cors())
configdb()

app.use(express.urlencoded({ extended: false }));
// Serve static files from the 'uploads' directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads'), {
    // Ensure CORS headers allow the specified origin and credentials
    setHeaders: (res, path, stat) => {
      res.set('Access-Control-Allow-Origin', 'http://localhost:3000');
      res.set('Access-Control-Allow-Credentials', 'true');
    },
  }));




app.post('/provider/profile', 
  authenticateUser, 
  authorizeUser(['service-provider']), 
  upload.fields([
      { name: 'aadhaarPhoto', maxCount: 1 },
      { name: 'profilePic', maxCount: 1 }
  ]),  
  serviceProviderCltr.createProfile
);



//User
app.post('/users/register',checkSchema(userRegisterValidationSchema),userCltr.register)
app.post('/users/login',checkSchema(userLoginValidationSchema),userCltr.login)
app.put('/users/update',authenticateUser,checkSchema(userUpdateValidation),userCltr.update)
app.get('/users/account',authenticateUser,userCltr.account)
app.get('/users/all',userCltr.all)
app.get('/users/checkemail',userCltr.checkEmail)
app.post('/users/forgot-password',checkSchema(forgotEmailValidationSchema),userCltr.forgotPassword)
app.post('/users/reset-password',checkSchema(otpValidationSchema),userCltr.resetPassword)


//Customer
app.delete('/customer/:customerId',authenticateUser,authorizeUser(['customer']),customerCltr.delete)
app.get('/customer/all',customerCltr.allCustomers)
app.get('/customer',authenticateUser,authorizeUser(['customer']),customerCltr.singleCustomer)
app.post('/customer/profile', authenticateUser, authorizeUser(['customer']), upload.single('profilePic'),checkSchema(customerValidation),customerCltr.createProfile)
app.put('/customer/profile', authenticateUser, authorizeUser(['customer']),  upload.single('profilePic'),checkSchema(customerUpdateValidation),customerCltr.updateProfile)

app.get('/unverified-providers', authenticateUser, authorizeUser(['admin']), userCltr.unverified)
app.post('/verify-providers', authenticateUser, authorizeUser(['admin']), userCltr.verified)
app.post('/reject-providers', authenticateUser, authorizeUser(['admin']), userCltr.reject)
app.get('/verifiedproviders', authenticateUser, authorizeUser(['admin']), userCltr.verifiedProviders)

//ServiceProvider
app.post('/provider/profile', authenticateUser, authorizeUser(['service-provider']), upload.fields([{ name: 'aadhaarPhoto', maxCount: 1 },
{ name: 'profilePic', maxCount: 1 }]),  serviceProviderCltr.createProfile)
app.put('/provider/profile', authenticateUser, authorizeUser(['service-provider']),  upload.fields([ { name: 'aadhaarPhoto', maxCount: 1 },{ name: 'profilePic', maxCount: 1 }]),serviceProviderCltr.updateProfile)
app.get('/provider/all',serviceProviderCltr.allProviders)
app.get('/provider',authenticateUser,authorizeUser(['service-provider','admin']),serviceProviderCltr.singleProvider)
app.delete('/provider/:id',authenticateUser,authorizeUser(['service-provider']),serviceProviderCltr.delete)


//Service
app.post("/service/:serviceProviderId",authenticateUser,authorizeUser(['service-provider']),checkSchema(serviceValidation),serviceCltr.create)
app.put('/service/:serviceId',authenticateUser,authorizeUser(['service-provider']),checkSchema(serviceValidation),serviceCltr.update)
app.put('/service/:serviceId',authenticateUser,authorizeUser(['admin']),checkSchema(adminUpdate),serviceCltr.updateByAdmin)
app.get('/service/:serviceId',authenticateUser,authorizeUser(['service-provider','admin']),serviceCltr.single)
app.get('/service',authenticateUser,serviceCltr.all)
app.delete('/service/:serviceId',authenticateUser,authorizeUser(['service-provider']),serviceCltr.delete)



//Booking
app.post('/booking/provider/:serviceId',authenticateUser,authorizeUser(['customer']),checkSchema(bookingValidation),bookingCltr.create)
app.get('/booking',authenticateUser,authorizeUser(['admin','customer','service-provider']),bookingCltr.allBookings)
app.get('/booking/:bookingId',authenticateUser,authorizeUser(['admin','customer']),bookingCltr.single)
app.put('/booking/:bookingId',authenticateUser,authorizeUser(['customer']),checkSchema(bookingUpdateValidation),bookingCltr.update)
app.put('/booking/admin/:bookingId',authenticateUser,authorizeUser(['admin']),checkSchema(bookingUpdateByAdmin),bookingCltr.updateByAdmin)
app.put("/booking/provider/:serviceId/booking/:bookingId",authenticateUser,authorizeUser(['service-provider']),checkSchema(bookingAccepted),bookingCltr.accepted)
app.delete('/booking/:bookingId',authenticateUser,authorizeUser(['customer']),bookingCltr.delete)



//Review
app.post('/review/provider/:providerId',authenticateUser,authorizeUser(['customer']),checkSchema(reviewValidation),reviewcltr.create)
app.put('/review/provider/:providerId/review/:reviewId',authenticateUser,authorizeUser(['customer']),checkSchema(reviewValidation),reviewcltr.update)
app.get('/review/provider/:providerId/review/:reviewId',authenticateUser,authorizeUser(['customer','admin']),reviewcltr.single)
app.get('/review/provider/:providerId',authenticateUser,authorizeUser(['customer','admin']),reviewcltr.particularProvider)
app.get('/review', reviewcltr.all)
app.delete('/review/provider/:providerId/review/:reviewId',authenticateUser,authorizeUser(['customer',]),reviewcltr.delete)


app.listen(process.env.PORT,()=>{
    console.log('server running on 7777')
})

