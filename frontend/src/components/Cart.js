



// import React, { useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { useDispatch, useSelector } from 'react-redux';
// import { getCartItems, removeFromCart, updateCart, clearCart } from '../actions/cart-actions';
// import { Container, Row, Col, Button, Table } from 'reactstrap';

// export default function Cart() {
//   const dispatch = useDispatch();
//   const cart = useSelector(state => state.cart.items);
//   const error = useSelector(state => state.cart.error);
//  const navigate=useNavigate()
//   useEffect(() => {
//     dispatch(getCartItems());
//   }, [dispatch]);

 
//   const handleRemoveFromCart = (serviceId) => {
//     dispatch(removeFromCart(serviceId));
//     dispatch(getCartItems())
//   };

//   const handleUpdateCart = (serviceId, increment) => {
//     dispatch(updateCart(serviceId, increment ? 1 : -1));
//     dispatch(getCartItems())
//   };

//   const handleClearCart = () => {
//     dispatch(clearCart());
//   };

//   // Calculate total price
//   // const calculateTotalPrice = () => {
//   //   return cart.reduce((total, item) => total + item.services[0].service.price * item.quantity, 0);
//   // };

//   // const totalPrice = calculateTotalPrice();

//   return (
//     <>
//     <Container>
//       <Row className="justify-content-center mt-5">
//         <Col md={8}>
//           <h1>Cart</h1>
//           {error && <p className="text-danger">{error}</p>}
//           <Table striped bordered hover>
//             <thead>
//               <tr>
//                 <th>Service Name</th>
//                 <th>Quantity</th>
//                 <th>Actions</th>
//                 <th>Price</th>
//               </tr>
//             </thead>
//             <tbody>
//               {cart.length > 0 && cart[0].services.map(item => (
//                 <tr key={item.service._id}>
//                   <td>{item.service.servicename}</td>
//                   <td>{item.quantity}</td>
//                   <td>
//                     <Button color="primary" size="sm" onClick={() => handleUpdateCart(item.service._id, true)}>+</Button>{' '}
//                     <Button color="warning" size="sm" onClick={() => handleUpdateCart(item.service._id, false)}>-</Button>{' '}
//                     <Button color="danger" size="sm" onClick={() => handleRemoveFromCart(item.service._id)}>Remove</Button>
//                   </td>
//                   <td>₹{item.service.price * item.quantity}</td>
//                 </tr>
//               ))}
//             </tbody>
//           </Table>
//           {cart.length > 0 && cart[0].services.length > 0 && (
//             <>
//               <div className="d-flex justify-content-between align-items-center">
//                 <h4>Total Price: ₹{cart[0].totalPrice}</h4>
//                 <Button color="danger" onClick={handleClearCart}>Clear Cart</Button>
//               </div>
//             </>
//           )}
             
//         </Col>
//       </Row>
//     </Container>
//     </>
//   );
// }


// import React, { useEffect } from 'react'
// import { useNavigate } from 'react-router-dom'
// import { useDispatch, useSelector } from 'react-redux'
// import { getCartItems, removeFromCart, updateCart, clearCart } from '../actions/cart-actions'
// import { Container, Row, Col, Button, Table } from 'reactstrap'
// import EmptyCart from './EmptyCart'

// export default function Cart() {
//   const dispatch = useDispatch()
//   const cart = useSelector(state => state.cart.items)
//   const error = useSelector(state => state.cart.error)
//   const navigate = useNavigate()
   

//   useEffect(() => {
//     dispatch(getCartItems())
//   }, [dispatch])

//   console.log(cart)

//   const handleRemoveFromCart = (serviceId) => {
//     dispatch(removeFromCart(serviceId))
   
//   }

//   const handleUpdateCart = (serviceId, increment) => {
//     dispatch(updateCart(serviceId, increment ? 1 : -1))
   
//   }

//   const handleClearCart = () => {
//     dispatch(clearCart())
//   };

//   const handleBookServices = () => {
//     navigate('/booking')
//   };

//   const handleAddServices = () => {
//     navigate('/')
//   };

//   if (cart.length === 0) {
//     return <EmptyCart onAddServices={handleAddServices} />
//   }

//   return (
//     <Container>
//       <Row className="justify-content-center mt-5">
//         <Col md={8}>
//           <h1>Cart</h1>
//           {error && <p className="text-danger">{error}</p>}
//           <Table striped bordered hover>
//             <thead>
//               <tr>
//                 <th>Service Name</th>
//                 <th>Quantity</th>
//                 <th>Actions</th>
//                 <th>Price</th>
//               </tr>
//             </thead>
//             <tbody>
//               {cart && cart.services.map(item => 
//               (  
//                 <tr key={item._id}>
//                   <td>{item.servicename}</td>
//                   <td>{item.quantity}</td>
//                   <td>
//                     <Button color="primary" size="sm" onClick={() => handleUpdateCart(item._id, true)}>+</Button>{' '}
//                     <Button color="warning" size="sm" onClick={() => handleUpdateCart(item._id, false)}>-</Button>{' '}
//                     <Button color="danger" size="sm" onClick={() => handleRemoveFromCart(item._id)}>Remove</Button>
//                   </td>
//                   <td>₹{item.price * item.quantity}</td>
//                 </tr>
//               ))}
//             </tbody>
//           </Table>
//           {cart  && cart.services.length > 0 && (
//             <>
//               <div className="d-flex justify-content-between align-items-center">
//                 <h4>Total Price: ₹{cart.totalPrice}</h4>
//                 <Button color="danger" onClick={handleClearCart}>Clear Cart</Button>
//               </div>
//               <Button color="success" className="mt-3" onClick={handleBookServices}>Book Services</Button>
//             </>
//           )}
//         </Col>
//       </Row>
//     </Container>
    
