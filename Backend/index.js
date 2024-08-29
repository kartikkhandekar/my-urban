require('dotenv').config()
const configdb=require('./config/db')
const userCltr=require('./app/controllers/user-controller')
const serviceProviderCltr=require('./app/controllers/serviceProvider-controller')
const customerCltr=require('./app/controllers/customer-controller')
const bookingCltr=require('./app/controllers/booking-controllers')
const reviewcltr=require('./app/controllers/review-contollers')
const serviceCltr=require("./app/controllers/service-controller")
const cartCtrl=require('./app/controllers/cart-controller')
const paymentsCtrl=require('./app/controllers/payment-controller')
const authenticateUser=require('./app/middlewares/authentication')
const authorizeUser=require('./app/middlewares/authorization')
const {userRegisterValidationSchema,userUpdateValidation}=require('./app/validations/user-register')
const userLoginValidationSchema=require('./app/validations/user-login')
const {otpValidationSchema,forgotEmailValidationSchema}=require('./app/validations/forgetPassword')
const {serviceProviderValidation,serviceProviderUpdateValidation}=require('./app/validations/serviceProvider-validations')
const {customerValidation,customerUpdateStatusValidation,customerUpdateValidation}=require('./app/validations/customer-validation')
const {bookingValidation,bookingUpdateValidation,bookingUpdateByAdmin,bookingAccepted}=require('./app/validations/booking-validations')
const reviewValidation=require('./app/validations/review-validatons')
const {serviceValidation,serviceUpdateValidation,adminUpdate}=require("./app/validations/service-validation")
const upload=require('./app/middlewares/multer')
const express=require('express')
const cors=require('cors')
const path=require('path')
const {checkSchema}=require('express-validator')
const app=express()
const checkPendingBookings=require('./app/utils/cron')
checkPendingBookings()
app.use(express.json())
configdb()




const corsOptions = {
  origin: 'http://localhost:3000', 
  credentials: true, 
};

app.use(cors(corsOptions));

app.use(express.urlencoded({ extended: false }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads'), {
    
    setHeaders: (res, path, stat) => {
      res.set('Access-Control-Allow-Origin', 'http://localhost:3000');
      res.set('Access-Control-Allow-Credentials', 'true');
    },
  }));


  

//User
app.post('/users/register',checkSchema(userRegisterValidationSchema),userCltr.register)
app.post('/users/login',checkSchema(userLoginValidationSchema),userCltr.login)
app.put('/users/update',authenticateUser,checkSchema(userUpdateValidation),userCltr.update)
app.get('/users/account',authenticateUser,userCltr.account)
app.get('/users/all',userCltr.all)
app.get('/users/checkemail',userCltr.checkEmail)
app.post('/users/forgot-password',checkSchema(forgotEmailValidationSchema),userCltr.forgotPassword)
app.post('/users/reset-password',checkSchema(otpValidationSchema),userCltr.resetPassword)

app.get('/unverified-providers', authenticateUser, authorizeUser(['admin']), userCltr.unverified)
app.post('/verify-providers', authenticateUser, authorizeUser(['admin']), userCltr.verified)
app.post('/reject-providers', authenticateUser, authorizeUser(['admin']), userCltr.reject)
app.get('/verifiedproviders', authenticateUser, authorizeUser(['admin']), userCltr.verifiedProviders)

//Customer
app.delete('/customer/:customerId',authenticateUser,authorizeUser(['customer']),customerCltr.delete)
app.get('/customer/all',customerCltr.allCustomers)
app.get('/customer',authenticateUser,authorizeUser(['customer']),customerCltr.singleCustomer)
app.post('/customer/profile', authenticateUser, authorizeUser(['customer']), upload.single('profilePic'),checkSchema(customerValidation),customerCltr.createProfile)
app.put('/customer/profile', authenticateUser, authorizeUser(['customer']),  upload.single('profilePic'),checkSchema(customerUpdateValidation),customerCltr.updateProfile)
app.put('/update-booking-status/:bookingId',authenticateUser,authorizeUser(['customer']),checkSchema(customerUpdateStatusValidation),customerCltr.updateStatus)


