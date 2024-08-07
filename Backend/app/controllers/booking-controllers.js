const Booking=require('../models/booking-model')
const Cart=require('../models/cart-model')
const {validationResult}=require('express-validator')
const bookingCltr={}



bookingCltr.createBooking = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const { slot, address, date, description } = req.body;
        const customerId = req.user.id;

        // Fetch the cart for the customer and populate the services
        const cart = await Cart.find({ customer: customerId }).populate('service').populate('service.serviceProvider');

        if (!cart.length) {
            throw new Error('Cart not found');
        }

        // Group services by their service provider and calculate the total amount for each provider
        const servicesByProvider = cart.reduce((acc, cartItem) => {
            const serviceDoc = cartItem.service;
            const serviceProviderId = serviceDoc.serviceProvider._id;
            const servicePrice = serviceDoc.price * cartItem.quantity;

            if (!serviceProviderId) {
                throw new Error(`Service provider not found for service with id ${serviceDoc._id}`);
            }

            if (!acc[serviceProviderId]) {
                acc[serviceProviderId] = { services: {}, totalAmount: 0 };
            }

            if (!acc[serviceProviderId].services[serviceDoc._id]) {
                acc[serviceProviderId].services[serviceDoc._id] = {
                    serviceId: serviceDoc._id,
                    serviceProviderId,
                    quantity: 0,
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
                };
            }

            acc[serviceProviderId].services[serviceDoc._id].quantity += cartItem.quantity;
            acc[serviceProviderId].totalAmount += servicePrice;

            return acc;
        }, {});

        // Create bookings for each service provider
        const bookingPromises = Object.keys(servicesByProvider).map(async (providerId) => {
            const { services, totalAmount } = servicesByProvider[providerId];

            // Create a new booking
            const newBooking = new Booking({
                customerId,
                services: Object.values(services),
                date,
                description,
                slot,
                address,
                amount: totalAmount
            });

            // Save the booking
            return await newBooking.save();
        });

        // Wait for all bookings to be created
        const savedBookings = await Promise.all(bookingPromises);

        // Return the created bookings
        res.status(201).json(savedBookings);
    } catch (error) {
        console.error('Error creating booking:', error);
        res.status(400).json({ error: error.message });
    }
};

module.exports = bookingCltr;




// bookingCltr.createBooking = async (req, res) => {
//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//         return res.status(400).json({ errors: errors.array() });
//     }

//     try {
//         const { slot, address, date, description } = req.body;
//         const customerId = req.user.id;

//         // Fetch the cart for the customer and populate the services
//         const cart = await Cart.find({ customer: customerId }).populate('service',).populate('service.serviceProvider');

//         if (!cart.length) {
//             throw new Error('Cart not found');
//         }

//         // Group services by their service provider and calculate the total amount for each provider
//         const servicesByProvider = cart.reduce((acc, cartItem) => {
//             const serviceDoc = cartItem.service;
//             const serviceProviderId = serviceDoc.serviceProvider._id;
//             const servicePrice = serviceDoc.price * cartItem.quantity;
            
            
//             if (!serviceProviderId) {
//                 throw new Error(`Service provider not found for service with id ${serviceDoc._id}`);
//             }

//             if (!acc[serviceProviderId]) {
//                 acc[serviceProviderId] = { services: [], totalAmount: 0 };
//             }

//             acc[serviceProviderId].services.push({
//                 serviceId: serviceDoc._id,
//                 serviceProviderId,
//                 quantity: cartItem.quantity,
//                 service: {
//                     _id: serviceDoc._id,
//                     servicename: serviceDoc.servicename,
//                     category: serviceDoc.category,
//                     price: serviceDoc.price
//                 },
//                 serviceProvider: {
//                     _id: serviceDoc.serviceProvider._id,
//                     username: serviceDoc.serviceProvider.username,
//                     email: serviceDoc.serviceProvider.email
//                 }
//             });

//             acc[serviceProviderId].totalAmount += servicePrice;

//             return acc;
//         }, {});

//         // Create bookings for each service provider
//         const bookingPromises = Object.keys(servicesByProvider).map(async (providerId) => {
//             const { services, totalAmount } = servicesByProvider[providerId];

//             // Create a new booking
//             const newBooking = new Booking({
//                 customerId,
//                 services,
//                 date,
//                 description,
//                 slot,
//                 address,
//                 amount: totalAmount
//             });

//             // Save the booking
//             return await newBooking.save();
//         });

//         // Wait for all bookings to be created
//         const savedBookings = await Promise.all(bookingPromises);

//         // Return the created bookings
//         res.status(201).json(savedBookings);
//     } catch (error) {
//         console.error('Error creating booking:', error);
//         res.status(400).json({ error: error.message });
//     }
// };



bookingCltr.getBookingById = async (req, res) => {
    try {
        const { id } = req.params;
        const booking = await Booking.findById(id)
        .populate('customerId',(['username','email']))
        .populate('services.serviceId',(['servicename','category','price']))
        .populate('services.serviceProviderId',(['username','email']));

        if (!booking) {
            return res.status(404).json({ error: 'Booking not found' });
        }

        res.status(200).json(booking);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};


bookingCltr.getAllBookingsForCustomer = async (req, res) => {
    try {
        
        const bookings = await Booking.find()
            .populate('customerId',(['username','email']))
            .populate('services.serviceId',(['servicename','category','price']))
            .populate('services.serviceProviderId',(['username','email']));

        

        res.status(200).json(bookings);
    } catch (error) {
        res.status(400).json({ error: error.message });
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

        // Ensure the request is coming from a service provider
        const booking = await Booking.findById(bookingId)
        if (!booking) {
            return res.status(404).json({ message: 'Booking not found' });
        }
         
        // Only the service provider can update isAccepted
        console.log(req.user.id.toString(),booking.services[0].serviceProviderId.toString())
        
        if (req.user.id.toString() !== booking.services[0].serviceProviderId.toString()) {
            return res.status(403).json({ message: 'Access denied' });
        }

        booking.isAccepted = isAccepted;
        await booking.save();
        res.status(200).json(booking);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
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
        .populate('services.serviceProviderId',(['username','email']));
        if(!booking){
            return res.status(404).json({errors:'No Bookings'})
        }

        res.status(200).json(booking)

    }catch(err){
        res.status(500).json({error:'somthing wemt wrong'})

    }
}


module.exports=bookingCltr