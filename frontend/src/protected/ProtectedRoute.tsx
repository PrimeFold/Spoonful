import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import LoaderComponent from '../../components/loader'

export function ProtectedRoute() {
  const { isAuthenticated, isLoading ,otpVerified} = useAuth();
  if (isLoading) {
    return <LoaderComponent/>
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (!otpVerified) {
    return <Navigate to="/verification" replace />;
  }

  return <Outlet />;
}