//ServiceProvider
app.post('/provider/profile', authenticateUser, authorizeUser(['service-provider']), upload.fields([{ name: 'aadhaarPhoto', maxCount: 1 },
{ name: 'profilePic', maxCount: 1 }]),serviceProviderCltr.createProfile)
app.put('/provider/profile', authenticateUser, authorizeUser(['service-provider']),  upload.fields([ { name: 'aadhaarPhoto', maxCount: 1 },{ name: 'profilePic', maxCount: 1 }]),checkSchema(serviceProviderUpdateValidation),serviceProviderCltr.updateProfile)
app.get('/provider/all',serviceProviderCltr.allProviders)
app.get('/provider',authenticateUser,authorizeUser(['service-provider','admin']),serviceProviderCltr.singleProvider)
app.delete('/provider/:id',authenticateUser,authorizeUser(['service-provider']),serviceProviderCltr.delete)
app.get('/mybookings',authenticateUser,authorizeUser(['service-provider']),serviceProviderCltr.myBookings)

//Service
app.post("/service",authenticateUser,authorizeUser(['service-provider']),checkSchema(serviceValidation),serviceCltr.create)
app.get('/service/all',authenticateUser,serviceCltr.all)
app.get('/service',authenticateUser,authorizeUser(['service-provider']),serviceCltr.particular)
app.put('/service/:serviceId',authenticateUser,authorizeUser(['service-provider']),checkSchema(serviceUpdateValidation),serviceCltr.update)
app.get('/service/:serviceId',authenticateUser,serviceCltr.single)
app.delete('/service/:serviceId',authenticateUser,authorizeUser(['service-provider']),serviceCltr.delete)
app.get('/service/category/:category',authenticateUser,serviceCltr.category)

//Booking
app.post('/booking',authenticateUser,authorizeUser(['customer']),checkSchema(bookingValidation),bookingCltr.createBooking)
app.get('/booking',authenticateUser,bookingCltr.getAllBookingsForCustomer)
app.get('/booking/:bookingId',authenticateUser,authorizeUser(['admin','customer']),bookingCltr.getBookingById)
app.put('/booking/admin/:bookingId',authenticateUser,authorizeUser(['admin']),checkSchema(bookingUpdateByAdmin),bookingCltr.updateByAdmin)
app.put("/booking/provider/:bookingId",authenticateUser,authorizeUser(['service-provider']),checkSchema(bookingAccepted),bookingCltr.updateBookingStatus)
app.delete('/booking/:bookingId',authenticateUser,authorizeUser(['customer']),bookingCltr.delete)
app.get('/accepted',authenticateUser,authorizeUser(['service-provider']),bookingCltr.AccecptedBooking)
app.get('/notaccepted',authenticateUser,authorizeUser(['service-provider']),bookingCltr.notAccecptedBooking)
app.get("/customer-bookings",authenticateUser,authorizeUser(['customer']),bookingCltr.paticularCustomerBookings)


//Review
app.post('/review/:bookingId',authenticateUser,authorizeUser(['customer']),checkSchema(reviewValidation),reviewcltr.create)
// app.put('/review/provider/:providerId/review/:reviewId',authenticateUser,authorizeUser(['customer']),checkSchema(reviewValidation),reviewcltr.update)
app.get('/review/:serviceId',authenticateUser,reviewcltr.particular)
app.get('/review',authenticateUser, reviewcltr.all)
app.delete('/review/:id',authenticateUser,authorizeUser(['customer',]),reviewcltr.delete)


//Cart
app.post ('/cart/:serviceId',authenticateUser,authorizeUser(['customer']),cartCtrl.create)
app.delete('/cart/:cartId',authenticateUser,authorizeUser(['customer']),cartCtrl.removeItem)
app.delete('/cart/service/:serviceId',authenticateUser,authorizeUser(['customer']),cartCtrl.removeService)
app.delete('/cart',authenticateUser,authorizeUser(['customer']),cartCtrl.clearCart)
app.get('/all',authenticateUser,authorizeUser(['customer']),cartCtrl.allItems)


//Payment
app.post('/payment/:bookingId',authenticateUser,paymentsCtrl.pay)
app.put('/payment-success/:id',paymentsCtrl.successUpdate)
app.put('/payment-cancel/:id',paymentsCtrl.failerUpdate)
app.get('/payment',authenticateUser,paymentsCtrl.list)

app.listen(process.env.PORT,()=>{
    console.log('server running on 7777')
})

