import {Link,Route,Routes} from 'react-router-dom'
import Register from './components/Register';
import Login from './components/Login';
import Home from './components/Home';
import ForgotPassword from './components/ForgotPassword';
import Unauthorized from './components/Unathorized';
import VerificationProcess from './components/VerificationProcess';
import PrivateRoute from './components/PrivateRoute';
import 'bootstrap/dist/css/bootstrap.min.css';
function App() {
  return (
    <div  >
       <h1>Urban Company</h1>
       <Link to='/'>Home</Link>|
       <Link to='/register'>Register</Link>|
       <Link to='/login'>Login</Link>
     
       <Routes>
        <Route path='/' element={<Home/>}/>
        <Route path='/register' element={<Register/>}/>
        <Route path='/login' element={<Login />} />
        <Route path='/forgotpassword' element={<ForgotPassword/>}/>
        <Route path='/unauthorized' element={<Unauthorized/>}/>
        <Route path='/verificationprocess' element={<VerificationProcess/>}/>
        
       </Routes>

    </div>
  );
}

export default App;
