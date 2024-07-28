import {Link,Route,Routes} from 'react-router-dom'
import '../src/index'
import { useEffect } from 'react';
import axios from './config/axios';
import Register from './components/Register';
import Login from './components/Login';
import Home from './components/Home';
import ForgotPassword from './components/ForgotPassword';
import Unauthorized from './components/Unathorized';
import VerificationProcess from './components/VerificationProcess';
import ResetPassword from './components/ResetPassword';
import PrivateRoute from './components/PrivateRoute';
import Account from './components/Account';
import Service from './components/Service';
import AllService from './components/AllService';
import Icons from './components/Icons';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useAuth } from './context/Auth';

function App() {

  const {dispatch,user}=useAuth()

  useEffect(() => {
    if(localStorage.getItem('token'))  {
      
      (async () => {
        
        const response = await axios.get('/users/account', {
          headers: {
            Authorization: localStorage.getItem('token')
          }
        })
       
        dispatch({ type: 'LOGIN', payload: { account: response.data } })
      })();
    }
  }, [])

  return (
    <div  >
       <h1>Urban Company</h1>
       <Link to='/'>Home</Link>|
       <Link to='/account'> Account</Link>|
       <Link to='/allservice'>AllService</Link>|
       <Link to='/login'>Login</Link>|
       <Link to='/register'>Register</Link>


     
       <Routes>
        <Route path='/' element={<Home/>}/>
        <Route path='/register' element={<Register/>}/>
        <Route path='/login' element={<Login />} />
        <Route path='/forgotpassword' element={<ForgotPassword/>}/>
        <Route path='/unauthorized' element={<Unauthorized/>}/>
        <Route path='/verificationprocess' element={<VerificationProcess/>}/>
        <Route path='/resetpassword' element={<ResetPassword/>}/>
        <Route path='/icons' element={<Icons/>}/>
        <Route path='/allservice' element={
          <PrivateRoute permittedRoles={['customer', 'service-provider','admin']}>
              <AllService />
          </PrivateRoute>}/>
        <Route path='/account' element={
          <PrivateRoute permittedRoles={['customer', 'service-provider']}>
              <Account />
          </PrivateRoute>}/>
          <Route path='/service' element={ <PrivateRoute permittedRoles={['service-provider','customer','admin']}>
              <Service />
          </PrivateRoute>}/>
       </Routes>

    </div>
  );
}

export default App;
