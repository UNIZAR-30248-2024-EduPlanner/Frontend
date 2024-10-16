import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext"
import constants from "../constants/constants";

export const ProtectedRouter = () => {
    const { isAuthenticated } = useAuth();
    
    if (!isAuthenticated) return <Navigate to={constants.root} replace/>
    else return <Outlet/>
}

export const ProtectedUser = ({ userType }) => {
    const { isAuthenticated, type } = useAuth();
    
    if (!isAuthenticated || type != userType) {
        return <Navigate to={constants.root} replace/>
    } else {
        return <Outlet/>
    }
}

