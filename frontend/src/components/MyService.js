// import React, { useEffect, useState } from 'react';
// import axios from '../config/axios';
// import { useNavigate } from 'react-router-dom';
// import { toast } from 'react-toastify';

// export default function MyService(){
//     const [services, setServices] = useState([])
//     const navigate=useNavigate()
//     useEffect(() => {
//         fetchServices()
//     }, [])

//     const fetchServices = async () => {
//         try {
//             const response = await axios.get('/service',{
//                 headers:{
//                     Authorization:localStorage.getItem('token')
//                 }
//             })
//             setServices(response.data);
//         } catch (error) {
//             toast.error('Error fetching services')
//         }
//     };

//     const handleDelete = async (serviceId) => {
//         try {
//             await axios.delete(`/service/${serviceId}`,{
//                 headers: {
//                     Authorization: localStorage.getItem('token')
//                   },
//             })
//             setServices(services.filter(service => service._id !== serviceId))
//             toast.success('Service deleted successfully')
//         } catch (error) {
//             console.log(error)
//             toast.error('Error deleting service')
//         }
//     };

//     const handleAdd = () => {
//         navigate('/service')
//     };

//     const handleUpdate = async(serviceId) => {
//        navigate(`/update/${serviceId}`)
//     };

//     return (
//         <div className="container">
//             <h2>My Services</h2>
//             <button className="btn btn-primary mb-3" onClick={handleAdd}>Add Service</button>
//             <table className="table table-bordered">
//                 <thead>
//                     <tr>
//                         <th className="text-center" >Service Name</th>
//                         <th className="text-center" >Service Provider</th>
//                         <th className="text-center" >Email</th>
//                         <th className="text-center" >Category</th>
//                         <th className="text-center" >Price</th>
//                         <th className="text-center" >Actions</th>
//                     </tr>
//                 </thead>
//                 <tbody>
//                     {services.map(service => (
//                         <tr key={service._id}>
//                             <td className="text-center" >{service.servicename}</td>
//                             <td className="text-center" >{service.serviceProvider.username}</td>
//                             <td className="text-center" >{service.serviceProvider.email}</td>
//                             <td className="text-center" >{service.category}</td>
//                             <td className="text-center" >{service.price}</td>
//                             <td className="text-center" >
//                                 <button className="btn btn-warning mr-2" onClick={() => handleUpdate(service._id)}>Update</button>
//                                 <button className="btn btn-danger" onClick={() => handleDelete(service._id)}>Delete</button>
//                             </td>
//                         </tr>
//                     ))}
//                 </tbody>
//             </table>
//         </div>
//     )
// }



import React, { useEffect, useState } from 'react';
import axios from '../config/axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

export default function MyService() {
    const [services, setServices] = useState([]);
    const [sortBy, setSortBy] = useState('servicename');
    const [order, setOrder] = useState('asc');
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(5);
    const [totalPages, setTotalPages] = useState(1);
    const navigate = useNavigate();

    useEffect(() => {
        fetchServices();
    }, [sortBy, order, page, limit]);

    const fetchServices = async () => {
        try {
            const response = await axios.get('/service', {
                params: {
                    sortBy,
                    order,
                    page,
                    limit
                },
                headers: {
                    Authorization: localStorage.getItem('token')
                }
            });
            setServices(response.data.services);
            setTotalPages(response.data.totalPages);
        } catch (error) {
            toast.error('Error fetching services');
        }
    };

    const handleDelete = async (serviceId) => {
        try {
            await axios.delete(`/service/${serviceId}`, {
                headers: {
                    Authorization: localStorage.getItem('token')
                }
            });
            setServices(services.filter(service => service._id !== serviceId));
            toast.success('Service deleted successfully');
        } catch (error) {
            toast.error('Error deleting service');
        }
    };

    const handleAdd = () => {
        navigate('/service');
    };

    const handleUpdate = async (serviceId) => {
        navigate(`/update/${serviceId}`);
    };

    const handleSortChange = (event) => {
        const [field, direction] = event.target.value.split(':');
        setSortBy(field);
        setOrder(direction);
        setPage(1); // Reset to first page on sort change
    };

    const handlePageChange = (newPage) => {
        setPage(newPage);
    };

   

    const pageNumbers = [...Array(totalPages).keys()].map(num => num + 1);

    return (
        <div className="container mt-4">
            <h2 className="mb-4">My Services</h2>
            <div className="d-flex justify-content-between mb-4">
                <button className="btn btn-primary" onClick={handleAdd}>Add Service</button>

                {/* Sorting Controls */}
                <div>
                    <label htmlFor="sortBy" className="form-label me-2">Sort By:</label>
                    <select id="sortBy" className="form-select d-inline-block w-auto" onChange={handleSortChange} value={`${sortBy}:${order}`}>
                        <option value="servicename:asc">Service Name (A-Z)</option>
                        <option value="servicename:desc">Service Name (Z-A)</option>
                        <option value="price:asc">Price (Low to High)</option>
                        <option value="price:desc">Price (High to Low)</option>
                    </select>
                </div>
            </div>

            <table className="table table-bordered">
                <thead>
                    <tr>
                        <th className="text-center">Service Name</th>
                        <th className="text-center">Service Provider</th>
                        <th className="text-center">Email</th>
                        <th className="text-center">Category</th>
                        <th className="text-center">Price</th>
                        <th className="text-center">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {services.map(service => (
                        <tr key={service._id}>
                            <td className="text-center">{service.servicename}</td>
                            <td className="text-center">{service.serviceProvider.username}</td>
                            <td className="text-center">{service.serviceProvider.email}</td>
                            <td className="text-center">{service.category}</td>
                            <td className="text-center">{service.price}</td>
                            <td className="text-center">
                                <button className="btn btn-warning me-2" onClick={() => handleUpdate(service._id)}>Update</button>
                                <button className="btn btn-danger" onClick={() => handleDelete(service._id)}>Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <div className="d-flex justify-content-between align-items-center mb-3">
               
                <div>
                    <button
                        className="btn btn-secondary me-2"
                        disabled={page === 1}
                        onClick={() => handlePageChange(page - 1)}
                    >
                        Previous
                    </button>
                    {pageNumbers.map(number => (
                        <button
                            key={number}
                            className={`btn btn-outline-secondary mx-1 ${number === page ? 'active' : ''}`}
                            onClick={() => handlePageChange(number)}
                        >
                            {number}
                        </button>
                    ))}
                    <button
                        className="btn btn-secondary ms-2"
                        disabled={page === totalPages}
                        onClick={() => handlePageChange(page + 1)}
                    >
                        Next
                    </button>
                </div>
            </div>
        </div>
    );
}