//   )
// }



// import React, { useEffect } from 'react'
// import { useNavigate } from 'react-router-dom'
// import { useDispatch, useSelector } from 'react-redux'
// import { fetchAllCartItems,addCartItem,removeCartItem,removeServiceItems, } from '../actions/cart-actions'
// import { Container, Row, Col, Button, Table } from 'reactstrap'
// import EmptyCart from './EmptyCart'

// export default function Cart() {
//   const dispatch = useDispatch()
//   const cart = useSelector(state => state.cart.items)
//   console.log('cart', cart)
//   const error = useSelector(state => state.cart.error)
//   const navigate = useNavigate()

//   useEffect(() => {
//     dispatch(fetchAllCartItems())
//   }, [dispatch])

// //   const handleRemoveFromCart = (serviceId) => {
// //     dispatch(removeFromCart(serviceId))
// //   }

// //   const handleUpdateCart = (serviceId, increment) => {
// //     dispatch(updateCart(serviceId, increment ? 1 : -1))
    
// //   }

// //   const handleClearCart = () => {
// //     dispatch(clearCart())
// //   };

//   const handleBookServices = () => {
//     navigate('/booking')
//   };

//   const handleAddServices = () => {
//     navigate('/')
//   };

//   if (cart.length === 0) {
//     return <EmptyCart onAddServices={handleAddServices} />
//   }

//   return (
//     <Container>
//       <Row className="justify-content-center mt-5">
//         <Col md={8}>
//           <h1>Cart</h1>
//           {error && <p className="text-danger">{error}</p>}
//           <Table striped bordered hover>
//             <thead>
//               <tr>
//                 <th>Service Name</th>
//                 <th>Quantity</th>
//                 <th>Actions</th>
//                 <th>Price</th>
//               </tr>
//             </thead>
//             <tbody>
//               {/* {cart && cart.services.map(item => (
//                 item.service && (
//                   <tr key={item._id}>
//                     <td>{item.service.servicename}</td>
//                     <td>{item.quantity}</td>
//                     <td>
//                       <Button color="primary" size="sm" >+</Button>{' '}
//                       <Button color="warning" size="sm" >-</Button>{' '}
//                       <Button color="danger" size="sm" >Remove</Button>
//                     </td>
//                     <td>₹{item.service.price * item.quantity}</td>
//                   </tr>
//                 )
//               ))} */}
//             </tbody>
//           </Table>
//           {/* {cart && cart.services.length > 0 && (
//             <>
//               <div className="d-flex justify-content-between align-items-center">
//                 <h4>Total Price: ₹{cart.totalPrice}</h4>
//                 <Button color="danger" onClick={handleClearCart}>Clear Cart</Button>
//               </div>
//               <Button color="success" className="mt-3" onClick={handleBookServices}>Book Services</Button>
//             </>
//           )} */}
//         </Col>
//       </Row>
//     </Container>
//   )
// }


import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchAllCartItems,
  addCartItem,
  removeCartItem,
  removeServiceItems,
  clearCart,
} from '../actions/cart-actions'; 
import EmptyCart from './EmptyCart';
import { useNavigate } from 'react-router-dom';

export default function CartComponent(){
  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cart.items);
  const navigate=useNavigate()
  useEffect(() => {
    dispatch(fetchAllCartItems());
  }, [dispatch]);

  // Group items by service name
  const groupedItems = cartItems.reduce((acc, item) => {
    const key = item.service._id;
    if (!acc[key]) {
      acc[key] = { ...item, quantity: 0, totalPrice: 0 };
    }
    acc[key].quantity += item.quantity;
    acc[key].totalPrice += item.price * item.quantity;
    return acc
  }, {})

  const handleIncreaseQuantity = (serviceId) => {
    dispatch(addCartItem(serviceId));
  }

  const handleDecreaseQuantity = (cartId, quantity) => {
      dispatch(removeCartItem(cartId));
  }

  const handleRemoveItem = (serviceId) => {
    dispatch(removeServiceItems(serviceId));
  };

  const handleClearCart = () => {
    dispatch(clearCart());
  };

  const handleAddServices = () => {
        navigate('/')
  }

  const handleBookServices = () => {
        navigate('/booking')
   }

  if (cartItems.length === 0) {
        return <EmptyCart onAddServices={handleAddServices} />
  }

  const totalAmount = Object.values(groupedItems).reduce((acc, item) => acc + item.totalPrice, 0);

  return (
    <div>
      <h1 style={{textAlign:'center'}}>Cart</h1>
      <table className="table">
        <thead>
          <tr>
            <th>Service Name</th>
            <th>Category</th>
            <th>Price</th>
            <th>Quantity</th>
            <th>Total Price</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {Object.values(groupedItems).map((item) => (
            <tr key={item._id}>
              <td>{item.service.servicename}</td>
              <td>{item.service.category}</td>
              <td>₹{item.service.price}</td>
              <td>{item.quantity}</td>
              <td>₹{item.totalPrice}</td>
              <td>
                <button className="btn btn-sm btn-primary" onClick={() => handleIncreaseQuantity(item.service._id)}>+</button>
                <button className="btn btn-sm btn-secondary" onClick={() => handleDecreaseQuantity(item._id, item.quantity)}>-</button>
                <button className="btn btn-sm btn-danger" onClick={() => handleRemoveItem(item.service._id)}>Remove</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div>
        <h2>Total Amount: ₹{totalAmount}</h2>
        <button className="btn btn-danger" onClick={handleClearCart}>Clear Cart</button>{'   '}
        <button className="btn btn-success"  onClick={handleBookServices}>Book Services</button>
      </div>
    </div>
  );
};


