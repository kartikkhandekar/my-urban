import VerificationProcess from "./VerificationProcess";
import { useAuth } from "../context/Auth";
import { Navigate } from "react-router-dom";

export default function PrivateRoute({ permittedRoles, children }) {
    const { user } = useAuth();
    if (!user.account && localStorage.getItem('token')) {
        return <p>Loading...</p>;
    }

    if (!permittedRoles.includes(user?.account.role)) {
        return <Navigate to="/unauthorized" />;
    }

    if (!user.account) {
        // If not logged in, allow access (for public routes)
        if (permittedRoles.includes(undefined)) {
          return children;
        }
        return <Navigate to="/unauthorized" />;
      }
      
    if (!user?.account.isVerified && user?.account.role==='service-provider') {
        return  <VerificationProcess/>
    }

    if (user.isLoggedIn) {
        return <Navigate to="/login" />;
    }
   
    return children;
}