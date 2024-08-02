import '../src/index.css'
import React from 'react';
import ReactDOM from 'react-dom/client'
import App from './App';
import {BrowserRouter} from 'react-router-dom'
import { AuthProvider } from './context/Auth'
import {ToastContainer} from 'react-toastify'
import configureStore from './store/configure';
import {Provider} from 'react-redux'
import 'react-toastify/dist/ReactToastify.css'


const store = configureStore() 
console.log('redux state', store.getState())

store.subscribe(() => {
  console.log('redux state', store.getState())
})
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <AuthProvider>
    <BrowserRouter>
    <ToastContainer autoClose={3000} pauseOnHover={false}  />
      <Provider store={store}>
       <App />
      </Provider>
     </BrowserRouter>
   </AuthProvider>
);

