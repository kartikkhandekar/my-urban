import VerificationProcess from "./VerificationProcess";
import { useAuth } from "../context/Auth";
import { Navigate } from "react-router-dom";

export default function PrivateRoute({ permittedRoles, children }) {
    const { user } = useAuth();
    
    if(!user.isLoggedIn && localStorage.getItem('token')) { //By doing this we are not going to login page if we refersh in account page.
        return <p>loading...</p>
    }

    if(!user.isLoggedIn) { // if user is not logged in then navigating him to login page.
        return <Navigate to="/login" /> 
    }

    if(!permittedRoles.includes(user.account.role)) { 
        return <Navigate to="/unauthorized" />
    }

    return children

}