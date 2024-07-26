import { useState, useEffect } from 'react';
import axios from '../config/axios';

export default function AllService() {
  const [service, setService] = useState([]);

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

  const PackageCard = ({ servicename, price, description, duration }) => {
    return (
      <div className="card mb-3">
        <div className="card-body">
          <h5 className="card-title">{servicename}</h5>
          <h6 className="card-subtitle mb-2 text-muted">₹{price} • {duration}</h6>
          <ul className="list-unstyled">
            {description.map((ele, index) => (
              <li key={index}><strong>description:</strong> {ele}</li>
            ))}
          </ul>
          <div className="d-flex justify-content-between align-items-center">
            <button className="btn btn-primary">Add</button>
          </div>
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
