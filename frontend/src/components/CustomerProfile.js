import React, { useState, useEffect } from 'react';
import axios from '../config/axios';
import * as Yup from 'yup';
import { toast } from 'react-toastify';

const CustomerProfile = () => {
    const [form, setForm] = useState({
        name: '',
        address: '',
        phone: '',
        profilePic: null,
    });

    const [profileData, setProfileData] = useState(null);
    const [errors, setErrors] = useState({});
    const [serverErrors, setServerErrors] = useState({});
    const [isProfileCreated, setIsProfileCreated] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const fetchProfileDetails = async () => {
            setIsLoading(true);
            try {
                const response = await axios.get('/customer', {
                    headers: {
                        Authorization: localStorage.getItem('token')
                    }
                });
                const data = response.data;

                if (data) {
                    setProfileData(data);
                    setForm({
                        name: data.name || '',
                        address: data.address || '',
                        phone: data.phone || '',
                        profilePic: null,
                    });

                    setIsProfileCreated(true);
                } else {
                    setIsProfileCreated(false);
                    setForm({
                        name: '',
                        address: '',
                        phone: '',
                        profilePic: null,
                    });
                }
            } catch (error) {
                console.error('Error fetching profile details:', error);
                setIsProfileCreated(false);
            } finally {
                setIsLoading(false);
            }
        };

        fetchProfileDetails();
    }, []);

    // Validation schema
    const validationSchema = Yup.object().shape({
        name: Yup.string().required('Name is required'),
        address: Yup.string().required('Address is required'),
        phone: Yup.string().required('Phone number is required'),
        profilePic: Yup.mixed()
            .required('Profile picture is required')
            .test('fileType', 'Image must be jpeg or png', value =>
                !value || ['image/jpeg', 'image/png'].includes(value.type)
            ),
    });

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors({});
        setServerErrors({});

        try {
            // Validate form data
            await validationSchema.validate(form, { abortEarly: false });

            setIsLoading(true);

            const formData = new FormData();
            formData.append('name', form.name);
            formData.append('address', form.address);
            formData.append('phone', form.phone);
            if (form.profilePic) formData.append('profilePic', form.profilePic);

            const config = {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: localStorage.getItem('token')
                }
            };

            const url = isProfileCreated ? '/customer/profile' : '/customer/profile';
            const method = isProfileCreated ? 'put' : 'post';

            const response = await axios[method](url, formData, config);

            setProfileData(response.data);
            toast.success('Profile saved successfully');
        } catch (error) {
            if (error.response) {
                // Detailed error handling
                console.error('Error response:', error.response.data);
                setServerErrors(error.response.data.errors || { _error: 'Failed to save profile' });
            } else if (error.inner) {
                // Handle Yup validation errors
                const formErrors = {};
                error.inner.forEach(err => {
                    formErrors[err.path] = err.message;
                });
                setErrors(formErrors);
            } else {
                console.error('Error saving profile:', error.message);
                setServerErrors({ _error: 'Failed to save profile' });
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setForm({
            ...form,
            [name]: value
        });
    };

    const handleFileChange = (e) => {
        const { name, files } = e.target;
        setForm({
            ...form,
            [name]: files[0]
        });
    };

    return (
        <div className="container">
            <div className="row justify-content-center mt-5">
                <div className="col-md-6">
                    <h4 className="text-center">{isProfileCreated ? "Edit Profile" : "Create Profile"}</h4>
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label htmlFor="name"><strong>Name:</strong></label>
                            <input
                                type="text"
                                name="name"
                                value={form.name}
                                onChange={handleInputChange}
                                className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                                disabled={isLoading}
                            />
                            {errors.name && <div className="invalid-feedback">{errors.name}</div>}
                        </div>

                        <div className="form-group">
                            <label htmlFor="address"><strong>Address:</strong></label>
                            <input
                                type="text"
                                name="address"
                                value={form.address}
                                onChange={handleInputChange}
                                className={`form-control ${errors.address ? 'is-invalid' : ''}`}
                                disabled={isLoading}
                            />
                            {errors.address && <div className="invalid-feedback">{errors.address}</div>}
                        </div>
                        <div className="form-group">
                            <label htmlFor="phone"><strong>Phone:</strong></label>
                            <input
                                type="text"
                                name="phone"
                                value={form.phone}
                                onChange={handleInputChange}
                                className={`form-control ${errors.phone ? 'is-invalid' : ''}`}
                                disabled={isLoading}
                            />
                            {errors.phone && <div className="invalid-feedback">{errors.phone}</div>}
                        </div>
                       
                        <div className="form-group">
                            <label htmlFor="profilePic"><strong>Profile Picture:</strong></label> <br/>
                            <input
                                type="file"
                                name="profilePic"
                                onChange={handleFileChange}
                                className={`form-control-file ${errors.profilePic ? 'is-invalid' : ''}`}
                                disabled={isLoading}
                            />
                            {errors.profilePic && <div className="invalid-feedback">{errors.profilePic}</div>}
                        </div>
                       
                        {serverErrors._error && <div className="alert alert-danger">{serverErrors._error}</div>}
                        <button type="submit" className="btn btn-primary" disabled={isLoading}>
                            {isProfileCreated ? 'Update Profile' : 'Create Profile'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default CustomerProfile;
