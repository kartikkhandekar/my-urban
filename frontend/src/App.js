import {Link,Route,Routes,useNavigate} from 'react-router-dom'
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
import ParticularList from './components/ParticularList';
import Icons from './components/Icons';
import CustomerProfile from './components/CustomerProfile';
import Cart from './components/Cart';
import Booking from './components/Booking';
import EmptyCart from './components/EmptyCart';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useAuth } from './context/Auth';

function App() {

  const {dispatch,user}=useAuth()
  const navigate=useNavigate()
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

       
       

       { !user.isLoggedIn ? (
          <>
          <Link to="/register">Register</Link>|
          <Link to="/login"> Login </Link>
          </>
        ) : (
          <>
             <Link to='/'>Home</Link>|
            <Link to="/account">Account</Link>|
            <Link to='/cart'>Cart</Link>
            <Link to="/" onClick={() => { navigate('/login')
              localStorage.removeItem('token')
              dispatch({ type: 'LOGOUT'})
            }}> logout </Link>  
          </>
        )}

     
       <Routes>
        <Route path='/' element={<Home/>}/>
        <Route path='/register' element={<Register/>}/>
        <Route path='/login' element={<Login />} />
        <Route path='/forgotpassword' element={<ForgotPassword/>}/>
        <Route path='/unauthorized' element={<Unauthorized/>}/>
        <Route path='/verificationprocess' element={<VerificationProcess/>}/>
        <Route path='/resetpassword' element={<ResetPassword/>}/>
        <Route path='/icons' element={<Icons/>}/>
         <Route path='/emptycart' element={<EmptyCart/>}/>
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
           
          <Route path='/category/:category' element={ <PrivateRoute permittedRoles={['service-provider','customer','admin']}>
              <ParticularList />
          </PrivateRoute>}/>

          <Route path='/customerprofile' element={ <PrivateRoute permittedRoles={['customer','admin']}>
              <CustomerProfile />
          </PrivateRoute>}/>

          <Route path='/cart' element={ <PrivateRoute permittedRoles={['customer','admin']}>
              <Cart />
          </PrivateRoute>}/>
         
          <Route path='/booking' element={ <PrivateRoute permittedRoles={['customer','admin']}>
              <Booking />
          </PrivateRoute>}/>
       </Routes>
     
    </div>
  );
}

export default App;
