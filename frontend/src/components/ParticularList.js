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


// import { useState, useEffect } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import axios from "../config/axios";
// import { fetchAllCartItems,addCartItem  } from '../actions/cart-actions';
// import { useDispatch, useSelector } from 'react-redux';

// export default function ParticularList() {
//   const [service, setService] = useState([]);
//   const { category } = useParams();
//   const navigate = useNavigate();
//   const dispatch = useDispatch();
//   const cartItems = useSelector((state) => state.cart.items);
  
//   console.log(cartItems)
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
//         alert("Error fetching services:", error);
//       }
//     };
//     fetchServices();
//   }, [category]);

//   useEffect(() => {
//     dispatch(fetchAllCartItems());
//   }, [dispatch]);


//   const handleAddClick = async (id) => {
//     dispatch(addCartItem(id));
//   };

//   const PackageCard = ({ _id, servicename,rating, price, duration, description }) => {
//   const isInCart = cartItems  && cartItems.some(ele=> ele.service._id === _id)
//   console.log(isInCart)

//     return (
//       <div className="card mb-3">
//         <div className="card-body">
//           <h5 className="card-title">{servicename}</h5>
//           <h6 className="card-subtitle mb-2 text-muted">₹{price} • {duration}</h6>
//             <div className="mb-2">
//             <strong>Rating:</strong> {rating} 
//             </div>
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
import { fetchAllCartItems, addCartItem } from '../actions/cart-actions';
import { useDispatch, useSelector } from 'react-redux';
import ReviewsModal from "./ReviewModel"; 

export default function ParticularList() {
  const [service, setService] = useState([])
  const [selectedService, setSelectedService] = useState(null)
  const [reviews, setReviews] = useState([])
  const [modalOpen, setModalOpen] = useState(false)
  const { category } = useParams()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const cartItems = useSelector((state) => state.cart.items)

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await axios.get(`/service/category/${category}`, {
          headers: {
            Authorization: localStorage.getItem('token'),
          },
        })
        setService(response.data)
      } catch (error) {
        alert("Error fetching services:", error)
      }
    };
    fetchServices();
  }, [category])

  useEffect(() => {
    dispatch(fetchAllCartItems())
  }, [dispatch])

  const handleAddClick = async (id) => {
    dispatch(addCartItem(id))
  }

  const handleViewReviews = async (serviceId) => {
    try {
      const response = await axios.get(`/review/${serviceId}`, {
        headers: {
          Authorization: localStorage.getItem('token'),
        },
      });
      setReviews(response.data);
      setSelectedService(serviceId);
      setModalOpen(true);
    } catch (error) {
      alert("Error fetching reviews:", error)
    }
  };

  const PackageCard = ({ _id, servicename, rating, price, duration, description }) => {
    const isInCart = cartItems && cartItems.some(ele => ele.service._id === _id)

    return (
      <div className="card mb-3">
        <div className="card-body">
          <h5 className="card-title">{servicename}</h5>
          <h6 className="card-subtitle mb-2 text-muted">₹{price} • {duration}</h6>
          <div className="mb-2">
            <strong>Rating:</strong> {rating}
          </div>
          <ul className="list-unstyled">
            {description.map((detail, i) => (
              <li key={i}><strong>Description:</strong> {detail}</li>
            ))}
          </ul>
          <button className="btn btn-secondary" onClick={() => handleViewReviews(_id)}>
            View Reviews
          </button>{'  '}
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

      <ReviewsModal
        isOpen={modalOpen}
        toggle={() => setModalOpen(false)}
        reviews={reviews}
      />
    </div>
  )
}



// import { useState, useEffect } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import axios from "../config/axios";
// import { fetchAllCartItems, addCartItem } from '../actions/cart-actions';
// import { useDispatch, useSelector } from 'react-redux';
// import ReviewsModal from "./ReviewModel"; 

// export default function ParticularList() {
//   const [service, setService] = useState([]);
//   const [selectedService, setSelectedService] = useState(null);
//   const [reviews, setReviews] = useState([]);
//   const [modalOpen, setModalOpen] = useState(false);
//   const [search, setSearch] = useState('');
//   const [sortBy, setSortBy] = useState('servicename');
//   const [order, setOrder] = useState('asc');
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
//           params: {
//             search,
//             sortBy,
//             order
//           }
//         });
//         setService(response.data);
//       } catch (error) {
//         alert("Error fetching services:", error);
//       }
//     };
//     fetchServices();
//   }, [category, search, sortBy, order]);

//   useEffect(() => {
//     dispatch(fetchAllCartItems());
//   }, [dispatch]);

//   const handleAddClick = async (id) => {
//     dispatch(addCartItem(id));
//   };

//   const handleViewReviews = async (serviceId) => {
//     try {
//       const response = await axios.get(`/review/${serviceId}`, {
//         headers: {
//           Authorization: localStorage.getItem('token'),
//         },
//       });
//       setReviews(response.data);
//       setSelectedService(serviceId);
//       setModalOpen(true);
//     } catch (error) {
//       alert("Error fetching reviews:", error);
//     }
//   };

//   const PackageCard = ({ _id, servicename, rating, price, duration, description }) => {
//     const isInCart = cartItems && cartItems.some(ele => ele.service._id === _id);

//     return (
//       <div className="card mb-3">
//         <div className="card-body">
//           <h5 className="card-title">{servicename}</h5>
//           <h6 className="card-subtitle mb-2 text-muted">₹{price} • {duration}</h6>
//           <div className="mb-2">
//             <strong>Rating:</strong> {rating}
//           </div>
//           <ul className="list-unstyled">
//             {description.map((detail, i) => (
//               <li key={i}><strong>Description:</strong> {detail}</li>
//             ))}
//           </ul>
//           <button className="btn btn-secondary" onClick={() => handleViewReviews(_id)}>
//             View Reviews
//           </button>{'  '}
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
//       <div className="mb-3">
//         <input
//           type="text"
//           className="form-control mb-2"
//           placeholder="Search services..."
//           value={search}
//           onChange={(e) => setSearch(e.target.value)}
//         />
//         <div className="d-flex">
//           <select className="form-control me-2" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
//             <option value="servicename">Service Name</option>
//             <option value="price">Price</option>
//             <option value="rating">Rating</option>
//           </select>
//           <select className="form-control" value={order} onChange={(e) => setOrder(e.target.value)}>
//             <option value="asc">Ascending</option>
//             <option value="desc">Descending</option>
//           </select>
//         </div>
//       </div>

//       {service.map((pkg, index) => (
//         <PackageCard key={index} {...pkg} />
//       ))}

//       <ReviewsModal
//         isOpen={modalOpen}
//         toggle={() => setModalOpen(false)}
//         reviews={reviews}
//       />
//     </div>
//   );
// }
