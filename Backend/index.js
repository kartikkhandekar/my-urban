require('dotenv').config()
const configdb=require('./config/db')
const userCltr=require('./app/controllers/user-controller')
const serviceProviderCltr=require('./app/controllers/serviceProvider-controller')
const customerCltr=require('./app/controllers/customer-controller')
const bookingCltr=require('./app/controllers/booking-controllers')
const reviewcltr=require('./app/controllers/review-contollers')
const authenticateUser=require('./app/middlewares/authentication')
const authorizeUser=require('./app/middlewares/authorization')
const {userRegisterValidationSchema,userUpdateValidation}=require('./app/validations/user-register')
const userLoginValidationSchema=require('./app/validations/user-login')
const {otpValidationSchema,forgotEmailValidationSchema}=require('./app/validations/forgetPassword')
const {serviceProviderValidation,serviceProviderUpdateValidation,adminUpdate}=require('./app/validations/serviceProvider-validations')
const {customerValidation,customerUpdateValidation}=require('./app/validations/customer-validation')
const {bookingValidation,bookingUpdateValidation,bookingUpdateByAdmin,bookingAccepted}=require('./app/validations/booking-validations')
const reviewValidation=require('./app/validations/review-validatons')
const express=require('express')
const cors=require('cors')
const {checkSchema}=require('express-validator')
const app=express()
app.use(express.json())
app.use(cors())
configdb()

//User
app.post('/users/register',checkSchema(userRegisterValidationSchema),userCltr.register)
app.post('/users/login',checkSchema(userLoginValidationSchema),userCltr.login)
app.put('/users/update',authenticateUser,checkSchema(userUpdateValidation),userCltr.update)
app.get('/users/account',authenticateUser,userCltr.account)

app.post('/users/forgot-password',checkSchema(forgotEmailValidationSchema),userCltr.forgotPassword)
app.post('/users/reset-password',checkSchema(otpValidationSchema),userCltr.resetPassword)

//Customer
app.post('/customer',authenticateUser,authorizeUser(['customer']),checkSchema(customerValidation),customerCltr.create)
app.put('/customer/:customerId',authenticateUser,authorizeUser(['customer']),checkSchema(customerUpdateValidation),customerCltr.update)
app.delete('/customer/:customerId',authenticateUser,authorizeUser(['customer']),customerCltr.delete)
app.get('/customer/all',customerCltr.allCustomers)
app.get('/customer/:customerId',authenticateUser,authorizeUser(['admin','customer']),customerCltr.singleCustomer)

//ServiceProvider
app.post('/provider',authenticateUser,authorizeUser(['service-provider']),checkSchema(serviceProviderValidation),serviceProviderCltr.create)
app.put('/provider/:serviceId',authenticateUser,authorizeUser(["service-provider"]),checkSchema(serviceProviderUpdateValidation),serviceProviderCltr.update)
app.put('/provider/admin/:id',authenticateUser,authorizeUser(['admin']),checkSchema(adminUpdate),serviceProviderCltr.updateByAdmin)
app.get('/provider/all',serviceProviderCltr.allProviders)
app.get('/provider/:id',authenticateUser,authorizeUser(['service-provider','admin']),serviceProviderCltr.singleProvider)
app.delete('/provider/:id',authenticateUser,authorizeUser(['service-provider']),serviceProviderCltr.delete)

//Booking
app.post('/booking/provider/:providerId',authenticateUser,authorizeUser(['customer']),checkSchema(bookingValidation),bookingCltr.create)
app.get('/booking',authenticateUser,authorizeUser(['admin','customer','service-provider']),bookingCltr.allBookings)
app.get('/booking/:bookingId',authenticateUser,authorizeUser(['admin','customer']),bookingCltr.single)
app.put('/booking/:bookingId',authenticateUser,authorizeUser(['customer']),checkSchema(bookingUpdateValidation),bookingCltr.update)
app.put('/booking/admin/:bookingId',authenticateUser,authorizeUser(['admin']),checkSchema(bookingUpdateByAdmin),bookingCltr.updateByAdmin)
app.put("/booking/provider/:providerId/booking/:bookingId",authenticateUser,authorizeUser(['service-provider']),checkSchema(bookingAccepted),bookingCltr.accepted)
app.delete('/booking/:bookingId',authenticateUser,authorizeUser(['customer']),bookingCltr.delete)

//Review
app.post('/review/provider/:providerId',authenticateUser,authorizeUser(['customer']),checkSchema(reviewValidation),reviewcltr.create)
app.put('/review/provider/:providerId/review/:reviewId',authenticateUser,authorizeUser(['customer']),checkSchema(reviewValidation),reviewcltr.update)
app.get('/review/provider/:providerId/review/:reviewId',authenticateUser,authorizeUser(['customer','admin']),reviewcltr.single)
app.get('/review/provider/:providerId',authenticateUser,authorizeUser(['customer','admin']),reviewcltr.particularProvider)
app.get('/review',reviewcltr.all)
app.delete('/review/provider/:providerId/review/:reviewId',authenticateUser,authorizeUser(['customer',]),reviewcltr.delete)



app.listen(process.env.PORT,()=>{
    console.log('server running on 7777')
})

