import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';

const Booking = () => {
    const formik = useFormik({
        initialValues: {
            customerId: '',
            date: '',
            slot: '',
            address: '',
            description: ''
        },
        validationSchema: Yup.object({
            customerId: Yup.string().required('Customer ID is required'),
            date: Yup.date().required('Date is required'),
            slot: Yup.string().required('Slot is required'),
            address: Yup.string().required('Address is required'),
            description: Yup.string().required('Description is required')
        }),
        onSubmit: async (values) => {
            try {
                const response = await axios.post('/api/bookings', values);
                console.log('Booking created:', response.data);
            } catch (error) {
                console.error('Error creating booking:', error);
            }
        }
    });

    return (
        <form onSubmit={formik.handleSubmit}>
            <div>
                <label>Customer ID</label>
                <input
                    type="text"
                    name="customerId"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.customerId}
                />
                {formik.touched.customerId && formik.errors.customerId ? (
                    <div>{formik.errors.customerId}</div>
                ) : null}
            </div>

            <div>
                <label>Date</label>
                <input
                    type="date"
                    name="date"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.date}
                />
                {formik.touched.date && formik.errors.date ? (
                    <div>{formik.errors.date}</div>
                ) : null}
            </div>

            <div>
                <label>Slot</label>
                <input
                    type="text"
                    name="slot"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.slot}
                />
                {formik.touched.slot && formik.errors.slot ? (
                    <div>{formik.errors.slot}</div>
                ) : null}
            </div>

            <div>
                <label>Address</label>
                <input
                    type="text"
                    name="address"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.address}
                />
                {formik.touched.address && formik.errors.address ? (
                    <div>{formik.errors.address}</div>
                ) : null}
            </div>

            <div>
                <label>Description</label>
                <textarea
                    name="description"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.description}
                />
                {formik.touched.description && formik.errors.description ? (
                    <div>{formik.errors.description}</div>
                ) : null}
            </div>

            <button type="submit">Submit</button>
        </form>
    );
};

export default Booking
