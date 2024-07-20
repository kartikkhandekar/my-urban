import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../config/axios";
import validator from "validator";
import { toast } from "react-toastify";
import 'bootstrap/dist/css/bootstrap.min.css';

export default function Register() {
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    role: "",
    serverErrors: null,
  });
  const [clientErrors, setClientErrors] = useState({});
  const [checkAd, setCheckAd] = useState(null);
  const errors = {};
  const navigate = useNavigate();

  useEffect(() => {
    const fun = async () => {
      const response = await axios.get(`/users/all`);
      const result = response.data.some((ele) => {
        return ele.role === "admin";
      });
      setCheckAd(result);
    };
    fun();
  }, []);

  const runValidations = () => {
    if (form.username.trim().length === 0) {
      errors.username = "username is required";
    }

    if (form.email.trim().length === 0) {
      errors.email = "email is required";
    } else if (!validator.isEmail(form.email)) {
      errors.email = "invalid email format";
    }

    if (form.password.trim().length === 0) {
      errors.password = "password is required";
    } else if (form.password.trim().length < 8 || form.password.trim().length > 128) {
      errors.password = "password should be between 8 - 128 characters";
    }

    if (form.role.trim().length === 0) {
      errors.role = "role is required";
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = {
      username: form.username,
      email: form.email,
      password: form.password,
      role: form.role,
    };

    runValidations();

    if (Object.keys(errors).length === 0) {
      try {
        await axios.post("/users/register", formData);
        toast.success("Registered Successfully", {
          autoClose: 1000,
          position: "top-center",
          pauseOnHover: false,
        });
        navigate("/login");
      } catch (err) {
        setForm({ ...form, serverErrors: err.response.data.errors });
        setClientErrors({});
      }
    } else {
      setClientErrors(errors);
      setForm({ ...form, serverErrors: null });
    }
  };

  const handleChange = (e) => {
    const { value, name } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleCheckEmail = async () => {
    if (validator.isEmail(form.email)) {
      const response = await axios.get(`/users/checkemail?email=${form.email}`);
      if (response.data.is_email_registered) {
        setClientErrors({ ...clientErrors, email: "Email already taken" });
      } else {
        setClientErrors({ ...clientErrors, email: "" });
      }
    }
  };

  return (
    <div className="container mt-5">
      <h1 className="text-center mb-4">Register With Us</h1>

      {form.serverErrors && (
        <div className="alert alert-danger">
          <h3>These errors prohibited the form from being saved:</h3>
          <ul>
            {form.serverErrors.map((ele, i) => (
              <li key={i}>{ele.msg}</li>
            ))}
          </ul>
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-light p-4 rounded shadow">
        <div className="mb-3">
          <label htmlFor="username" className="form-label">Enter Username</label>
          <input
            type="text"
            value={form.username}
            id="username"
            name="username"
            onBlur={runValidations}
            onChange={handleChange}
            className="form-control"
          />
          {clientErrors.username && <span className="text-danger">{clientErrors.username}</span>}
        </div>

        <div className="mb-3">
          <label htmlFor="email" className="form-label">Enter Email</label>
          <input
            type="text"
            value={form.email}
            id="email"
            name="email"
            onBlur={handleCheckEmail}
            onChange={handleChange}
            className="form-control"
          />
          {clientErrors.email && <span className="text-danger">{clientErrors.email}</span>}
        </div>

        <div className="mb-3">
          <label htmlFor="password" className="form-label">Enter Password</label>
          <input
            type="password"
            value={form.password}
            id="password"
            name="password"
            onChange={handleChange}
            className="form-control"
          />
          {clientErrors.password && <span className="text-danger">{clientErrors.password}</span>}
        </div>

        <div className="mb-3">
          <label className="form-label">Select Role</label>
          <br />
          {!checkAd && (
            <>
              <div className="form-check form-check-inline">
                <input
                  type="radio"
                  value="admin"
                  onChange={handleChange}
                  checked={form.role === "admin"}
                  id="admin"
                  name="role"
                  className="form-check-input"
                />
                <label htmlFor="admin" className="form-check-label">Admin</label>
              </div>
            </>
          )}
          <div className="form-check form-check-inline">
            <input
              type="radio"
              value="customer"
              onChange={handleChange}
              checked={form.role === "customer"}
              id="customer"
              name="role"
              className="form-check-input"
            />
            <label htmlFor="customer" className="form-check-label">Customer</label>
          </div>
          <div className="form-check form-check-inline">
            <input
              type="radio"
              value="service-provider"
              onChange={handleChange}
              checked={form.role === "service-provider"}
              id="provider"
              name="role"
              className="form-check-input"
            />
            <label htmlFor="provider" className="form-check-label">Service Provider</label>
          </div>
          {clientErrors.role && <span className="text-danger">{clientErrors.role}</span>}
        </div>

        <button type="submit" className="btn btn-primary">Register</button>
      </form>
    </div>
  );
}
