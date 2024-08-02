const { response } = require('express');
const Booking=require('../models/booking-model')
const Service =require('../models/service-model')
const Cart=require('../models/cart-model')
const {validationResult}=require('express-validator')
const bookingCltr={}



bookingCltr.createBooking = async (req, res) => {
    try {
        const { slot, address, date, description } = req.body;
        const customerId = req.user.id;

        // Fetch the cart for the customer and populate the services
        const cart = await Cart.findOne({ customer: customerId }).populate('services.service', ['servicename', 'price', 'duration']);
        
        if (!cart) {
            throw new Error('Cart not found');
        }

        // Extract services from the cart and validate each service
        const serviceData = await Promise.all(cart.services.map(async (cartService) => {
            const serviceDoc = await Service.findById(cartService.service._id);
            if (!serviceDoc) {
                throw new Error(`Service with id ${cartService.service._id} not found`);
            }
            return {
                serviceId: cartService.service._id,
                serviceProviderId: serviceDoc.serviceProvider
            };
        }));

        // Create a new booking
        const newBooking = new Booking({
            customerId,
            services: serviceData,
            date,
            description,
            slot,
            address
        });

        // Save the booking and return the response
        const savedBooking = await newBooking.save();
        res.status(201).json(savedBooking);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};






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
        const booking = await Booking.findById(bookingId).populate('serviceProviderId',(['serviceProvider']))
        if (!booking) {
            return res.status(404).json({ message: 'Booking not found' });
        }
         
        // Only the service provider can update isAccepted
        
        if (req.user.id.toString() !== booking.serviceProviderId.serviceProvider.toString()) {
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
         res.json(500).json({error:'somthing wemt wrong'})
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
         res.json(500).json({error:'somthing wemt wrong'})
    }
}
module.exports=bookingCltr