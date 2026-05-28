import { Navigate, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import LoaderComponent from '../../components/loader'

export function ProtectedRoute() {
  const { isAuthenticated, isLoading ,otpVerified} = useAuth();
  const navigate = useNavigate();
  if (isLoading) {
    return <LoaderComponent/>
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if(!otpVerified){
    navigate('/verification')
  }

  return <Outlet />;
}