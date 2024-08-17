// const Service=require('../models/service-model')
// const Customer=require('../models/customer-model')
// const Cart=require('../models/cart-model')

// const cartCtrl={}


// cartCtrl.create = async (req, res) => {
//   const customerId = req.user.id;
//   const serviceId = req.params.serviceId;
//   const { quantity } = req.body;

//   if (quantity !== 1) {
//     return res.status(400).json({ errors: 'Quantity must be exactly 1' });
//   }

//   try {
//     const serviceDetails = await Service.findById(serviceId);
//     if (!serviceDetails) {
//       return res.status(404).json({ errors: 'Service not found' });
//     }

//     if (!serviceDetails.price || typeof serviceDetails.price !== 'number') {
//       return res.status(400).json({ errors: 'Service price is invalid' });
//     }

//     let cart = await Cart.findOne({ customer: customerId });

//     if (!cart) {
//       const newCart = new Cart({
//         customer: customerId,
//         services: [{ service: serviceId, quantity }],
//         totalPrice: serviceDetails.price * quantity,
//       });

//       const response = await newCart.save();
//       return res.status(200).json(response);
//     } else {
//       const serviceIndex = cart.services.findIndex(item => item.service.toString() === serviceId);

//       if (serviceIndex > -1) {
//         cart.services[serviceIndex].quantity += quantity;
//       } else {
//         cart.services.push({ service: serviceId, quantity });
//       }

//       let totalPrice = 0;
//       for (const item of cart.services) {
//         const service = await Service.findById(item.service);
//         if (!service.price || typeof service.price !== 'number') {
//           return res.status(400).json({ errors: `Service price is invalid for serviceId: ${item.service}` })
//         }
//         totalPrice += service.price * item.quantity;
//       }
//       cart.totalPrice = totalPrice;

//       const response = await cart.save()
//       return res.status(200).json(response)
//     }
//   } catch (error) {
//     console.error('Error adding service to cart:', error)
//     return res.status(500).json({ errors: 'Error adding service to cart' })
//   }
// };


// cartCtrl.removeItem = async (req, res) => {
//   const { serviceId } = req.params
//   const customerId = req.user.id
 
//   try {
//     const cart = await Cart.findOne({ customer: customerId })

//     if (!cart) {
//       return res.status(404).json({ errors: 'Cart not found' })
//     }

//     const serviceIndex = cart.services.findIndex(item => item.service && item.service.toString() === serviceId)

//     if (serviceIndex === -1) {
//       return res.status(404).json({ errors: 'Service not found in cart' })
//     }

//     cart.services.splice(serviceIndex, 1);

//     const calculateTotalPrice = async (services) => {
//       let total = 0;
//       for (const item of services) {
//         if (!item.service) continue
//         const service = await Service.findById(item.service)
//         if (service) {
//           total += service.price * item.quantity;
//         } else {
//           console.log(`Service not found for id: ${item.service}`)
//         }
//       }
//       return total;
//     };

//     cart.totalPrice = await calculateTotalPrice(cart.services)

//     const response = await cart.save()
//     res.status(200).json(response)
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ errors: 'Error removing service from cart' })
//   }
// }


//   cartCtrl.removeCart=async(req,res)=>{

//   try {
//     const cart = await Cart.findOneAndDelete({ customer: req.user.id})

//     if (!cart) {
//       return res.status(404).send('Cart not found')
//     }

//     res.status(200).send('Cart removed successfully')
//   } catch (error) {
//     res.status(500).send('Error removing cart')
//   }
//   }

  
//  cartCtrl.getItems=async(req,res)=>{
//      try {
//         const cart=await Cart.find({customer:req.user.id}).populate('services.service',(['servicename','price','duration']))
//       if(!cart){
//          return res.status(404).json({errors:'No Items in cart'})
//       }
//       res.status(200).json(cart)
//     }catch(err){
//         res.status(500).json({errors:'Error removing cart'})
//     }
//  }


 

 
 
//  cartCtrl.updateCart = async (req, res) => {
//   const { serviceId } = req.params;
//   const { quantity } = req.body;
//   const customerId = req.user.id;

//   if (quantity !== 1 && quantity !== -1) {
//     return res.status(400).json({ errors: 'Quantity must be exactly 1 or -1' })
//   }

//   try {
//     const cart = await Cart.findOne({ customer: customerId });

//     if (!cart) {
//       return res.status(404).send('Cart not found')
//     }

//     const serviceIndex = cart.services.findIndex(item => item.service && item.service.toString() === serviceId)

//     if (serviceIndex > -1) {
//       cart.services[serviceIndex].quantity += quantity;

//       if (cart.services[serviceIndex].quantity <= 0) {
//         cart.services.splice(serviceIndex, 1)
//       } else {
//         const service = await Service.findById(serviceId)
//         if (!service) {
//           return res.status(404).json({ errors: 'Service not found' })
//         }
//         cart.services[serviceIndex].service = service
//       }

//       const calculateTotalPrice = async (services) => {
//         let total = 0
//         for (const item of services) {
//           const service = await Service.findById(item.service)
//           if (service) {
//             total += service.price * item.quantity
//           }
//         }
//         return total
//       }

//       cart.totalPrice = await calculateTotalPrice(cart.services);
//       const response = await cart.save()

//       res.status(200).json(response)
//     } else {
//       res.status(404).json({ errors: 'Service not found in cart' })
//     }
//   } catch (error) {
//     res.status(500).send('Error updating cart')
//   }
// };
 


// module.exports=cartCtrl



const Service=require('../models/service-model')
const Cart=require('../models/cart-model')
const { customerId } = require('../validations/review-validatons')

const cartCtrl={}

cartCtrl.create=async (req, res) => {
  try {
    const serviceId=req.params.serviceId
    const service=await Service.findById(serviceId)
    const cartItem=new Cart({
        customer:req.user.id,
        service:serviceId,
        price:service.price
    })
    await cartItem.save()
    await cartItem.populate({
      path: 'service',
       select: 'servicename price category',
      populate: {
        path: 'serviceProvider',
        select: 'username email'
      }
    })
    res.status(201).json(cartItem)
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
}

cartCtrl.removeItem=async (req, res) => {
  try {
    const cartId=req.params.cartId
    const cartItem = await Cart.findByIdAndDelete(cartId)
   

    if (!cartItem) {
      return res.status(404).json({ error: 'Cart item not found' })
    }

    res.status(200).json({ message: 'Cart item deleted successfully' })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}


cartCtrl.removeService=async (req, res) => {
  try {
    const serviceId=req.params.serviceId
    const cartItem = await Cart.deleteMany({service:serviceId})
   

    if (!cartItem) {
      return res.status(404).json({ error: ' Service not found' })
    }

    res.status(200).json({ message: 'Cart item deleted successfully' })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}


cartCtrl.clearCart=async (req, res) => {
  try {
    
    const cartItem = await Cart.deleteMany({customer:req.user.id})
  

    if (!cartItem) {
      return res.status(404).json({ error: ' Service not found' })
    }

    res.status(200).json({ message: 'Cart item deleted successfully' })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

cartCtrl.allItems=async (req, res) => {
  try {
    
    const cartItem = await Cart.find({customer:req.user.id}).populate({
      path: 'service',
       select: 'servicename price category',
      populate: {
        path: 'serviceProvider',
        select: 'username email'
      }
    })
    console.log(cartItem)

    // if (!cartItem) {
    //   return res.status(404).json({ error: ' Items not found' })
    // }

    res.status(200).json(cartItem)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}


module.exports=cartCtrl