import React, { useState, useEffect } from 'react';
import axios from '../config/axios'; // Adjust the path as needed
import * as Yup from 'yup';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import { toast } from 'react-toastify';

const validationSchema = Yup.object({
    serviceProviderName: Yup.string().required('Service provider name is required'),
    address: Yup.string().required('Address is required'),
    phone: Yup.string().required('Phone number is required').matches(/^\d+$/, 'Phone number must be digits only'),
    profilePic: Yup.mixed()
        .required('Profile picture is required')
        .test('fileType', 'Image must be jpeg or png', value =>
            !value || ['image/jpeg', 'image/png'].includes(value.type)
        ),
    aadhaarPhoto: Yup.mixed()
        .required('Aadhaar photo is required')
        .test('fileType', 'Image must be jpeg or png', value =>
            !value || ['image/jpeg', 'image/png'].includes(value.type)
        ),
});

const ProviderProfile = () => {
    const [profileData, setProfileData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [serverErrors, setServerErrors] = useState({});

    useEffect(() => {
        const fetchProfileDetails = async () => {
            try {
                const response = await axios.get('/provider', {
                    headers: {
                        Authorization: localStorage.getItem('token')
                    }
                });
                const data = response.data;
                setProfileData(data);
            } catch (error) {
                console.error('Error fetching profile details:', error);
                toast.error('Failed to fetch profile details');
            } finally {
                setIsLoading(false);
            }
        };

        fetchProfileDetails();
    }, []);

    const handleSubmit = async (values, { setSubmitting }) => {
        setIsLoading(true);
        setServerErrors({}); // Clear previous server errors

        const formData = new FormData();
        formData.append('serviceProviderName', values.serviceProviderName);
        formData.append('address', values.address);
        formData.append('phone', values.phone);
        if (values.profilePic) formData.append('profilePic', values.profilePic);
        if (values.aadhaarPhoto) formData.append('aadhaarPhoto', values.aadhaarPhoto);

        try {
            const url = '/provider/profile'; // Use the appropriate URL
            const method = profileData ? 'put' : 'post'; // Decide based on the existence of profileData

            const response = await axios[method](url, formData, {
                headers: {
                    
                    Authorization: localStorage.getItem('token')
                }
            });

            setProfileData(response.data);
            toast.success('Profile saved successfully');
        } catch (error) {
            console.error('Error saving profile:', error);
            if (error.response && error.response.data) {
                // Set server errors to display
                setServerErrors(error.response.data.errors || { _error: 'Failed to save profile' });
                toast.error('Failed to save profile');
            }
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="container">
            <div className="row justify-content-center mt-5">
                <div className="col-md-6">
                    <h4 className="text-center">{profileData ? "Edit Profile" : "Create Profile"}</h4>
                    <Formik
                        enableReinitialize
                        initialValues={{
                            serviceProviderName: profileData?.serviceProviderName || '',
                            address: profileData?.address || '',
                            phone: profileData?.phone || '',
                            profilePic: null,
                            aadhaarPhoto: null
                        }}
                        validationSchema={validationSchema}
                        onSubmit={handleSubmit}
                    >
                        {({ setFieldValue, isSubmitting }) => (
                            <Form>
                                <div className="form-group">
                                    <label htmlFor="serviceProviderName"><strong>Service Provider Name:</strong></label>
                                    <Field
                                        type="text"
                                        name="serviceProviderName"
                                        className={`form-control`}
                                    />
                                    <ErrorMessage name="serviceProviderName" component="div" className="text-danger" />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="address"><strong>Address:</strong></label>
                                    <Field
                                        type="text"
                                        name="address"
                                        className={`form-control`}
                                    />
                                    <ErrorMessage name="address" component="div" className="text-danger" />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="phone"><strong>Phone:</strong></label>
                                    <Field
                                        type="text"
                                        name="phone"
                                        className={`form-control`}
                                    />
                                    <ErrorMessage name="phone" component="div" className="text-danger" />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="profilePic"><strong>Profile Picture:</strong></label>
                                    <input
                                        type="file"
                                        name="profilePic"
                                        onChange={(event) => setFieldValue('profilePic', event.currentTarget.files[0])}
                                        className="form-control-file"
                                    />
                                    <ErrorMessage name="profilePic" component="div" className="text-danger" />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="aadhaarPhoto"><strong>Aadhaar Photo:</strong></label>
                                    <input
                                        type="file"
                                        name="aadhaarPhoto"
                                        onChange={(event) => setFieldValue('aadhaarPhoto', event.currentTarget.files[0])}
                                        className="form-control-file"
                                    />
                                    <ErrorMessage name="aadhaarPhoto" component="div" className="text-danger" />
                                </div>

                                {serverErrors._error && (
                                    <div className="alert alert-danger">
                                        {serverErrors._error}
                                    </div>
                                )}

                        <button type="submit" className="btn btn-primary" disabled={isLoading}>
                            {profileData ? 'Update Profile' : 'Create Profile'}
                        </button>
                            </Form>
                        )}
                    </Formik>
                </div>
            </div>
        </div>
    );
};

export default ProviderProfile;
