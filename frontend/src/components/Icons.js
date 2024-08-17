// import React from 'react';
// import { useNavigate } from 'react-router-dom';
// import girlhair from '../assets/images/girlhair1.jpg';
// import mens from '../assets/images/mens.jpg';
// import ac from '../assets/images/ac.jpg';
// import paint from '../assets/images/painting.png';
// import drill from '../assets/images/drill.png';
// import cleaning from '../assets/images/cleaning.png';

// export default function Icons() {

//   const navigate = useNavigate();
//   const handleClick = (category) => {
//     navigate(`/category/${category}`);
//   };

//   const services = [
//     { imageSrc: girlhair, title: "Women's Salon & Spa" },
//     { imageSrc: mens, title: "Men's Salon & Massage" },
//     { imageSrc: ac, title: 'AC Repair and service' },
//     { imageSrc: cleaning, title: 'Bathroom and Kitchen cleaning' },
//     { imageSrc: drill, title: 'Electrician,Plumber & Carpenter' },
//     { imageSrc: paint, title: 'Painting & Decor' }
//   ];

//   const ServiceCard = ({ imageSrc, title }) => {
//     return (
//       <div className="col-12 col-sm-6 col-md-4 mb-4" onClick={() => handleClick(title)}>
//         <div className="card text-center">
//           <img src={imageSrc} className="card-img-top img-fluid" alt={title} style={{ height: '150px', objectFit: 'contain' }} />
//           <div className="card-body">
//             <h5 className="card-title" style={{ fontSize: '14px' }}>{title}</h5>
//           </div>
//         </div>
//       </div>
//     );
//   };

//   return (
//     <div className="container mt-5">
//       <div className="row">
//         {services.map((service, index) => (
//           <ServiceCard key={index} imageSrc={service.imageSrc} title={service.title} />
//         ))}
//       </div>
//     </div>
//   );
// }



import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import girlhair from '../assets/images/girlhair1.jpg';
import mens from '../assets/images/mens.jpg';
import ac from '../assets/images/ac.jpg';
import paint from '../assets/images/painting.png';
import drill from '../assets/images/drill.png';
import cleaning from '../assets/images/cleaning.png';

export default function Icons() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  const handleClick = (category) => {
    navigate(`/category/${category}`);
  };

  const services = [
    { imageSrc: girlhair, title: "Women's Salon & Spa" },
    { imageSrc: mens, title: "Men's Salon & Massage" },
    { imageSrc: ac, title: 'AC Repair and service' },
    { imageSrc: cleaning, title: 'Bathroom and Kitchen cleaning' },
    { imageSrc: drill, title: 'Electrician, Plumber & Carpenter' },
    { imageSrc: paint, title: 'Painting & Decor' }
  ];

  // Filter services based on search query
  const filteredServices = services.filter(service =>
    service.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const ServiceCard = ({ imageSrc, title }) => {
    return (
      <div className="col-12 col-sm-6 col-md-4 mb-4" onClick={() => handleClick(title)}>
        <div className="card text-center">
          <img src={imageSrc} className="card-img-top img-fluid" alt={title} style={{ height: '150px', objectFit: 'contain' }} />
          <div className="card-body">
            <h5 className="card-title" style={{ fontSize: '14px' }}>{title}</h5>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="container mt-5">
      {/* Search Bar */}
      <div className="mb-4">
        <input
          type="text"
          className="form-control"
          placeholder="Search for services..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      
      <div className="row">
        {filteredServices.length > 0 ? (
          filteredServices.map((service, index) => (
            <ServiceCard key={index} imageSrc={service.imageSrc} title={service.title} />
          ))
        ) : (
          <div className="col-12 text-center">
            <p>No services found</p>
          </div>
        )}
      </div>
    </div>
  );
}
