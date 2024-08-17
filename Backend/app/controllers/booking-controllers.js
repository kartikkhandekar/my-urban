const Booking=require('../models/booking-model')
const Cart=require('../models/cart-model')
const {validationResult}=require('express-validator')
const {accpetedBookingMail,rejectedBookingMail} =require('../utils/mail')
const bookingCltr={}


bookingCltr.createBooking = async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }

    try {
        const { slot, address, date, description,lat,lng } = req.body
        const customerId = req.user.id

        const cart = await Cart.find({ customer: customerId }).populate('service').populate('service.serviceProvider')

        if (!cart.length) {
            throw new Error('Cart not found')
        }

        const servicesByName = cart.reduce((acc, cartItem) => {
            const serviceName = cartItem.service.servicename
            const serviceDoc = cartItem.service
            const serviceProviderId = serviceDoc.serviceProvider._id

            if (!acc[serviceName]) {
                acc[serviceName] = []
            }

            acc[serviceName].push({
                serviceId: serviceDoc._id,
                serviceProviderId,
                quantity: cartItem.quantity,
                service: {
                    _id: serviceDoc._id,
                    servicename: serviceDoc.servicename,
                    category: serviceDoc.category,
                    price: serviceDoc.price
                },
                serviceProvider: {
                    _id: serviceDoc.serviceProvider._id,
                    username: serviceDoc.serviceProvider.username,
                    email: serviceDoc.serviceProvider.email
                }
            });

            return acc
        }, {})

        const bookingPromises = Object.keys(servicesByName).map(async (serviceName) => {
            const services = servicesByName[serviceName]

            const totalAmount = services.reduce((sum, service) => {
                return sum + (service.service.price * service.quantity)
            }, 0)

            const newBooking = new Booking({
                customerId,
                services,
                date,
                description,
                slot,
                lat,
                lng,
                address,
                amount: totalAmount
            })

            return await newBooking.save()
        })

        const savedBookings = await Promise.all(bookingPromises)

        res.status(201).json(savedBookings)
    } catch (error) {
        console.error('Error creating booking:', error)
        res.status(400).json({ error: error.message })
    }
}




bookingCltr.getBookingById = async (req, res) => {
    try {
        const { id } = req.params;
        const booking = await Booking.findById(id)
        .populate('customerId',(['username','email']))
        .populate('services.serviceId',(['servicename','category','price']))
        .populate('services.serviceProviderId',(['username','email']))

        if (!booking) {
            return res.status(404).json({ error: 'Booking not found' })
        }

        res.status(200).json(booking)
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
};


// bookingCltr.getAllBookingsForCustomer = async (req, res) => {
//     try {
        
//         const search=req.query.search || ''
//         const sortBy=req.query.sortBy || 'amount'
//         const order=req.query.order || 1
//         const searchQuery={'services.serviceId.servicename':{$regex:search,$options:'i'}}
//         const sortQuery={}
//         sortQuery[sortBy]= order === 'asc' ? 1 : -1
//         console.log(searchQuery)
//         const bookings = await Booking.find()
//             //.sort(sortQuery)
//             .populate('customerId',(['username','email']))
//             .populate('services.serviceId',(['servicename','category','price']))
//             .populate('services.serviceProviderId',(['username','email']))

//            // console.log(bookings)

//         if(!bookings){
//             return res.status(404).json({errors:'No Record Found'})
//         }

//         res.status(200).json(bookings)
//     } catch (error) {
//         res.status(400).json({ error: error.message })
//     }
// }


bookingCltr.getAllBookingsForCustomer = async (req, res) => {
    try {
        const search = req.query.search || '';
        const sortBy = req.query.sortBy || 'amount';
        const order = req.query.order || 'asc';
        const page = parseInt(req.query.page, 10) || 1;
        const limit = parseInt(req.query.limit, 10) || 10;

        const sortOrder = order === 'asc' ? 1 : -1;
        const sortQuery = {};
        sortQuery[sortBy] = sortOrder;

        const bookings = await Booking.aggregate([
            {
                $lookup: {
                    from: 'services',
                    localField: 'services.serviceId',
                    foreignField: '_id',
                    as: 'serviceDetails'
                }
            },
            {
                $unwind: '$serviceDetails'
            },
            {
                $match: {
                    'serviceDetails.servicename': { $regex: search, $options: 'i' }
                }
            },
            {
                $sort: sortQuery
            },
            {
                $lookup: {
                    from: 'users',
                    localField: 'customerId',
                    foreignField: '_id',
                    as: 'customerDetails'
                }
            },
            {
                $unwind: '$customerDetails'
            },
            {
                $project: {
                    _id: 1,
                    customerId: '$customerDetails.username',
                    services: {
                        serviceId: '$serviceDetails._id',
                        serviceName: '$serviceDetails.servicename',
                        category: '$serviceDetails.category',
                        price: '$serviceDetails.price'
                    },
                    date: 1,
                    slot: 1,
                    status: 1,
                    address: 1,
                    paymentStatus: 1,
                    amount: 1,
                    description: 1,
                    isAccepted: 1,
                    isReview: 1,
                    createdAt: 1,
                    updatedAt: 1
                }
            },
            {
                $facet: {
                    metadata: [
                        { $count: "totalCount" }
                    ],
                    data: [
                        { $skip: (page - 1) * limit },
                        { $limit: limit }
                    ]
                }
            },
            {
                $unwind: '$metadata'
            }
        ]);

        const bookingsData = bookings[0] ? bookings[0].data : [];
        const totalCount = bookings[0] ? bookings[0].metadata.totalCount : 0;

        res.status(200).json({
            bookings: bookingsData,
            totalCount,
            totalPages: Math.ceil(totalCount / limit)
        });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};



bookingCltr.updateByAdmin=async (req,res)=>{
    const errors=validationResult(req)
    if(!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()})
    }
    try{
       const body=req.body
       const id=req.params.bookingId
       const response=await Booking.findByIdAndUpdate(id,body,{new:true})
       res.status(200).json(response)
    }catch(err){
        res.status(500).json({error:'Somthing went wrong'})

    }
}

