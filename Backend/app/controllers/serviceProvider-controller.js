const ServiceProvider=require('../models/serviceProvider-model')
const Booking=require('../models/booking-model')
const {validationResult}=require('express-validator')

const serviceProviderCltr={}



serviceProviderCltr.createProfile = async (req, res) => {
    

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        console.log('Validation errors:', JSON.stringify(errors.array(), null, 2));
        return res.status(400).json({ errors: errors.array() });
    }
    const body = req.body;

    try {
        const provider = new ServiceProvider(body);
        provider.userId = req.user.id;

        if (req.files) {
            if (req.files['aadhaarPhoto']) {
                provider.aadhaarPhoto = req.files['aadhaarPhoto'][0].path;
                //console.log('Aadhaar Photo URL:', provider.aadhaarPhoto);
            }
            if (req.files['profilePic']) {
                provider.profilePic = req.files['profilePic'][0].path;
               // console.log('Profile Pic URL:', provider.profilePic);
            }
        }

       // console.log('Creating customer with:', JSON.stringify(provider, null, 2));

        await provider.save();
        res.json(provider);
    } catch (err) {
        console.error('Error saving customer:', err.message);
        res.status(500).json({ error: 'Something went wrong' });
    }
};

// //get patientProfile
serviceProviderCltr.getProfile=async(req,res)=>{
    try{
        const provider=await ServiceProvider.findOne({userId:req.user.id})
            return res.json(provider)
    }catch(err){
        console.log(err)
        return res.status(500).json("Something went wrong")
    }
}

// Update customer profile
serviceProviderCltr.updateProfile = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const body = req.body;
    const userId = req.user.id;

    try {
        // Find the customer by userId
        let provider = await ServiceProvider.findOne({ userId });

        if (!provider) {
            return res.status(400).json({ msg: 'No Provider found' });
        }

        // Update customer fields
        provider.serviceProviderName = body.serviceProviderName;
        provider.address = body.address;
        provider.phone = body.phone;

        // Handle file updates
        if (req.files) {
            if (req.files.aadhaarPhoto) {
                console.log('Updating Aadhaar Photo:', req.files.aadhaarPhoto[0].path);
                provider.aadhaarPhoto = req.files.aadhaarPhoto[0].path;
            }


            if (req.files.profilePic) {
                console.log('Updating Profile Pic:', req.files.profilePic[0].path);
                provider.profilePic = req.files.profilePic[0].path;
            }
        }

        // Save the updated customer document
        await provider.save();
        res.json(provider); // Return the updated customer document
    } catch (err) {
        console.error('Error updating Provider:', err.message);
        res.status(500).json({ msg: 'Server error' });
    }
};






serviceProviderCltr.allProviders=async (req,res)=>{
   try{
     const response =await ServiceProvider.find().populate('userId',['email'])
     res.status(400).json(response)
   }catch(err){
    
    res.status(500).json({ errors: 'something went wrong'})

   }
}

serviceProviderCltr.singleProvider=async (req,res)=>{

    try{
       
        const response =await ServiceProvider.findOne({userId:req.user.id}).populate('userId',['email'])
        res.status(200).json(response)

    }catch(err){
        res.status(500).json({ errors: 'something went wrong'})
    }
}

serviceProviderCltr.delete=async (req,res)=>{
    try{
        const providerId=req.params.id
        const response=await ServiceProvider.findOneAndDelete({userId:req.user.id,_id:providerId})
        if(!response){
           return  res.status(401).json({error:'record not found'})
        }
            res.status(200).json(response)

    }catch(err){
        res.status(500).json({ errors: 'something went wrong'})
    }
}



serviceProviderCltr.myBookings = async (req, res) => {
    try {
        const bookings = await Booking.find({ 'services.serviceProviderId': req.user.id })
        .populate('customerId',(['username','email']))
        .populate('services.serviceId',(['servicename','category','price']))
        .populate('services.serviceProviderId',(['username','email']))



        if (!bookings || bookings.length === 0) {
            return res.status(404).json({ errors: 'No Booking' })
        }
        res.status(200).json(bookings);
    } catch (err) {
        res.status(500).json({ error: 'Something went wrong' })
    }
}


module.exports = serviceProviderCltr
