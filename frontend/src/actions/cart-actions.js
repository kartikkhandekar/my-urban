

// import axios from '../config/axios';

// export const ADD_TO_CART = 'ADD_TO_CART';
// export const REMOVE_FROM_CART = 'REMOVE_FROM_CART';
// export const CLEAR_CART = 'CLEAR_CART';
// export const UPDATE_CART = 'UPDATE_CART';
// export const GET_CART_ITEMS = 'GET_CART_ITEMS';
// export const CART_ERROR = 'CART_ERROR';

// export const addToCart = (serviceId) => async (dispatch) => {
//   try {
//     const response = await axios.post(`/cart/${serviceId}`, {quantity:1}, {
//       headers: {
//         Authorization: localStorage.getItem('token'),
//       },
//     });
//     console.log("Add to Cart Response:", response.data); 
//     dispatch({
//       type: ADD_TO_CART,
//       payload: response.data,
//     });
//   } catch (error) {
//     alert(error.message); 
//     dispatch({
//       type: CART_ERROR,
//       payload: error.message,
//     });
//   }
// };

// export const removeFromCart = (serviceId) => async (dispatch) => {
//   try {
//     const response = await axios.delete(`/cart/${serviceId}`, {
//       headers: {
//         Authorization: localStorage.getItem('token'),
//       },
//     });
//     console.log("Remove from Cart Response:", response.data); 
//     dispatch({
//       type: REMOVE_FROM_CART,
//       payload: response.data,
//     });
//   } catch (error) {
//     console.error("Remove from Cart Error:", error); 
//     dispatch({
//       type: CART_ERROR,
//       payload: error.message,
//     });
//   }
// };

// export const clearCart = () => async (dispatch) => {
//   try {
//     const response = await axios.delete('/cart', {
//       headers: {
//         Authorization: localStorage.getItem('token'),
//       },
//     });
//     console.log("Clear Cart Response:", response.data); 
//     dispatch({
//       type: CLEAR_CART,
//       payload: response.data,
//     });
//   } catch (error) {
//     console.error("Clear Cart Error:", error); 
//     dispatch({
//       type: CART_ERROR,
//       payload: error.message,
//     });
//   }
// };

// export const updateCart = (serviceId, quantity) => async (dispatch) => {
//   try {
//     console.log(serviceId)
//     const response = await axios.put(`/cart/${serviceId}`, { quantity:quantity }, {
//       headers: {
//         Authorization: localStorage.getItem('token'),
//       },
//     });
//     console.log("Update Cart Response:", response.data); 
//     dispatch({
//       type: UPDATE_CART,
//       payload: response.data,
//     });
//   } catch (error) {
//     console.error("Update Cart Error:", error); 
//     dispatch({
//       type: CART_ERROR,
//       payload: error.message,
//     });
//   }
// };
// export const getCartItems = () => async (dispatch) => {
//   try {
//     const response = await axios.get('/cart', {
//       headers: {
//         Authorization: localStorage.getItem('token'),
//       },
//     });
//     console.log("Get Cart Items Response:", response.data);
//     dispatch({
//       type: GET_CART_ITEMS,
//       payload: response.data,
//     });
//   } catch (error) {
//     console.error("Get Cart Items Error:", error.message);
//     dispatch({
//       type: CART_ERROR,
//       payload: error.message,
//     });
//   }
// };



import axios from '../config/axios';

// Action Types
export const ADD_CART_ITEM = 'ADD_CART_ITEM';
export const REMOVE_CART_ITEM = 'REMOVE_CART_ITEM';
export const REMOVE_SERVICE_ITEMS = 'REMOVE_SERVICE_ITEMS';
export const CLEAR_CART = 'CLEAR_CART';
export const FETCH_ALL_CART_ITEMS = 'FETCH_ALL_CART_ITEMS';

// Action Creators
export const addCartItem = (serviceId) => async (dispatch) => {
  try {
    const response = await axios.post(`/cart/${serviceId}`,{},{
     headers:{
      Authorization:localStorage.getItem('token')
     }
    });
    dispatch({ type: ADD_CART_ITEM, payload: response.data });
  } catch (error) {
    console.error('Failed to add cart item:', error);
  }
};


export const removeCartItem = (cartId) => async (dispatch) => {
  try {
    await axios.delete(`/cart/${cartId}`,{
      headers:{
       Authorization:localStorage.getItem('token')
      }
     });
    dispatch({ type: REMOVE_CART_ITEM, payload: cartId });
  } catch (error) {
    console.error('Failed to remove cart item:', error);
  }
};

export const removeServiceItems = (serviceId) => async (dispatch) => {
  try {
    await axios.delete(`/cart/service/${serviceId}`,{
      headers:{
       Authorization:localStorage.getItem('token')
      }
     });
    dispatch({ type: REMOVE_SERVICE_ITEMS, payload: serviceId });
  } catch (error) {
    console.error('Failed to remove service items:', error);
  }
};

export const clearCart = () => async (dispatch) => {
  try {
    await axios.delete(`/cart`,{
      headers:{
       Authorization:localStorage.getItem('token')
      }
     });
    dispatch({ type: CLEAR_CART });
  } catch (error) {
    console.error('Failed to clear cart:', error);
  }
};

export const fetchAllCartItems = () => async (dispatch) => {
  try {
    const response = await axios.get('/all',{
      headers:{
       Authorization:localStorage.getItem('token')
      }
     });
    dispatch({ type: FETCH_ALL_CART_ITEMS, payload: response.data });
  } catch (error) {
    console.error('Failed to fetch all cart items:', error);
  }
};
