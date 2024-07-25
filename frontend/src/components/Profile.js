import { useState } from "react";
//import axios from '../config/axios'
import _ from 'lodash'
export default function Profile(){

    const [form,setForm]=useState({
        serviceProviderName:'',
        category:[],
        phone:'',
        address:'',
        clientErrors:{},
        serverErrors:null
    })
    const errors={}
    const categoryList=['painting of walls and furniture',
        'AC Repair and service' ,
        'Electrician,plumber & Carpenter', 
        'Bathroom and Kitchen cleaning' , 
        'Salon for kids and men','Salon for women'
    ]

    const runvalidations=()=>{
        if (form.serviceProviderName.trim().length === 0) {
            errors.serviceProviderName = 'Name is required';
        }
        if (form.category.length === 0) {
            errors.category = 'Category is required';
        }
        if (form.phone.trim().length === 0) {
            errors.phone = 'PhoneNo is required';
        }
        if (form.address.trim().length === 0) {
            errors.address = 'Address is required';
        }
        return errors
    }
    const handleChange=(e)=>{
        const { name, value } = e.target
            setForm({...form,[name]: value})
      
    }
    const handleSubmit=(e)=>{
     e.preventDefault()
     runvalidations()
     const formData=_.pick(form,['serviceProviderName','category','phone','address'])
     if(Object.keys(errors)===0){
        console.log(formData)
     }
     else{
        console.log(errors)
        setForm({...form , clientErrors:errors})
        console.log(form.clientErrors)
     }
     
    }
    
  return (
    <div>
        <h1>Profile Creation</h1>
        <form onSubmit={handleSubmit}>
           <label htmlFor="name">Enter Name</label>
           <input
           type="text"
           value={form.serviceProviderName}
           id="name"
           name="serviceProviderName"
           onChange={handleChange}
           placeholder="Enter Name"/><br/>

           <label htmlFor="category">Select Category</label>
           <select id="category" value={form.category} name="category" onChange={handleChange} multiple >
                   <option value="painting of walls and furniture">Painting of walls and furniture</option>
                    <option value="AC Repair and service">AC Repair and service</option>
                    <option value="Electrician,plumber & Carpenter" >Electrician,plumber & Carpenter</option>
                    <option value="Bathroom and Kitchen cleaning">Bathroom and Kitchen cleaning</option>
                    <option value="Salon for kids and men">Salon for kids and men</option>
                    <option value="Salon for women">Salon for women</option>
                </select> <br/>
          
          <label htmlFor="phone">Enter Phone</label>
           <input
           type="text"
           name="phone"
           value={form.phone}
           id="phone"
           onChange={handleChange}
           placeholder="Enter Phone"/><br/>

           <label htmlFor="address">Enter Address</label>
           <input
           type="text"
           name='address'
           value={form.address}
           id="address"
           onChange={handleChange}
           placeholder="Enter Address"/><br/>
           
           <input type="submit"/>
        </form>
    </div>
  )
}