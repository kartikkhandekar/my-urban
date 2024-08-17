

import React, { useEffect, useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';
import axios from '../config/axios';
import { Form, FormGroup, Label, Input, Button, FormFeedback, InputGroup, InputGroupText } from 'reactstrap';
import { toast } from 'react-toastify';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

import markerImage from '../assets/images/marker.jpg';

export default function Booking() {
    const navigate = useNavigate();
    const [availableSlots, setAvailableSlots] = useState([]);
    const [mapPosition, setMapPosition] = useState(null);
    const [serverError,setServerError]=useState(null)
    const customIcon = L.icon({
        iconUrl: markerImage,
        iconSize: [38, 38],
        iconAnchor: [19, 38],
        popupAnchor: [0, -38]
    });

    const formik = useFormik({
        initialValues: {
            date: '',
            slot: '',
            address: '',
            description: '',
            lat: '',
            lng: ''
        },
        validationSchema: Yup.object({
            date: Yup.date()
                .required('Date is required')
                .test('date-not-in-past', 'Date cannot be in the past', value => {
                    const today = new Date();
                    today.setHours(0, 0, 0, 0);
                    const selectedDate = new Date(value);
                    return selectedDate >= today;
                }),
            slot: Yup.string().required('Slot is required'),
            address: Yup.string().required('Address is required'),
            description: Yup.string().required('Description is required')
        }),
        onSubmit: async (values, { resetForm }) => {
            try {
                const response = await axios.post('/booking', values, {
                    headers: {
                        Authorization: localStorage.getItem('token')
                    }
                });
                toast.success('Booking Done Successfully', {
                    autoClose: 1000,
                    position: 'top-center',
                    pauseOnHover: false,
                });
                console.log('Booking created:', response.data);
                resetForm();
                navigate("/customer-bookings");
            } catch (error) {
                toast.error('Booking Failed', {
                    autoClose: 1000,
                    position: 'top-center',
                    pauseOnHover: false,
                })
                setServerError(error.response.data.errors)
                console.error('Error creating booking:', error);
            }
        }
    });

    const generateTimeSlots = () => {
        const timeSlots = [];
        for (let hour = 9; hour <= 18; hour++) {
            timeSlots.push(`${hour < 10 ? '0' : ''}${hour}:00`);
        }
        return timeSlots;
    };

    useEffect(() => {
        const handleSlotChange = () => {
            const selectedDate = new Date(formik.values.date);
            const currentDate = new Date();
            const slots = generateTimeSlots();

            if (selectedDate.toDateString() === currentDate.toDateString()) {
                const currentTime = currentDate.getHours();
                const filteredSlots = slots.filter(slot => {
                    const slotHour = parseInt(slot.split(':')[0], 10);
                    return slotHour > currentTime;
                });
                setAvailableSlots(filteredSlots);
            } else {
                setAvailableSlots(slots);
            }
        };

        handleSlotChange();
    }, [formik.values.date]);

    const handleUseCurrentLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    console.log(latitude, longitude);
                    setMapPosition([latitude, longitude]);
                    formik.setFieldValue('lat', latitude);
                    formik.setFieldValue('lng', longitude);
                    const geocodeUrl = `https://api.opencagedata.com/geocode/v1/json?q=${latitude}%2C${longitude}&key=749aaded409d4a29aeac6bf6ecb9176f`;
                    axios.get(geocodeUrl)
                        .then((response) => {
                            console.log(response.data.results[0].formatted);
                            const address = response.data.results[0].formatted;
                            formik.setFieldValue('address', address);
                        })
                        .catch((error) => {
                            console.error('Error fetching address:', error);
                        });
                },
                (error) => {
                    console.error('Error getting location:', error);
                }
            );
        } else {
            alert('Geolocation is not supported by this browser.');
        }
    };


    const displayErrors = () => {
        let result;
        if (typeof serverError === 'string') {
            result = <p className='alert alert-danger'> {serverError} </p>
        } else {
            result = (
                <div className='alert alert-danger'>
                    <h3>These errors prohibited the form from being saved: </h3>
                    <ul>
                        {serverError.map((ele, i) => {
                            return <li key={i}> {ele.msg} </li>
                        })}
                    </ul>
                </div>
            );
        }
        return result;
    };

    return (
        <div className="container mt-5">
            <h1 className="text-center mb-4">Book Your Service</h1>
            {serverError && displayErrors()}
            <Form onSubmit={formik.handleSubmit}>
                <FormGroup>
                    <Label for="date">Date</Label>
                    <Input
                        type="date"
                        name="date"
                        id="date"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.date}
                        invalid={formik.touched.date && formik.errors.date ? true : false}
                    />
                    {formik.touched.date && formik.errors.date ? (
                        <FormFeedback>{formik.errors.date}</FormFeedback>
                    ) : null}
                </FormGroup>

                <FormGroup>
                    <Label for="slot">Slot</Label>
                    <Input
                        type="select"
                        name="slot"
                        id="slot"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.slot}
                        invalid={formik.touched.slot && formik.errors.slot ? true : false}
                    >
                        <option value="">Select a slot</option>
                        {availableSlots.map((time, index) => (
                            <option key={index} value={time}>{time}</option>
                        ))}
                    </Input>
                    {formik.touched.slot && formik.errors.slot ? (
                        <FormFeedback>{formik.errors.slot}</FormFeedback>
                    ) : null}
                </FormGroup>

                <FormGroup>
                    <Label for="address">Address</Label>
                    <InputGroup>
                        <Input
                            type="text"
                            name="address"
                            id="address"
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.address}
                            invalid={formik.touched.address && formik.errors.address ? true : false}
                        />
                        <InputGroupText addontype="append">
                            <Button color="secondary" onClick={handleUseCurrentLocation}>Use Current Location</Button>
                        </InputGroupText>
                    </InputGroup>
                    {formik.touched.address && formik.errors.address ? (
                        <FormFeedback>{formik.errors.address}</FormFeedback>
                    ) : null}
                </FormGroup>

                {mapPosition && (
                    <div className="mt-4">
                        <h3>Your Location</h3>
                        <MapContainer center={mapPosition} zoom={13} style={{ height: '200px', width: '100%' }}>
                            <TileLayer
                                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                            />
                            <Marker position={mapPosition} icon={customIcon}>
                                <Popup>
                                    You are here: {formik.values.address}
                                </Popup>
                            </Marker>
                        </MapContainer>
                    </div>
                )}

                <FormGroup>
                    <Label for="description">Description</Label>
                    <Input
                        type="textarea"
                        name="description"
                        id="description"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.description}
                        invalid={formik.touched.description && formik.errors.description ? true : false}
                    />
                    {formik.touched.description && formik.errors.description ? (
                        <FormFeedback>{formik.errors.description}</FormFeedback>
                    ) : null}
                </FormGroup>

                <Button color="primary" type="submit">Book</Button>
            </Form>
        </div>
    );
}



