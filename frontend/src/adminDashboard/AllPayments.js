import React, { useState, useEffect } from 'react';
import axios from '../config/axios'; // Update the path if necessary
import { Table, Container } from 'reactstrap';
import { toast } from 'react-toastify';
//import './AllPayments.css'; // Optional: Create this file for custom styling

export default function AllPayments() {
    const [payments, setPayments] = useState([]);

    useEffect(() => {
        fetchPayments();
    }, []);

    const fetchPayments = async () => {
        try {
            const response = await axios.get('/payment',{
                headers:{Authorization:localStorage.getItem('token')}
            });
            setPayments(response.data);
        } catch (error) {
            toast.error('Failed to fetch payments');
        }
    }
    console.log(payments)

    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    return (
        <Container className="d-flex justify-content-center mt-5">
            <div className="table-responsive shadow p-3 mb-5 bg-white rounded">
                <Table striped bordered hover className="text-center">
                    <thead className="thead-dark">
                        <tr>
                            <th>#</th>
                            <th>Payment ID</th>
                            <th>Amount</th>
                            <th>Method</th>
                            <th>Status</th>
                            <th>Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        {payments.map((payment, index) => (
                            <tr key={payment._id}>
                                <th scope="row">{index + 1}</th>
                                <td>{payment._id}</td>
                                <td>₹{payment.amount.toFixed(2)}</td>
                                <td>{payment.paymentType}</td>
                                <td>{payment.paymentStatus}</td>
                                <td>{formatDate(payment.createdAt)}</td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </div>
        </Container>
    );
}
