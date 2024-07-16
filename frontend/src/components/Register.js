import { useState } from "react"
import { useNavigate } from "react-router-dom"
import axios from '../config/axios'
import validator from 'validator'
export default function Register(){
    const [form,setForm]=useState({
        username:'',
        email:'',
        password:"",
        role:'',
        serverErrors:null
    })
    const [clientErrors,setClientErrors]=useState({})
    const errors={}
    const navigate=useNavigate()

    const runValidations = () => {
        
        if(form.username.trim().length === 0) {
            errors.username = 'username is required'
        }

        if(form.email.trim().length === 0) {
            errors.email = 'email is required'
        } else if(!validator.isEmail(form.email)) {
            errors.email = 'invalid email format'
        }

        if(form.password.trim().length === 0) {
            errors.password = 'password is required'
        } else if(form.password.trim().length < 8 || form.password.trim().length > 128) {
            errors.password = 'password should be between 8 - 128 characters'
        }

        if(form.role.trim().length === 0) {
            errors.role = 'role is required'
        }
    } 

    const handleSubmit=async(e)=>{
        e.preventDefault()
        
        const formData = {
            username:form.username, 
            email: form.email,
            password: form.password, 
            role: form.role 
        }
        
        
        runValidations()

        if(Object.keys(errors).length === 0) {
            try {
                 await axios.post('/users/register', formData) 
                navigate('/login')
            } catch(err) {
                setForm({...form,serverErrors:err.response.data.errors})
                setClientErrors({})
            }
        } else {
            setClientErrors(errors)
            setForm({...form,serverErrors:null})

        }
    }
   
    const handleChange=(e)=>{
        const { value, name } = e.target 
        setForm({...form, [name]: value })
    }

    const handleCheckEmail = async () => {
        if(validator.isEmail(form.email)) {
            const response = await axios.get(`http://localhost:7777/users/checkemail?email=${form.email}`) 
            if(response.data.is_email_registered) {
                     setClientErrors({...clientErrors, email:'Email already taken'})
            }else{
                setClientErrors({...clientErrors, email:''})

            }
        }
    }

    return (
        <div>
            <h1>Register With Us</h1>

            { form.serverErrors && (
                <div>
                    <h3>Theses errors prohibitted the form from being saved: </h3>
                    <ul>
                        { form.serverErrors.map((ele, i) => {
                            return <li key={i}> { ele.msg } </li>
                        })}
                    </ul>
                </div> 
            )}

            <form onSubmit={handleSubmit}>
              <label htmlFor="username">Enter Username</label><br/>
              <input type="text" 
              value={form.username} 
              id="username" 
              name="username" 
              onBlur={runValidations()}
              onChange={handleChange}/>
            { clientErrors && <span>{clientErrors.username}</span>}
            <br/>
            <label htmlFor="email">Enter Email</label><br/>
              <input 
                type="text" 
                value={form.email} 
                id="email" name="email" 
                onBlur={handleCheckEmail} 
                onChange={handleChange}/>
              { clientErrors  && <span>{clientErrors.email}</span>}<br/>
              <label htmlFor="password">Enter Password</label><br/>
              <input 
                type="password"
                value={form.password}
                id="password"
                name="password"
                onChange={handleChange}
                />
            { clientErrors  && <span>{clientErrors.password}</span>}<br/>
              <label >Select Role</label> <br /> 
                <input 
                    type="radio" 
                    value="admin" 
                    onChange={handleChange} 
                    checked={form.role === 'admin'}  
                    id="admin" 
                    name="role" 
                /> 
                <label htmlFor="admin">Admin</label>

                <input 
                    type="radio" 
                    value="customer" 
                    onChange={handleChange} 
                    checked={form.role === 'customer'}  
                    id="customer" 
                    name="role" 
                /> 
                <label htmlFor="customer">Customer</label>

                <input 
                    type="radio" 
                    value="service-provider" 
                    onChange={handleChange} 
                    checked={form.role === 'service-provider'}  
                    id="provider" 
                    name="role" 
                /> 
                <label htmlFor="provider">ServiceProvider</label>
                { clientErrors && <span> { clientErrors.role }</span>}
                <br /> 
                <input type="submit" />
            </form>
        </div>
    )
}