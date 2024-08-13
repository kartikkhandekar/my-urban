

import React, { useState, useEffect } from 'react';
import axios from '../config/axios';
import NoBookings from './NoBookings';
import { Card, CardBody, CardTitle, CardText, Button, Row, Col } from 'reactstrap';
import { toast } from 'react-toastify';
import RatingModal from './RatingModel'; 

export default function CustomerBookings () {
    const [bookings, setBookings] = useState([])
    const [selectedBooking, setSelectedBooking] = useState(null)    
    const [modalOpen, setModalOpen] = useState(false)

    useEffect(() => {
        fetchBookings()
    }, [])

    const fetchBookings = async () => {
        try {
            const response = await axios.get('/customer-bookings', {
                headers: {
                    Authorization: localStorage.getItem('token')
                }
            });
            setBookings(response.data);
        } catch (error) {
            console.error('Error fetching bookings:', error)
        }
    }

    const updateBookingStatus = async (id, status) => {
        try {
            await axios.put(`/update-booking-status/${id}`, { status }, {
                headers: {
                    Authorization: localStorage.getItem('token')
                }
            });
            toast.success(`Booking ${status}`)
            fetchBookings()
        } catch (error) {
            toast.error(` ${error.response.data.errors}`)
        }
    }

    const handlePaymentClick = async (id, amount) => {
        try {
            const response = await axios.post(`/payment/${id}`, { amount }, {
                headers: {
                    Authorization: localStorage.getItem('token')
                }
            });
            localStorage.setItem('stripeId', response.data.id)
            window.location = response.data.url;
        } catch (err) {
            console.log(err)
        }
    };

    if (bookings.length === 0) {
        return <NoBookings />
    }

    const getButtonDetails = (status, paymentStatus) => {
        if (status === 'pending') {
            return { text: 'Complete', color: 'success', newStatus: 'completed' }
        } else if (status === 'completed' && paymentStatus === 'Successful') {
            return { text: 'Review', color: 'primary', newStatus: 'review' }
        } else if (status === 'completed') {
            return { text: 'Payment', color: 'info', newStatus: 'payment' }
        }
        return { text: '', color: 'secondary', newStatus: '' }
    }

    const handleReviewClick = (booking) => {
        setSelectedBooking(booking);
        setModalOpen(true);
    }

    return (
        <div className="container mt-5">
            <h1 className="text-center mb-4">My Bookings</h1>
            <Row>
                {bookings.map((booking) => {
                    const { text, color, newStatus } = getButtonDetails(booking.status, booking.paymentStatus)

                    return (
                        <Col sm="6" lg="4" className="mb-4" key={booking._id}>
                            <Card className="shadow-sm h-100">
                                <CardBody>
                                    <CardTitle tag="h5" className="text-center">{booking.services[0].serviceId.servicename}</CardTitle>
                                    <CardText>
                                        <strong>Provider:</strong> {booking.services[0].serviceProviderId.username}<br />
                                        <strong>Date:</strong> {new Date(booking.date).toLocaleDateString()}<br />
                                        <strong>Slot:</strong> {booking.slot}<br />
                                        <strong>Amount:</strong> ₹{booking.amount}<br />
                                        <strong>Payment Status:</strong> {booking.paymentStatus}<br />
                                        <strong>Service Status:</strong> {booking.status}
                                    </CardText>
                                    {!booking.isReview && text && (
                                        <Button
                                            color={color}
                                            className="w-100"
                                            onClick={() => {
                                                if (newStatus === 'payment') {
                                                    handlePaymentClick(booking._id, booking.amount)
                                                } else if (newStatus === 'review') {
                                                    handleReviewClick(booking);
                                                } else {
                                                    updateBookingStatus(booking._id, newStatus)
                                                }
                                            }}
                                            disabled={booking.paymentStatus === 'review'}
                                        >
                                            {text}
                                        </Button>
                                    )}
                                </CardBody>
                            </Card>
                        </Col>
                    )
                })}
            </Row>

            {selectedBooking && (
                <RatingModal
                    isOpen={modalOpen}
                    toggle={() => setModalOpen(!modalOpen)}
                    booking={selectedBooking}
                    onSubmit={() => {
                        fetchBookings()
                        setModalOpen(false)
                    }}
                />
            )}
        </div>
    )
}


