import React, { useState, useEffect } from 'react';
import axios from '../config/axios';
import { Table, Container } from 'reactstrap';
import { toast } from 'react-toastify';
import '../CSS/AllProvider.css' 

export default function AllServiceAdmin() {
    const [services, setServices] = useState([]);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const response = await axios.get('/service/all',{
                headers:{
                    Authorization:localStorage.getItem('token')
                }
            });
            setServices(response.data)
        } catch (error) {
            console.log(error)
            toast.error('Failed to fetch users');
        }
    };

    

    return (
        <Container className="d-flex justify-content-center mt-5">
            <div className="table-responsive shadow p-3 mb-5 bg-white rounded">
                <Table striped bordered hover className="text-center">
                    <thead className="thead-dark">
                        <tr>
                        <th className="text-center" >Service Name</th>
                        <th className="text-center" >Service Provider</th>
                        <th className="text-center" >Email</th>
                        <th className="text-center" >Category</th>
                        <th className="text-center" >Price</th>
                        </tr>
                    </thead>
                    <tbody>
                    {services.map(service => (
                        <tr key={service._id}>
                            <td className="text-center" >{service.servicename}</td>
                            <td className="text-center" >{service.serviceProvider.username}</td>
                            <td className="text-center" >{service.serviceProvider.email}</td>
                            <td className="text-center" >{service.category}</td>
                            <td className="text-center" >{service.price}</td>
                        </tr>
                    ))}
                    </tbody>
                </Table>
            </div>
        </Container>
    );
}