bookingCltr.updateBookingStatus = async (req, res) => {
    const errors=validationResult(req)
    if(!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()})
    }
    try {
        const { bookingId } = req.params;
        const { isAccepted } = req.body;

        const booking = await Booking.findById(bookingId)
                  .populate('customerId',(['username','email']))
                  .populate('services.serviceId',(['servicename','category','price']))
                  .populate('services.serviceProviderId',(['username','email']))
        if (!booking) {
            return res.status(404).json({ message: 'Booking not found' })
        }
         
        console.log(booking)
        console.log(req.user.id.toString(),booking.services[0].serviceProviderId._id.toString())
        
        if (req.user.id.toString() !== booking.services[0].serviceProviderId._id.toString()) {
            return res.status(403).json({ message: 'Access denied' })
        }
       booking.isAccepted = isAccepted
        if(isAccepted){
            await accpetedBookingMail(booking.customerId.email,booking)
        }else{
            await rejectedBookingMail(booking.customerId.email,booking)
        }
        await booking.save();
        res.status(200).json(booking)
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' })
    }
};

bookingCltr.delete=async(req,res)=>{
    const bookingId=req.params.bookingId
    try{
         const response=await Booking.findOneAndDelete({customerId:req.user.id,_id:bookingId},{new:true})
         if(response){
           return  res.status(200).json(response)
         }
            res.status(400).json({error:'record not found'})
    }catch(err){
        res.status(500).json({error:'somthing wemt wrong'})
    }
}



bookingCltr.AccecptedBooking=async(req,res)=>{
    try{
        const booking=await Booking.find().populate('customerId',(['username','email']))
        const acceptedBookings=booking.filter(ele=>{
            return ele.isAccepted === true
        })
        if(!acceptedBookings){
           return res.status(404).json({errors:'No Record Found'})
        }
        res.status(200).json(acceptedBookings)
    }catch(err){
         res.status(500).json({error:'somthing wemt wrong'})
    }
}

bookingCltr.notAccecptedBooking=async(req,res)=>{
    try{
        const booking=await Booking.find().populate('customerId',(['username','email']))
        const acceptedBookings=booking.filter(ele=>{
            return ele.isAccepted === false
        })
        if(!acceptedBookings){
           return res.status(404).json({errors:'No Record Found'})
        }
        res.status(200).json(acceptedBookings)
    }catch(err){
         res.status(500).json({error:'somthing wemt wrong'})
    }
}


bookingCltr.paticularCustomerBookings=async(req,res)=>{
    try{
        const booking= await Booking.find({customerId:req.user.id}).populate('customerId',(['username','email']))
        .populate('services.serviceId',(['servicename','category','price']))
        .populate('services.serviceProviderId',(['username','email']))
        if(!booking){
            return res.status(404).json({errors:'No Bookings'})
        }

        res.status(200).json(booking)

    }catch(err){
        res.status(500).json({error:'somthing wemt wrong'})

    }
}


module.exports=bookingCltr