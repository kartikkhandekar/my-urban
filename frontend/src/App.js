import {Link,Route,Routes} from 'react-router-dom'
import Register from './components/Register';
import Login from './components/Login';
import Home from './components/Home';

function App() {
  return (
    <div >
       <h1>Urban Company</h1>
       <Link to='/register'>Register</Link>|
       <Link to='/login'>Login</Link>

       <Routes>
        <Route path='/register' element={<Register/>}/>
        <Route path='/login' element={<Login/>}/>
       </Routes>

    </div>
  );
}

export default App;
