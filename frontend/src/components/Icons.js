import React from 'react';

export default function Icons() {

const ServiceCard = ({ imageSrc, title }) => {
  return (
    <div className="col-md-4 mb-4">
      <div className="card text-center">
        <img src={imageSrc} className="card-img-top" alt={title} />
        <div className="card-body">
          <h5 className="card-title">{title}</h5>
        </div>
      </div>
    </div>
  );
};


const services = [
  { imageSrc: '', title: "Women's Salon & Spa" },
  { imageSrc: '/path/to/men-salon.png', title: "Men's Salon & Massage" },
  { imageSrc: '/path/to/ac-repair.png', title: 'AC & Appliance Repair' },
  { imageSrc: '/path/to/cleaning.png', title: 'Cleaning & Pest Control' },
  { imageSrc: '/path/to/electrician.png', title: 'Electrician, Plumber & Carpenter' },
  { imageSrc: '/path/to/water-purifier.png', title: 'Native Water Purifier' },
  { imageSrc: '/path/to/smart-locks.png', title: 'Native Smart Locks' },
  { imageSrc: '/path/to/painting.png', title: 'Painting & Decor' }
];


  return (
    <div className="container mt-5">
      <div className="row">
        {services.map((service, index) => (
          <ServiceCard key={index} imageSrc={service.imageSrc} title={service.title}  />
        ))}
      </div>
    </div>
  );
};


