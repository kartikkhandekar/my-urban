import { useFormik } from 'formik';
import { useState } from 'react';
import axios from '../config/axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/Auth';
import { Link } from 'react-router-dom';
import * as Yup from 'yup';
import { toast } from 'react-toastify';

export default function Login() {
    const [serverError, setServerError] = useState(null);
    const navigate = useNavigate();
    const { dispatch } = useAuth();

    const validationSchema = Yup.object({
        email: Yup.string().email('Invalid email format').required('Email is required'),
        password: Yup.string()
            .min(8, 'Password must be at least 8 characters')
            .required('Password is required'),
    });

    const formik = useFormik({
        initialValues: {
            email: '',
            password: '',
        },
        validationSchema,
        onSubmit: async (values) => {
            try {
                const response = await axios.post('/users/login', values);
                console.log(response.data);
                localStorage.setItem('token', response.data.token);
                const userResponse = await axios.get('/users/account', {
                    headers: {
                        Authorization: localStorage.getItem('token'),
                    },
                });
                dispatch({ type: 'LOGIN', payload: { account: userResponse.data } });
                toast.success('Login Success', {
                    autoClose: 1000,
                    position: 'top-center',
                    pauseOnHover: false,
                });
                navigate('/');
            } catch (err) {
                console.log(err);
                setServerError(err.response.data.errors);
            }
        },
    })

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
        <div className="container">
            <div className="row justify-content-center">
                <div className="col-md-6">
                    <h1 className="text-center mb-4">Login</h1>
                    {serverError && displayErrors()}
                    <form onSubmit={formik.handleSubmit} className="bg-light p-4 rounded shadow">
                        <div className="form-group mb-3">
                            <label htmlFor="email" className="form-label">Enter Email</label>
                            <input
                                type="text"
                                value={formik.values.email}
                                id="email"
                                name="email"
                                onChange={formik.handleChange}
                                className={`form-control ${formik.errors.email && formik.touched.email ? 'is-invalid' : ''}`}
                            />
                            {formik.errors.email && formik.touched.email && (
                                <div className="invalid-feedback">{formik.errors.email}</div>
                            )}
                        </div>
                        <div className="form-group mb-3">
                            <label htmlFor="password" className="form-label">Enter Password</label>
                            <input
                                type="password"
                                value={formik.values.password}
                                id="password"
                                name="password"
                                onChange={formik.handleChange}
                                className={`form-control ${formik.errors.password && formik.touched.password ? 'is-invalid' : ''}`}
                            />
                            {formik.errors.password && formik.touched.password && (
                                <div className="invalid-feedback">{formik.errors.password}</div>
                            )}
                        </div>
                        <button type="submit" className="btn btn-primary w-100">Login</button>
                    </form>
                    <div className="text-center mt-3">
                        <Link to="/forgotpassword">Forget Password?</Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
