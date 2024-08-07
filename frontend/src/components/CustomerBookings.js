// import React, { useState, useEffect } from 'react'
// import axios from '../config/axios'
// import { Table, Button } from 'reactstrap'
// import { toast } from 'react-toastify'

// const CustomerBookings = () => {
//     const [bookings, setBookings] = useState([])

//     useEffect(() => {
//         fetchBookings()
//     }, [])
    
//     useEffect(()=>{

//     },[])
//     const fetchBookings = async () => {
//         try {
//             const response = await axios.get('/customer-bookings', {
//                 headers: {
//                     Authorization: localStorage.getItem('token')
//                 }
//             });
//             setBookings(response.data);
//         } catch (error) {
//             console.error('Error fetching bookings:', error)
//         }
//     };

//     const updateBookingStatus = async (id, status) => {
//         try {
//             await axios.put(`/update-booking-status/${id}`, { status }, {
//                 headers: {
//                     Authorization: localStorage.getItem('token')
//                 }
//             });
//             toast.success(`Booking ${status}`)
    
//             fetchBookings()
//         } catch (error) {
//             toast.error(` ${error.response.data.errors}`)
//         }
//     };

//     const handlePaymentClick = async (id, amount) => {
//         try {
//             const response = await axios.post(`/payment/${id}`, { amount }, {
//                 headers: {
//                     Authorization: localStorage.getItem('token')
//                 }
//             })
//             localStorage.setItem('stripeId', response.data.id);
//             window.location = response.data.url
//         } catch (err) {
//             console.log(err)
//         }
//     };

//     const getButtonDetails = (status) => {
//         if (status === 'pending') {
//             return { text: 'Complete', color: 'success', newStatus: 'completed' }
//         } else if (status === 'completed') {
//             return { text: 'Payment', color: 'info', newStatus: 'payment' }
//         }
//         return { text: '', color: 'secondary', newStatus: '' }
//     };

//     // Function to concatenate service names
//     const getServiceNames = (services) => {
//         return services.map(service => service.serviceId.servicename).join(', ')
//     };

//     return (
//         <div className="container mt-5">
//             <h1 className="text-center mb-4">My Bookings</h1>
//             <Table striped>
//                 <thead>
//                     <tr>
//                         <th>ServiceProvider Name</th>
//                         <th>Service Name</th>
//                         <th>Date</th>
//                         <th>Slot</th>
//                         <th>Amount</th>
//                         <th>Status</th>
//                         <th>Actions</th>
//                     </tr>
//                 </thead>
//                 <tbody>
//                     {bookings.map((booking) => {
//                         const { text, color, newStatus } = getButtonDetails(booking.status)
//                         return (
//                             <tr key={booking._id}>
//                                 <td>{booking.services[0].serviceProviderId.username}</td>
//                                 <td>{getServiceNames(booking.services)}</td>
//                                 <td>{new Date(booking.date).toLocaleDateString()}</td>
//                                 <td>{booking.slot}</td>
//                                 <td>{booking.amount}</td>
//                                 <td>{booking.status}</td>
//                                 <td>
//                                     {text && (
//                                         <Button
//                                             color={color}
//                                             onClick={() => {
//                                                 if (newStatus === 'payment') {
//                                                     handlePaymentClick(booking._id, booking.amount)
//                                                 } else {
//                                                     updateBookingStatus(booking._id, newStatus)
//                                                 }
//                                             }}
//                                             disabled={booking.status === 'payment'}
//                                         >
//                                             {text}
//                                         </Button>
//                                     )}
//                                 </td>
//                             </tr>
//                         );
//                     })}
//                 </tbody>
//             </Table>
//         </div>
//     );
// };

// export default CustomerBookings;


import React, { useState, useEffect } from 'react';
import axios from '../config/axios';
import { Table, Button } from 'reactstrap';
import { toast } from 'react-toastify';

const CustomerBookings = () => {
    const [bookings, setBookings] = useState([]);

    useEffect(() => {
        fetchBookings();
    }, []);

    const fetchBookings = async () => {
        try {
            const response = await axios.get('/customer-bookings', {
                headers: {
                    Authorization: localStorage.getItem('token')
                }
            });
            setBookings(response.data);
        } catch (error) {
            console.error('Error fetching bookings:', error);
        }
    };

    const updateBookingStatus = async (id, status) => {
        try {
            await axios.put(`/update-booking-status/${id}`, { status }, {
                headers: {
                    Authorization: localStorage.getItem('token')
                }
            });
            toast.success(`Booking ${status}`);
            fetchBookings();
        } catch (error) {
            toast.error(` ${error.response.data.errors}`);
        }
    };

    const handlePaymentClick = async (id, amount) => {
        try {
            const response = await axios.post(`/payment/${id}`, { amount }, {
                headers: {
                    Authorization: localStorage.getItem('token')
                }
            });
            localStorage.setItem('stripeId', response.data.id);
            window.location = response.data.url;
        } catch (err) {
            console.log(err);
        }
    };

    const getButtonDetails = (status, paymentStatus) => {
        if (status === 'pending') {
            return { text: 'Complete', color: 'success', newStatus: 'completed' };
        } else if (status === 'completed' && paymentStatus === 'Successful') {
            return { text: 'Review', color: 'primary', newStatus: 'review' };
        } else if (status === 'completed') {
            return { text: 'Payment', color: 'info', newStatus: 'payment' };
        }
        return { text: '', color: 'secondary', newStatus: '' };
    };

   

    return (
        <div className="container mt-5">
            <h1 className="text-center mb-4">My Bookings</h1>
            <Table striped>
                <thead>
                    <tr>
                        <th className="text-center" >ServiceProvider Name</th>
                        <th className="text-center" >Service Name</th>
                        <th className="text-center" >Date</th>
                        <th className="text-center" >Slot</th>
                        <th className="text-center" >Amount</th>
                        <th className="text-center" >Payment Status</th>
                        <th className="text-center" >Service Status</th>
                        <th className="text-center" >Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {bookings.map((booking) => {
                        const { text, color, newStatus } = getButtonDetails(booking.status, booking.paymentStatus);
                        return (
                            <tr key={booking._id}>
                                <td className="text-center" >{booking.services[0].serviceProviderId.username}</td>
                                <td className="text-center" >{booking.services[0].serviceId.servicename}</td>
                                <td className="text-center" >{new Date(booking.date).toLocaleDateString()}</td>
                                <td className="text-center" >{booking.slot}</td>
                                <td className="text-center" >{booking.amount}</td>
                                <td className="text-center" >{booking.paymentStatus}</td>
                                <td className="text-center" >{booking.status}</td>
                                <td className="text-center" >
                                    {text && (
                                        <Button
                                            color={color}
                                            onClick={() => {
                                                if (newStatus === 'payment') {
                                                    handlePaymentClick(booking._id, booking.amount);
                                                } else if (newStatus === 'review') {
                                                    toast.success("Redirecting to review page");
                                                    // window.location = `/review/${booking._id}`; // Example redirect
                                                } else {
                                                    updateBookingStatus(booking._id, newStatus);
                                                }
                                            }}
                                            disabled={booking.paymentStatus === 'review'}
                                        >
                                            {text}
                                        </Button>
                                    )}
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </Table>
        </div>
    );
};

export default CustomerBookings;
