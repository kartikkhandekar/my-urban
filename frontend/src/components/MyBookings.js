import React, { useState, useEffect } from 'react';
import axios from '../config/axios';
import NoBookings from './NoBookings';
import { Table, Button } from 'reactstrap';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

export default function MyBookings() {
    const [bookings, setBookings] = useState([]);
    const navigate = useNavigate();

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

    const updateBookingStatus = async (id, isAccepted, isRejected) => {
        try {
            await axios.put(`/booking/provider/${id}`, { isAccepted, isRejected }, {
                headers: {
                    Authorization: localStorage.getItem('token')
                }
            });
            toast.success(`Booking ${isAccepted ? 'accepted' : 'rejected'}`);
            fetchBookings(); // Optionally re-fetch bookings to update status
        } catch (error) {
            toast.error(`Error ${isAccepted ? 'accepting' : 'rejecting'} booking: ${error.message}`);
        }
    };

    const handleBooking = (book) => {
        if (book) {
            return book.amount / book.services[0].serviceId.price;
        }
    };

    const handleLoc = (lat, lng) => {
        navigate(`/map/${lat}/${lng}`);
    };

    return (
        <>
            {bookings.length !== 0 ? (
                <div className="container mt-5">
                    <h1 className="text-center mb-4">My Bookings</h1>
                    <Table striped>
                        <thead>
                            <tr>
                                <th className="text-center">Customer Name</th>
                                <th className="text-center">Customer Email</th>
                                <th className="text-center">Service Name</th>
                                <th className="text-center">Category</th>
                                <th className="text-center">Price</th>
                                <th className="text-center">Date</th>
                                <th className="text-center">Slot</th>
                                <th className="text-center">Status</th>
                                <th className="text-center">Booking</th>
                                <th className="text-center">View Address</th>
                                <th className="text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {bookings.map((booking) => {
                                const uniqueServices = booking.services.reduce((acc, service) => {
                                    const exists = acc.find(
                                        (s) => s.serviceId.servicename === service.serviceId.servicename
                                    );
                                    if (!exists) {
                                        acc.push(service);
                                    }
                                    return acc;
                                }, []);

                                return uniqueServices.map((service, index) => (
                                    <tr key={`${booking._id}-${index}`}>
                                        <td className="text-center">{booking.customerId.username}</td>
                                        <td className="text-center">{booking.customerId.email}</td>
                                        <td className="text-center">{service.serviceId.servicename}</td>
                                        <td className="text-center">{service.serviceId.category}</td>
                                        <td className="text-center">{booking.amount}</td>
                                        <td className="text-center">{new Date(booking.date).toLocaleDateString()}</td>
                                        <td className="text-center">{booking.slot}</td>
                                        <td className="text-center">
                                            {booking.isAccepted
                                                ? 'Accepted'
                                                : booking.isRejected
                                                ? 'Rejected'
                                                : 'Pending'}
                                        </td>
                                        <td className="text-center">{handleBooking(booking)}</td>
                                        <td className="text-center">
                                            {booking.lat && (
                                                <Button
                                                    color="primary"
                                                    onClick={() => handleLoc(booking.lat, booking.lng)}
                                                >
                                                    Show
                                                </Button>
                                            )}
                                        </td>
                                        <td className="text-center">
                                            <Button
                                                color="success"
                                                onClick={() => updateBookingStatus(booking._id, true, false)}
                                                disabled={booking.isAccepted || booking.isRejected}
                                            >
                                                Accept
                                            </Button>{' '}
                                            <Button
                                                color="danger"
                                                onClick={() => updateBookingStatus(booking._id, false, true)}
                                                disabled={booking.isAccepted || booking.isRejected}
                                            >
                                                Reject
                                            </Button>
                                        </td>
                                    </tr>
                                ));
                            })}
                        </tbody>
                    </Table>
                </div>
            ) : (
                <NoBookings />
            )}
        </>
    );
}
