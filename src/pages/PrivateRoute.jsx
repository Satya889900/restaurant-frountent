import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext.jsx";

const PrivateRoute = ({ children, roles }) => {
  const { user, loading } = useContext(AuthContext);

  if (loading) return <div>Loading...</div>; // Or a spinner component

  // If user is not logged in, redirect to login page
  if (!user) return <Navigate to="/login" />;

  // If role is specified and user.role does not match, redirect to home page
  if (roles && !roles.includes(user.role)) return <Navigate to="/" />;

  return children;
};

export default PrivateRoute;
