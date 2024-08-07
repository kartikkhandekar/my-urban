import React, { useState, useEffect } from 'react';
import axios from '../config/axios';
import NoBookings from './NoBookings';
import { Table, Button } from 'reactstrap';
import { toast } from 'react-toastify';

const MyBookings = () => {
    const [bookings, setBookings] = useState([]);

    useEffect(() => {
        fetchBookings();
    }, []);
   
    
    const fetchBookings = async () => {
        try {
            const response = await axios.get('/mybookings', {
                headers: {
                    Authorization: localStorage.getItem('token')
                }
            });
            setBookings(response.data);
        } catch (error) {
            console.error('Error fetching bookings:', error);
        }
    };

    const updateBookingStatus = async (id, isAccepted) => {
        try {
            await axios.put(`/booking/provider/${id}`, { isAccepted }, {
                headers: {
                    Authorization: localStorage.getItem('token')
                }
            });
            toast.success(`Booking ${isAccepted ? 'accepted' : 'rejected'}`);
            fetchBookings();
        } catch (error) {
           alert(`Error ${isAccepted ? 'accepting' : 'rejecting'} booking:`, error);
        }
    };
const handleBooking=(book)=>{
    
    if(book.amount === book.services[0].serviceId.price){
        return 1
    }else{
       return  (book.amount / book.services[0].serviceId.price)
    }
}

    return (
        <>
        {
            bookings.length !== 0  ? ( <div className="container mt-5">
             <h1 className="text-center mb-4">My Bookings</h1>
             <Table striped>
                 <thead>
                     <tr>
                         <th className="text-center" >Customer Name</th>
                         <th className="text-center" >Customer Email</th>
                         <th className="text-center">Service Name</th>
                         <th className="text-center">Category</th>
                         <th className="text-center">Price</th>
                         <th className="text-center">Date</th>
                         <th className="text-center">Slot</th>
                         <th className="text-center">Status</th>
                         <th className="text-center">Booking</th>
                         <th className="text-center">Actions</th>
                     </tr>
                 </thead>
                 <tbody>
                     {bookings.map((booking) => (
                         booking.services.map((service, index) => (
                             <tr key={`${booking._id}-${index}`}>
                                 <td className="text-center">{booking.customerId.username}</td>
                                 <td className="text-center">{booking.customerId.email}</td>
                                 <td className="text-center">{service.serviceId.servicename}</td>
                                 <td className="text-center">{service.serviceId.category}</td>
                                 <td className="text-center">{booking.amount}</td>
                                 <td className="text-center">{new Date(booking.date).toLocaleDateString()}</td>
                                 <td className="text-center">{booking.slot}</td>
                                 <td className="text-center">{booking.isAccepted ? 'Accepted' : 'Pending'}</td>
                                 <td className="text-center">{handleBooking(booking)}</td>
                                 <td className="text-center">
                                     <Button color="success" onClick={() => updateBookingStatus(booking._id, true)} disabled={booking.isAccepted}>Accept</Button>{' '}
                                     <Button color="danger" onClick={() => updateBookingStatus(booking._id, false)} disabled={!booking.isAccepted && service.isAccepted !== false}>Reject</Button>
                                 </td>
                             </tr>
                         ))
                     ))}
                 </tbody>
             </Table>
         </div>
            ):(<NoBookings/>)
        }
       </>
    );
}

export default MyBookings;
