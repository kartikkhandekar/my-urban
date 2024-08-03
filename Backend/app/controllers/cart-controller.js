const Service=require('../models/service-model')
const Customer=require('../models/customer-model')
const Cart=require('../models/cart-model')

const cartCtrl={}


cartCtrl.create = async (req, res) => {
  const customerId = req.user.id;
  const serviceId = req.params.serviceId;
  const { quantity } = req.body;

  if (quantity !== 1) {
    return res.status(400).json({ errors: 'Quantity must be exactly 1' });
  }

  try {
    // Check if the service exists
    const serviceDetails = await Service.findById(serviceId);
    if (!serviceDetails) {
      return res.status(404).json({ errors: 'Service not found' });
    }

    // Check if the service has a valid price
    if (!serviceDetails.price || typeof serviceDetails.price !== 'number') {
      return res.status(400).json({ errors: 'Service price is invalid' });
    }

    let cart = await Cart.findOne({ customer: customerId });

    if (!cart) {
      // If no cart exists, create a new one
      const newCart = new Cart({
        customer: customerId,
        services: [{ service: serviceId, quantity }],
        totalPrice: serviceDetails.price * quantity,
      });

      const response = await newCart.save();
      return res.status(200).json(response);
    } else {
      // If cart exists, update it
      const serviceIndex = cart.services.findIndex(item => item.service.toString() === serviceId);

      if (serviceIndex > -1) {
        // If service already exists in the cart, update the quantity
        cart.services[serviceIndex].quantity += quantity;
      } else {
        // If service does not exist in the cart, add it
        cart.services.push({ service: serviceId, quantity });
      }

      // Calculate the total price based on updated services and their quantities
      let totalPrice = 0;
      for (const item of cart.services) {
        const service = await Service.findById(item.service);
        if (!service.price || typeof service.price !== 'number') {
          return res.status(400).json({ errors: `Service price is invalid for serviceId: ${item.service}` });
        }
        totalPrice += service.price * item.quantity;
      }
      cart.totalPrice = totalPrice;

      const response = await cart.save();
      return res.status(200).json(response);
    }
  } catch (error) {
    console.error('Error adding service to cart:', error); // Log the error for debugging
    return res.status(500).json({ errors: 'Error adding service to cart' });
  }
};


cartCtrl.removeItem = async (req, res) => {
  const { serviceId } = req.params;
  const customerId = req.user.id;
 
  try {
    const cart = await Cart.findOne({ customer: customerId });

    if (!cart) {
      return res.status(404).json({ errors: 'Cart not found' });
    }

    const serviceIndex = cart.services.findIndex(item => item.service && item.service.toString() === serviceId);

    if (serviceIndex === -1) {
      return res.status(404).json({ errors: 'Service not found in cart' });
    }

    cart.services.splice(serviceIndex, 1);

    const calculateTotalPrice = async (services) => {
      let total = 0;
      for (const item of services) {
        if (!item.service) continue; // Skip if service is null
        const service = await Service.findById(item.service);
        if (service) {
          total += service.price * item.quantity;
        } else {
          console.log(`Service not found for id: ${item.service}`);
        }
      }
      return total;
    };

    // Calculate the new total price
    cart.totalPrice = await calculateTotalPrice(cart.services);

    const response = await cart.save();
    res.status(200).json(response);
  } catch (error) {
    console.error(error); // Log the error for debugging
    res.status(500).json({ errors: 'Error removing service from cart' });
  }
};


  cartCtrl.removeCart=async(req,res)=>{

  try {
    const cart = await Cart.findOneAndDelete({ customer: req.user.id});

    if (!cart) {
      return res.status(404).send('Cart not found');
    }

    res.status(200).send('Cart removed successfully');
  } catch (error) {
    res.status(500).send('Error removing cart');
  }
  }

  
 cartCtrl.getItems=async(req,res)=>{
     try {
        const cart=await Cart.find({customer:req.user.id}).populate('services.service',(['servicename','price','duration']))
      if(!cart){
         return res.status(404).json({errors:'No Items in cart'})
      }
      res.status(200).json(cart)
    }catch(err){
        res.status(500).json({errors:'Error removing cart'});
    }
 }


 

 
 // Route to update the quantity of a specific service in the cart
 
 cartCtrl.updateCart = async (req, res) => {
  const { serviceId } = req.params;
  const { quantity } = req.body;
  const customerId = req.user.id;

  if (quantity !== 1 && quantity !== -1) {
    return res.status(400).json({ errors: 'Quantity must be exactly 1 or -1' });
  }

  try {
    const cart = await Cart.findOne({ customer: customerId });

    if (!cart) {
      return res.status(404).send('Cart not found');
    }

    const serviceIndex = cart.services.findIndex(item => item.service && item.service.toString() === serviceId);

    if (serviceIndex > -1) {
      cart.services[serviceIndex].quantity += quantity;

      if (cart.services[serviceIndex].quantity <= 0) {
        cart.services.splice(serviceIndex, 1);
      } else {
        const service = await Service.findById(serviceId);
        if (!service) {
          return res.status(404).json({ errors: 'Service not found' });
        }
        cart.services[serviceIndex].service = service;
      }

      const calculateTotalPrice = async (services) => {
        let total = 0;
        for (const item of services) {
          const service = await Service.findById(item.service);
          if (service) {
            total += service.price * item.quantity;
          }
        }
        return total;
      };

      cart.totalPrice = await calculateTotalPrice(cart.services);
      const response = await cart.save();

      res.status(200).json(response);
    } else {
      res.status(404).json({ errors: 'Service not found in cart' });
    }
  } catch (error) {
    res.status(500).send('Error updating cart');
  }
};
 


module.exports=cartCtrl