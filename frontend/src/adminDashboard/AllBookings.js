import React, { useState, useEffect } from 'react';
import axios from '../config/axios';
import { Table } from 'reactstrap';
import { toast } from 'react-toastify';
import '../CSS/AllProvider.css' 

export default function AllBookings() {
    const [bookings, setBookings] = useState([]);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const response = await axios.get('/booking',{
                headers:{
                    Authorization:localStorage.getItem('token')
                }
            });
            setBookings(response.data);
        } catch (error) {
            console.log(error)
            toast.error('Failed to fetch users');
        }
    };

    const handleBooking = (book) => {
        if(book){
            return  book.amount / book.services[0].serviceId.price
        }
    }

    return (
       
            <div className="container mt-5" >
                <Table >
                    <thead striped >
                    <tr>
                        <th className="text-center">Customer Name</th>
                        <th className="text-center">Customer Email</th>
                        <th className="text-center">Service Name</th>
                        <th className="text-center">Category</th>
                        <th className="text-center">Price</th>
                        <th className="text-center">Date</th>
                        <th className="text-center">Slot</th>
                        <th className="text-center">Status</th>
                        <th className="text-center">Payment-Status</th>
                        <th className="text-center">Booking</th>
                    </tr>
                        </thead>
                        <tbody>
                            {bookings.map((booking) => {
                                const uniqueServices = booking.services.reduce((acc, service) => {
                                    const exists = acc.find(
                                        (s) => s.serviceId.servicename === service.serviceId.servicename
                                    )
                                    if (!exists) {
                                        acc.push(service)
                                    }
                                    return acc
                                }, [])

                                return uniqueServices.map((service, index) => (
                                    <tr key={`${booking._id}-${index}`}>
                                        <td className="text-center">{booking.customerId.username}</td>
                                        <td className="text-center">{booking.customerId.email}</td>
                                        <td className="text-center">{service.serviceId.servicename}</td>
                                        <td className="text-center">{service.serviceId.category}</td>
                                        <td className="text-center">{booking.amount}</td>
                                        <td className="text-center">{new Date(booking.date).toLocaleDateString()}</td>
                                        <td className="text-center">{booking.slot}</td>
                                        <td className="text-center">{booking.isAccepted ? 'Accepted' : 'Pending'}</td>
                                        <td className="text-center">{booking.paymentStatus}</td>
                                        <td className="text-center">{handleBooking(booking)}</td>
                                       
                                    </tr>
                                ))
                            })}
                    </tbody>
                </Table>
            </div>
      
    )
}
