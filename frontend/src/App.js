import '../src/index'
import {Link,Route,Routes,useNavigate} from 'react-router-dom'
import { Navbar, Nav, Container } from 'react-bootstrap';
import { useEffect } from 'react';
import { useAuth } from './context/Auth';
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
import ParticularList from './components/ParticularList';
import Icons from './components/Icons';
import CustomerProfile from './components/CustomerProfile';
import Cart from './components/Cart';
import Booking from './components/Booking';
import EmptyCart from './components/EmptyCart';
import MyBookings from './components/MyBookings';
import MyService from './components/MyService';
import UpdateService from './components/UpdateService';
import CustomerBookings from './components/CustomerBookings';
import Success from './components/Success';
import Cancel from './components/Cancel';
import AllProviders from './adminDashboard/AllProviders';
import AllServiceAdmin from './adminDashboard/AllServicesAdmin';
import AllBookings from './adminDashboard/AllBookings';
import AllPayments from './adminDashboard/AllPayments';
import ProviderProfile from './components/ProviderProfile';
import Map from './components/Map';
import 'bootstrap/dist/css/bootstrap.min.css';


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


  const handleLogout = () => {
    localStorage.removeItem('token');
    dispatch({ type: 'LOGOUT' });
    navigate('/login');
  };
  

  return (
    <div >
       
       <Navbar bg="dark" variant="dark" expand="lg">
      <Container>
        <Navbar.Brand href="/">MyUrban</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ml-auto">
            { !user.isLoggedIn ? (
              <>
                <Nav.Link as={Link} to="/register">Register</Nav.Link>
                <Nav.Link as={Link} to="/login">Login</Nav.Link>
              </>
            ) : (
              <>
              {  user.account.role ==='customer' && (
                 <>
                <Nav.Link as={Link} to="/">Home</Nav.Link>
                <Nav.Link as={Link} to="/account">Account</Nav.Link>
                <Nav.Link as={Link} to="/customerprofile">Profile</Nav.Link>
                <Nav.Link as={Link} to="/cart">Cart</Nav.Link>
                <Nav.Link as={Link} to="/customer-bookings">My Bookings</Nav.Link>
                <Nav.Link as={Link} to="/" onClick={handleLogout}>Logout</Nav.Link>
                 </>
                )}

                {
                  user.account.role === 'service-provider' &&(
                    <>
                    <Nav.Link as={Link} to="/">Home</Nav.Link>
                    <Nav.Link as={Link} to="/account">Account</Nav.Link>
                    <Nav.Link as={Link} to="/providerprofile">Profile</Nav.Link>
                    <Nav.Link as={Link} to="/myservices">My Services</Nav.Link>
                    <Nav.Link as={Link} to="/mybookings">My Bookings</Nav.Link>
                    <Nav.Link as={Link} to="/" onClick={handleLogout}>Logout</Nav.Link>
                    </>
                  )
                }

                {
                  user.account.role === 'admin' &&(
                    <>
                    <Nav.Link as={Link} to="/">Home</Nav.Link>
                    <Nav.Link as={Link} to="/account">Account</Nav.Link>
                    <Nav.Link as={Link} to="/all-providers">All-Providers</Nav.Link>
                    <Nav.Link as={Link} to="/all-services">All-Services</Nav.Link>
                    <Nav.Link as={Link} to="/all-bookings">All-Bookings</Nav.Link>
                    <Nav.Link as={Link} to="/all-payments">All-Payments</Nav.Link>

                    <Nav.Link as={Link} to="/" onClick={handleLogout}>Logout</Nav.Link>
                    </>
                  )
                }
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
        
       
     
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
       
        <Route path='/account' element={
          <PrivateRoute permittedRoles={['customer', 'admin','service-provider']}>
              <Account />
          </PrivateRoute>}/>
          <Route path='/service' element={ <PrivateRoute permittedRoles={['service-provider','customer','admin']}>
              <Service />
          </PrivateRoute>}/>
           
          <Route path='/category/:category' element={ <PrivateRoute permittedRoles={['customer']}>
              <ParticularList />
          </PrivateRoute>}/>

          <Route path='/customerprofile' element={ <PrivateRoute permittedRoles={['customer']}>
              <CustomerProfile />
          </PrivateRoute>}/>

          <Route path='/providerprofile' element={ <PrivateRoute permittedRoles={['service-provider']}>
              <ProviderProfile />
          </PrivateRoute>}/>

          <Route path='/cart' element={ <PrivateRoute permittedRoles={['customer']}>
              <Cart />
          </PrivateRoute>}/>
         
          <Route path='/booking' element={ <PrivateRoute permittedRoles={['customer','admin']}>
              <Booking />
          </PrivateRoute>}/>
       
     
       <Route path='/mybookings' element={ <PrivateRoute permittedRoles={['service-provider']}>
              <MyBookings />
          </PrivateRoute>}/>

          <Route path='/map/:lat/:lng' element={ <PrivateRoute permittedRoles={['service-provider']}>
              <Map />
          </PrivateRoute>}/>
      
          <Route path='/myservices' element={ <PrivateRoute permittedRoles={['service-provider']}>
              <MyService />
          </PrivateRoute>}/>

          <Route path='/update/:serviceId' element={ <PrivateRoute permittedRoles={['service-provider']}>
              <UpdateService />
          </PrivateRoute>}/>


          <Route path='/customer-bookings' element={ <PrivateRoute permittedRoles={['customer']}>
              <CustomerBookings />
          </PrivateRoute>}/>
          
          <Route path='/all-providers' element={ <PrivateRoute permittedRoles={['admin']}>
              <AllProviders />
          </PrivateRoute>}/>

          <Route path='/all-services' element={ <PrivateRoute permittedRoles={['admin']}>
              <AllServiceAdmin />
          </PrivateRoute>}/>

          <Route path='/all-bookings' element={ <PrivateRoute permittedRoles={['admin']}>
              <AllBookings />
          </PrivateRoute>}/>

          <Route path='/all-payments' element={ <PrivateRoute permittedRoles={['admin']}>
              <AllPayments />
          </PrivateRoute>}/>

         

          <Route path='/success' element={<Success/>}/>
          <Route path='/cancel' element={<Cancel/>}/>


      </Routes>
    </div>
  );
}

export default App;
