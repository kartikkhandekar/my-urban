import React, { useState, useEffect } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import axios from '../config/axios';
import { toast } from 'react-toastify';
import { useNavigate, useParams } from 'react-router-dom';

export default function UpdateService() {
  const { serviceId } = useParams();
  const navigate = useNavigate();
  const [serverError, setServerError] = useState(null);
  const [initialValues, setInitialValues] = useState({
    servicename: '',
    category: '',
    description: [''],
    price: '',
    serviceProvider: '',
    duration: '',
  });

  useEffect(() => {
    const fetchService = async () => {
      try {
        const response = await axios.get(`/service/${serviceId}`, {
          headers: {
            Authorization: localStorage.getItem('token'),
          },
        });
        const service = response.data;
        setInitialValues({
          servicename: service.servicename,
          category: service.category,
          description: service.description,
          price: service.price,
          serviceProvider: service.serviceProvider,
          duration: service.duration,
        });
      } catch (error) {
        toast.error('Error fetching service data');
      }
    };

    fetchService();
  }, [serviceId]);

  const validationSchema = Yup.object().shape({
    servicename: Yup.string().required('Service name is required'),
    category: Yup.string().required('Category is required'),
    description: Yup.array()
      .of(Yup.string().required('Description item is required'))
      .min(1, 'At least one description item is required'),
    price: Yup.number().required('Price is required').positive('Price must be positive'),
    duration: Yup.string().required('Duration is required'),
  });

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      await axios.put(`/service/${serviceId}`, values, {
        headers: {
          Authorization: localStorage.getItem('token'),
        },
      });
      toast.success('Service updated successfully', {
        autoClose: 1000,
        position: 'top-center',
        pauseOnHover: false,
      });
      navigate('/myservices');
    } catch (error) {
      setServerError(error.response.data.errors);
      console.log(serverError);
    } finally {
      setSubmitting(false);
    }
  };

  const displayErrors = () => {
    let result;
    if (typeof serverError === 'string') {
      result = <p className="alert alert-danger"> {serverError} </p>;
    } else {
      result = (
        <div className="alert alert-danger">
          <h3>These errors prohibited the form from being saved: </h3>
          <ul>
            {serverError.map((ele, i) => {
              return <li key={i}> {ele.msg} </li>;
            })}
          </ul>
        </div>
      );
    }
    return result;
  };

  return (
    <div className="container mt-5">
      <h1 className="text-center mb-4">Update Service</h1>
      {serverError && displayErrors()}
      <Formik
        enableReinitialize
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting, values, setFieldValue }) => (
          <Form className="bg-light p-4 rounded shadow">
            <div className="mb-3">
              <label htmlFor="servicename" className="form-label">Service Name</label>
              <Field type="text" name="servicename" className="form-control" />
              <ErrorMessage name="servicename" component="div" className="text-danger" />
            </div>

            <div className="mb-3">
              <label htmlFor="category" className="form-label">Category</label>
              <Field as="select" name="category" className="form-select">
                <option value="">Select Category</option>
                <option value='Painting & Decor'>Painting & Decor</option>
                <option value='AC Repair and service'>AC Repair and service</option>
                <option value="Electrician,Plumber & Carpenter">Electrician,Plumber & Carpenter</option>
                <option value="Bathroom and Kitchen cleaning">Bathroom and Kitchen cleaning</option>
                <option value="Men's Salon & Massage">Men's Salon & Massage</option>
                <option value="Women's Salon & Spa">Women's Salon & Spa</option>
              </Field>
              <ErrorMessage name="category" component="div" className="text-danger" />
            </div>

            <div className="mb-3">
              <label htmlFor="description" className="form-label">Description</label>
              {values.description.map((_, index) => (
                <div key={index} className="d-flex mb-2">
                  <Field
                    type="text"
                    name={`description[${index}]`}
                    className="form-control me-2"
                  />
                  <button
                    type="button"
                    className="btn btn-danger"
                    onClick={() => {
                      const desc = [...values.description];
                      desc.splice(index, 1);
                      setFieldValue('description', desc);
                    }}
                  >
                    X
                  </button>
                </div>
              ))}
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => setFieldValue('description', [...values.description, ''])}
              >
                Add Description
              </button>
              <ErrorMessage name="description" component="div" className="text-danger" />
            </div>

            <div className="mb-3">
              <label htmlFor="price" className="form-label">Price</label>
              <Field type="number" name="price" className="form-control" />
              <ErrorMessage name="price" component="div" className="text-danger" />
            </div>

            <div className="mb-3">
              <label htmlFor="duration" className="form-label">Duration</label>
              <Field type="text" name="duration" className="form-control" />
              <ErrorMessage name="duration" component="div" className="text-danger" />
            </div>

            <button type="submit" className="btn btn-primary" disabled={isSubmitting}>Update</button>
          </Form>
        )}
      </Formik>
    </div>
  );
}
