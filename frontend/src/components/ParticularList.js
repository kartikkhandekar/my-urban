// import { useState, useEffect } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import axios from "../config/axios";
// import { addToCart, getCartItems } from '../actions/cart-actions';
// import { useDispatch, useSelector } from 'react-redux';

// export default function ParticularList() {
//   const [service, setService] = useState([]);
//   const { category } = useParams();
//   const navigate = useNavigate();
//   const dispatch = useDispatch();
//   const cartItems = useSelector((state) => state.cart.items);

//   useEffect(() => {
//     const fetchServices = async () => {
//       try {
//         const response = await axios.get(`/service/category/${category}`, {
//           headers: {
//             Authorization: localStorage.getItem('token'),
//           },
//         });
//         setService(response.data);
//       } catch (error) {
//         console.error("Error fetching services:", error);
//       }
//     };
//     fetchServices();
//   }, [category]);

//   useEffect(() => {
//     dispatch(getCartItems());
//   }, [dispatch]);

//   const handleAddClick = async (id) => {
//     await dispatch(addToCart(id));
//     dispatch(getCartItems()); // Fetch updated cart items
//   };

//   const PackageCard = ({ _id, servicename, price, duration, description }) => {
//     const isInCart = cartItems.length > 0 && cartItems[0].services.some((item) => item.service._id === _id);

//     return (
//       <div className="card mb-3">
//         <div className="card-body">
//           <h5 className="card-title">{servicename}</h5>
//           <h6 className="card-subtitle mb-2 text-muted">₹{price} • {duration}</h6>
//           <ul className="list-unstyled">
//             {description.map((detail, i) => (
//               <li key={i}><strong>Description:</strong> {detail}</li>
//             ))}
//           </ul>
//           {isInCart ? (
//             <button className="btn btn-primary" onClick={() => navigate('/cart')}>
//               Go to cart
//             </button>
//           ) : (
//             <button className="btn btn-primary" onClick={() => handleAddClick(_id)}>
//               Add
//             </button>
//           )}
//         </div>
//       </div>
//     );
//   };

//   return (
//     <div className="container mt-5">
//       {service.map((pkg, index) => (
//         <PackageCard key={index} {...pkg} />
//       ))}
//     </div>
//   );
// }


import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "../config/axios";
import { fetchAllCartItems,addCartItem  } from '../actions/cart-actions';
import { useDispatch, useSelector } from 'react-redux';

export default function ParticularList() {
  const [service, setService] = useState([]);
  const { category } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cart.items);
  
  console.log(cartItems)
  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await axios.get(`/service/category/${category}`, {
          headers: {
            Authorization: localStorage.getItem('token'),
          },
        });
        setService(response.data);
      } catch (error) {
        alert("Error fetching services:", error);
      }
    };
    fetchServices();
  }, [category]);

  useEffect(() => {
    dispatch(fetchAllCartItems());
  }, [dispatch]);


  const handleAddClick = async (id) => {
    dispatch(addCartItem(id));
  };

  const PackageCard = ({ _id, servicename, price, duration, description }) => {
  const isInCart = cartItems  && cartItems.some(ele=> ele.service._id === _id)
  console.log(isInCart)

    return (
      <div className="card mb-3">
        <div className="card-body">
          <h5 className="card-title">{servicename}</h5>
          <h6 className="card-subtitle mb-2 text-muted">₹{price} • {duration}</h6>
          <ul className="list-unstyled">
            {description.map((detail, i) => (
              <li key={i}><strong>Description:</strong> {detail}</li>
            ))}
          </ul>
          {isInCart ? (
            <button className="btn btn-primary" onClick={() => navigate('/cart')}>
              Go to cart
            </button>
          ) : (
            <button className="btn btn-primary" onClick={() => handleAddClick(_id)}>
              Add
            </button>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="container mt-5">
      {service.map((pkg, index) => (
        <PackageCard key={index} {...pkg} />
      ))}
    </div>
  );
}
