import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
export default function AllService() {
 
   const [service,setService]=useState(null)

   const PackageCard = ({ title, rating, reviews, price, duration, details, editPackageLink }) => {
    const [toggle,setToggle]=useState(false)
    return (
      <div className="card mb-3">
        <div className="card-body">
          <h5 className="card-title">{title}</h5>
          <div className="d-flex align-items-center mb-2">
            <span className="mr-2">{rating}</span>
            <span>({reviews} reviews)</span>
          </div>
          <h6 className="card-subtitle mb-2 text-muted">₹{price} • {duration}</h6>
          <ul className="list-unstyled">
            {details.map((detail, index) => (
              <li key={index}><strong>{detail.title}:</strong> {detail.description}</li>
            ))}
          </ul>
          <div className="d-flex justify-content-between align-items-center">
            <button className="btn btn-primary">Add</button>
            <a href={editPackageLink} className="btn btn-outline-secondary">Edit your package</a>
          </div>
        </div>
      </div>
    );
  };
  
  const packages = [
    {
      title: "Make your own package - roll on special",
      rating: "4.84",
      reviews: "928.5K",
      price: "999",
      duration: "55 mins",
      details: [
        { title: "Manicure", description: "Elysian British Rose manicure" },
        { title: "Hair color + Hair oil massage + Hair spa", description: "Head Massage" }
      ],
      editPackageLink: "#"
    },
    {
      title: "Full arms + full legs + underarms waxing",
      rating: "4.86",
      reviews: "107.5K",
      price: "1,199",
      duration: "55 mins",
      details: [
        { title: "Waxing (Chocolate Roll-on)", description: "Full arms (including underarms) (chocolate roll-on) + Full Legs chocolate roll-on" }
      ],
      editPackageLink: "#"
    }
  ];
   return (
    <div>
      <h1>Service</h1>
      {packages.map((pkg, index) => (
        <PackageCard key={index} {...pkg} />
      ))}
    </div>
   )
}












