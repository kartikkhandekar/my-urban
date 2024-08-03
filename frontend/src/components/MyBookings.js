import React, { useState, useEffect } from 'react';
import axios from '../config/axios';
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

    return (
        <div className="container mt-5">
            <h1 className="text-center mb-4">My Bookings</h1>
            <Table striped>
                <thead>
                    <tr>
                        <th>Customer Name</th>
                        <th>Customer Email</th>
                        <th>Service Name</th>
                        <th>Category</th>
                        <th>Price</th>
                        <th>Date</th>
                        <th>Slot</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {bookings.map((booking) => (
                        booking.services.map((service, index) => (
                            <tr key={`${booking._id}-${index}`}>
                                <td>{booking.customerId.username}</td>
                                <td>{booking.customerId.email}</td>
                                <td>{service.serviceId.servicename}</td>
                                <td>{service.serviceId.category}</td>
                                <td>{service.serviceId.price}</td>
                                <td>{new Date(booking.date).toLocaleDateString()}</td>
                                <td>{booking.slot}</td>
                                <td>{booking.isAccepted ? 'Accepted' : 'Pending'}</td>
                                <td>
                                    <Button color="success" onClick={() => updateBookingStatus(booking._id, true)} disabled={booking.isAccepted}>Accept</Button>{' '}
                                    <Button color="danger" onClick={() => updateBookingStatus(booking._id, false)} disabled={!booking.isAccepted && service.isAccepted !== false}>Reject</Button>
                                </td>
                            </tr>
                        ))
                    ))}
                </tbody>
            </Table>
        </div>
    );
}

export default MyBookings;
