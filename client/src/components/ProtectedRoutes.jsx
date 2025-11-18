import { useSelector } from "react-redux"
import { Navigate } from "react-router-dom";

export const ProtectedRoute = ({children}) => {
    const {isAuthenticated} = useSelector(store=>store.auth);

    if(!isAuthenticated){
        return <Navigate to="/login"/>
    }

    return children;
}
export const AuthenticatedUser = ({children}) => {
    const {isAuthenticated} = useSelector(store=>store.auth);

    if(isAuthenticated){
        return <Navigate to="/"/>
    }

    return children;
}

export const AdminRoute = ({children}) => {
    const {user, isAuthenticated} = useSelector(store=>store.auth);

    if(!isAuthenticated){
        return <Navigate to="/login"/>
    }

    // Note: User model only has "instructor" and "student" roles
    // If you add an "admin" role in the future, update this check:
    // if(user?.role !== "instructor" && user?.role !== "admin")
    if(user?.role !== "instructor"){
        return <Navigate to="/"/>
    }

    return children;
}