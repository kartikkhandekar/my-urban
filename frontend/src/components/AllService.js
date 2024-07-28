import { useState, useEffect } from 'react';
import axios from '../config/axios';
import { startAddItem } from '../actions/cart-actions';
import { useDispatch } from 'react-redux';
export default function AllService() {
  const [service, setService] = useState([]);
  const dispatch=useDispatch()
  useEffect(() => {
    const fun = async () => {
      const allService = await axios.get('/service', {
        headers: {
          Authorization: localStorage.getItem('token'),
        },
      });
      setService(allService.data);
    };
    fun();
  }, []);

  console.log(service);

 const handleClick=(id)=>{
   dispatch(startAddItem(id))
  
 }

  return (
    <div className="container mt-5">
      {service.map((ele) => {
      return (
          <div className="card mb-3">
        <div className="card-body">
          <h5 className="card-title">{ele.servicename}</h5>
          <h6 className="card-subtitle mb-2 text-muted">₹{ele.price} • {ele.duration}</h6>
          <ul className="list-unstyled">
            {ele.description.map((ele, index) => (
              <li key={index}><strong>description:</strong> {ele}</li>
            ))}
          </ul>
          <div className="d-flex justify-content-between align-items-center">
            <button className="btn btn-primary" onClick={()=>{handleClick(ele._id)}}>Add</button>
          </div>
        </div>
      </div>
        )
      })}
    </div>
  );
}
