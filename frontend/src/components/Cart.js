



//imp
// import React, { useEffect } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import { getCartItems, removeFromCart, updateCart, clearCart } from '../actions/cart-actions';
// import { Container, Row, Col, Button, Table } from 'reactstrap';

// export default function Cart() {
//   const dispatch = useDispatch();
//   const cart = useSelector(state => state.cart.items);
//   const error = useSelector(state => state.cart.error);

//   useEffect(() => {
//     dispatch(getCartItems());
//   }, [dispatch]);

//   const handleRemoveFromCart = (serviceId) => {
//     dispatch(removeFromCart(serviceId));
//   };

//   const handleUpdateCart = (serviceId, increment) => {
//     dispatch(updateCart(serviceId, increment ? 1 : -1));
//   };

//   const handleClearCart = () => {
//     dispatch(clearCart());
//   };

//   // Calculate total price
//   const calculateTotalPrice = () => {
//     return cart.reduce((total, item) => total + item.services[0].service.price * item.quantity, 0);
//   };

//   const totalPrice = calculateTotalPrice();

//   return (
//     <Container>
//       <Row className="justify-content-center mt-5">
//         <Col md={8}>
//           <h1>Shopping Cart</h1>
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
//                 <h4>Total Price: ₹{totalPrice}</h4>
//                 <Button color="danger" onClick={handleClearCart}>Clear Cart</Button>
//               </div>
//               <Button color="success" className="mt-3">Book Services</Button>
//             </>
//           )}
//         </Col>
//       </Row>
//     </Container>
//   );
// }



import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getCartItems, removeFromCart, updateCart, clearCart } from '../actions/cart-actions';
import { Container, Row, Col, Button, Table } from 'reactstrap';

export default function Cart() {
  const dispatch = useDispatch();
  const cart = useSelector(state => state.cart.items);
  const error = useSelector(state => state.cart.error);
 const navigate=useNavigate()
  useEffect(() => {
    dispatch(getCartItems());
  }, [dispatch]);

 
  const handleRemoveFromCart = (serviceId) => {
    dispatch(removeFromCart(serviceId));
    dispatch(getCartItems())
  };

  const handleUpdateCart = (serviceId, increment) => {
    dispatch(updateCart(serviceId, increment ? 1 : -1));
    dispatch(getCartItems())
  };

  const handleClearCart = () => {
    dispatch(clearCart());
  };

  // Calculate total price
  // const calculateTotalPrice = () => {
  //   return cart.reduce((total, item) => total + item.services[0].service.price * item.quantity, 0);
  // };

  // const totalPrice = calculateTotalPrice();

  return (
    <>
    <Container>
      <Row className="justify-content-center mt-5">
        <Col md={8}>
          <h1>Cart</h1>
          {error && <p className="text-danger">{error}</p>}
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Service Name</th>
                <th>Quantity</th>
                <th>Actions</th>
                <th>Price</th>
              </tr>
            </thead>
            <tbody>
              {cart.length > 0 && cart[0].services.map(item => (
                <tr key={item.service._id}>
                  <td>{item.service.servicename}</td>
                  <td>{item.quantity}</td>
                  <td>
                    <Button color="primary" size="sm" onClick={() => handleUpdateCart(item.service._id, true)}>+</Button>{' '}
                    <Button color="warning" size="sm" onClick={() => handleUpdateCart(item.service._id, false)}>-</Button>{' '}
                    <Button color="danger" size="sm" onClick={() => handleRemoveFromCart(item.service._id)}>Remove</Button>
                  </td>
                  <td>₹{item.service.price * item.quantity}</td>
                </tr>
              ))}
            </tbody>
          </Table>
          {cart.length > 0 && cart[0].services.length > 0 && (
            <>
              <div className="d-flex justify-content-between align-items-center">
                <h4>Total Price: ₹{cart[0].totalPrice}</h4>
                <Button color="danger" onClick={handleClearCart}>Clear Cart</Button>
              </div>
            </>
          )}
             
        </Col>
      </Row>
      
    </Container>
    </>
  );
}
