const Payment=require('../models/payment-model')
const Booking=require('../models/booking-model')
const stripe=require('stripe')(process.env.STRIPE_PASS_KEY)
const paymentsCntrl={}

paymentsCntrl.pay = async(req,res)=>{
    console.log(req.user.id,'id')

    const {bookingId}=req.params
    const body = req.body
    try{
          
        //create a customer
        const customer = await stripe.customers.create({
            name: "Testing",
            address: {
                line1: 'India',
                postal_code: '403507',
                city: 'mapusa',
                state: 'Goa',
                country: 'US',
            },
        })
        
        //create a session object
        const session = await stripe.checkout.sessions.create({
            payment_method_types:["card"],
            line_items:[{
                price_data:{
                    currency:'inr',
                    product_data:{
                        name:'booking'
                    },
                    unit_amount:body.amount * 100
                },
                quantity: 1
            }],
            mode:"payment",
            success_url:"http://localhost:3000/success",
            cancel_url: 'http://localhost:3000/cancel',
            customer : customer.id
        })
        
        //create a payment
        const booking=await Booking.findById(bookingId)
        if(booking.isAccepted === false)
        {
            return res.status(400).json({error:'Still Provider Has Not Accepted Your Service'})
        }

        const response=await Payment.findOne({customerId:req.user.id,bookingId:bookingId})
        console.log(response)
        if(response){
            if(response.paymentStatus === 'Successful'){
                return res.status(400).json({error:'already payment is done'})
           }
        }
        
       
        const payment = new Payment(body)
        payment.bookingId=bookingId
        payment.transactionId = session.id//on click yo pay strip will create one id
        payment.amount = Number(body.amount)
        payment.paymentType = "card"
        payment.customerId=req.user.id
        await payment.save()
        res.json({id:session.id,url: session.url,payment})
    }catch(err){
        console.log(err)
        res.status(500).json({error:'Internal Server Error'})
    }
}  

paymentsCntrl.successUpdate = async(req ,res)=>{
    const id = req.params.id
    try{
        const payment = await Payment.findOneAndUpdate({transactionId:id} , {$set:{paymentStatus:'Successful'} } , {new:true})

        if (!payment) {
            return res.status(404).json({ error: 'Payment not found' });
        }

        await Booking.findByIdAndUpdate(
            payment.bookingId,
            { $set: { paymentStatus: 'Successful', payment: payment._id } },
            { new: true }
        );
        res.json(payment)
    } catch(err){
        console.log(err)
        res.status(500).json({error:'Internal Server Error'})
    }
}


paymentsCntrl.failerUpdate=async(req,res)=>{
    const id=req.params.id
    try{
        const payment=await Payment.findOneAndUpdate({transactionId:id},{$set:{paymentStatus:"failed"}},{new:true})
        res.status(200).json(payment)
    }catch(err){
        res.status(500).json({error:"internal server errror"})
    }
}


paymentsCntrl.list=async(req,res)=>{
    try{

        
        const sortBy=req.query.sortBy ||'amount'
        const order=req.query.order || 1
        const sortQuery={}
        sortQuery[sortBy]= order === 'asc' ? 1 : -1
        const page = parseInt(req.query.page, 5) || 1 
        const limit = parseInt(req.query.limit, 5) || 5

        const skip = (page - 1) * limit
     const response=await Payment.find()
                  .sort(sortQuery)
                  .skip(skip)
                  .limit(limit)
                  .populate('customerId',(['username','email']))
                  .populate('bookingId',(['slot','price','date','isAccepted']))
        if(!response){
        return res.status(404).json({errors:'No record not found'})
        }
        const totalCount = await Service.countDocuments()

     res.json({
        response,
         totalCount,
        totalPages: Math.ceil(totalCount / limit),
        currentPage: page,
        pageSize: limit
    })
    }catch(err){
        console.log(err)
        res.status(501).json({error:"internal server error"})
    }
}


module.exports=paymentsCntrl