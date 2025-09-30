import { Link, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext.jsx";

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="bg-blue-600 text-white px-6 py-4 flex justify-between items-center">
      <Link to="/" className="text-2xl font-bold">
        🍽️ Restaurant Booking
      </Link>
      <div className="space-x-4">
        <Link to="/">Home</Link>
        {user && <Link to="/bookings">My Bookings</Link>}
        {user?.role === "admin" && <Link to="/admin">Admin Panel</Link>}
        {!user && <Link to="/login">Login</Link>}
        {!user && <Link to="/register">Register</Link>}
        {user && (
          <button onClick={handleLogout} className="bg-red-500 px-3 py-1 rounded">
            Logout
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
