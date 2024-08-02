const Service=require('../models/service-model')
const Customer=require('../models/customer-model')
const Cart=require('../models/cart-model')

const cartCtrl={}

cartCtrl.create=async(req,res)=>{
    const customerId=req.user.id
    const serviceId=req.params.serviceId
    const { quantity }=req.body

    if (quantity !== 1) {
      return res.status(400).json({ errors: 'Quantity must be exactly 1' });
    }

    try {
        const cart = await Cart.findOne({ customer: customerId})
        
        if (!cart) {
            
          const details=await Service.findById(serviceId)
          console.log(serviceId)
          const newCart = new Cart({
            customer:customerId,
            services: [{ service: serviceId, quantity }],
            totalPrice: details.price
          });
    
          const response=await newCart.save()
          res.status(200).json(response)

        } else {
          const serviceIndex = cart.services.findIndex(item => item.service.toString() === serviceId)
          
  
    
          if (serviceIndex > -1 ) {
            cart.services[serviceIndex].quantity += quantity
          } else {
            cart.services.push({ service: serviceId, quantity })
          }
           
          async function calculateTotalPrice(services) {
            let total = 0;
            for (const item of services) {
              const service = await Service.findById(item.service);
              total += service.price * item.quantity;
            }
            return total;
          }
          // Calculate total price based on services and their quantities
          cart.totalPrice = await calculateTotalPrice(cart.services)
    
          const response= await cart.save()
          res.status(200).json(response)
          
        }
      } catch (error) {
        res.status(500).json({errors:'Error adding service to cart'});
      }
}



 cartCtrl.removeItem=async (req, res) => {
    const { serviceId } = req.params
    const customerId=req.user.id
  
    try {
      const cart = await Cart.findOne({ customer: customerId })
  
      if (!cart) {
        return res.status(404).json({errors:'Cart not found'})
      }
  
      const serviceIndex = cart.services.findIndex(item => item.service.toString() === serviceId)
      
      if (serviceIndex === -1) {
        return res.status(404).json({errors:'Service not found in cart'})
      }
  
      cart.services.splice(serviceIndex, 1)

      async function calculateTotalPrice(services) {
        let total = 0
        for (const item of services) {
          const service = await Service.findById(item.service)
          total += service.price * item.quantity
        }
        return total
      }
  
      // Calculate the new total price
      cart.totalPrice = await calculateTotalPrice(cart.services)
  
      const response=await cart.save()
      res.status(200).json(response)
    } catch (error) {
      res.status(500).json({errors:'Error removing service from cart'})
    }
  }



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
 const calculateTotalPrice = async (services) => {
  let total = 0;
  for (const item of services) {
    const service = await Service.findById(item.service);
    total += service.price * item.quantity;
  }
  return total;
};

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

    const serviceIndex = cart.services.findIndex(item => item.service.toString() === serviceId);

    if (serviceIndex > -1) {
      cart.services[serviceIndex].quantity += quantity;

      if (cart.services[serviceIndex].quantity <= 0) {
        cart.services.splice(serviceIndex, 1);
      }

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