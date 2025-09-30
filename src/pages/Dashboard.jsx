import { useContext } from "react";
import { AuthContext } from "../context/AuthContext.jsx";

const Dashboard = () => {
  const { user } = useContext(AuthContext);

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">Welcome, {user?.name}</h1>
      <p>Your role: {user?.role}</p>
      <p>Use the navigation to view tables, bookings, or admin panel.</p>
    </div>
  );
};

export default Dashboard;
