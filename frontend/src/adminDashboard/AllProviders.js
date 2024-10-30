import React, { useState, useEffect } from 'react';
import axios from '../config/axios';
import { Table, Button, Container } from 'reactstrap';
import { toast } from 'react-toastify';
import '../CSS/AllProvider.css' 

export default function AllProviders() {
    const [users, setUsers] = useState([]);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const response = await axios.get('/users/all');
            setUsers(response.data);
        } catch (error) {
            toast.error('Failed to fetch users');
        }
    };

    const handleAction = async (userId, accept,reject) => {
        try {
            if(accept) {
                await axios.post(`/verify-providers`,{userId,accept,reject},{
                    headers:{
                        Authorization:localStorage.getItem('token')
                    }
                });
                toast.success(`User accepted successfully`);
                fetchUsers();
            } else {
                await axios.post(`/reject-providers`,{userId,accept,reject},{
                    headers:{
                        Authorization:localStorage.getItem('token')
                    }
                });
                toast.success(`User rejected successfully`);
                fetchUsers();
            }
        } catch (error) {
            console.log(error)
            toast.error('Action failed');
        }
    };

    return (
        <Container className="d-flex justify-content-center mt-5">
            <div className="table-responsive shadow p-3 mb-5 bg-white rounded">
                <Table striped bordered hover className="text-center">
                    <thead className="thead-dark">
                        <tr>
                            <th>#</th>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Role</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((user, index) => (
                            <tr key={user._id}>
                                <th scope="row">{index + 1}</th>
                                <td>{user.username}</td>
                                <td>{user.email}</td>
                                <td>{user.role}</td>
                                <td>
                                    {user.role === 'service-provider' && (
                                        <>
                                            <Button 
                                                color="success" 
                                                onClick={() => handleAction(user._id, true,false)}
                                                disabled={user.isVerified}>
                                                Accept
                                            </Button>
                                            {' '}
                                            <Button 
                                                color="danger" 
                                                onClick={() => handleAction(user._id, false,true)}
                                                disabled={user.isRejected}>
                                                Reject
                                            </Button>
                                        </>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </div>
        </Container>
    );
}
