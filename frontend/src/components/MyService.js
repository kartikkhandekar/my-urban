import React, { useEffect, useState } from 'react';
import axios from '../config/axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

export default function MyService(){
    const [services, setServices] = useState([]);
    const navigate=useNavigate()
    useEffect(() => {
        fetchServices();
    }, []);

    const fetchServices = async () => {
        try {
            const response = await axios.get('/service',{
                headers:{
                    Authorization:localStorage.getItem('token')
                }
            });
            setServices(response.data);
        } catch (error) {
            toast.error('Error fetching services');
        }
    };

    const handleDelete = async (serviceId) => {
        try {
            await axios.delete(`/service/${serviceId}`,{
                headers:{
                    Authorization:localStorage.getItem('token')
                }
            });
            setServices(services.filter(service => service._id !== serviceId));
            toast.success('Service deleted successfully');
        } catch (error) {
            toast.error('Error deleting service');
        }
    };

    const handleAdd = () => {
        navigate('/service')
    };

    const handleUpdate = async(serviceId) => {
       navigate(`/update/${serviceId}`)
    };

    return (
        <div className="container">
            <h2>My Services</h2>
            <button className="btn btn-primary mb-3" onClick={handleAdd}>Add Service</button>
            <table className="table table-bordered">
                <thead>
                    <tr>
                        <th className="text-center" >Service Name</th>
                        <th className="text-center" >Service Provider</th>
                        <th className="text-center" >Email</th>
                        <th className="text-center" >Category</th>
                        <th className="text-center" >Price</th>
                        <th className="text-center" >Actions</th>
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
                            <td className="text-center" >
                                <button className="btn btn-warning mr-2" onClick={() => handleUpdate(service._id)}>Update</button>
                                <button className="btn btn-danger" onClick={() => handleDelete(service._id)}>Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};


