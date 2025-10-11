import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext.jsx";
import { getTables } from "../services/tableService.js";

const Dashboard = () => {
  const { user, token } = useContext(AuthContext);
  const [tables, setTables] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Fetch tables from backend
  const fetchTables = async () => {
    if (!token) return;
    setLoading(true);
    setError("");
    try {
      const now = new Date();
      const date = now.toISOString().split("T")[0];
      const time = now.toTimeString().split(" ")[0];
      const data = await getTables(date, time, token);
      setTables(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Dashboard fetch error:", err.message);
      setError("Failed to load tables");
      setTables([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.role) fetchTables();
  }, [user]);

  // Compute stats based on real data
  const stats = [
    { label: "Total Tables", value: tables.length, color: "bg-blue-500" },
    {
      label: "Available Tables",
      value: tables.filter((t) => t.available).length,
      color: "bg-green-500",
    },
    {
      label: "Booked Tables",
      value: tables.filter((t) => !t.available).length,
      color: "bg-red-500",
    },
    {
      label: "Total Seats",
      value: tables.reduce((sum, t) => sum + t.seats, 0),
      color: "bg-purple-500",
    },
  ];

  // Quick actions
  const quickActions = [
    { name: "View Tables", icon: "🍽️", path: "/tables" },
    { name: "Manage Bookings", icon: "📅", path: "/bookings" },
    { name: "Admin Panel", icon: "⚙️", path: "/admin" },
    { name: "Reports", icon: "📊", path: "/reports" },
  ];

  // Recent activity - mock for now, could be replaced with real backend endpoint
  const recentActivity = tables
    .slice(-4)
    .map((t) => ({
      action: t.available
        ? `Table #${t.tableNumber} became available`
        : `Table #${t.tableNumber} was booked`,
      time: "Just now",
      type: t.available ? "table" : "booking",
    }));

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-gray-800 mb-2">
              Welcome back, {user?.name}!
            </h1>
            <p className="text-gray-600 text-lg">Here's what's happening today</p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
          </div>
        </div>

        <div className="mt-4">
          <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
            <span className="w-2 h-2 bg-blue-600 rounded-full mr-2"></span>
            {user?.role}
          </span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow duration-300"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium mb-1">{stat.label}</p>
                <p className="text-3xl font-bold text-gray-800">{loading ? "..." : stat.value}</p>
              </div>
              <div className={`w-12 h-12 ${stat.color} rounded-xl flex items-center justify-center text-white`}>
                <span className="text-lg">📈</span>
              </div>
            </div>
            <div className="mt-4">
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className={`${stat.color} h-2 rounded-full`}
                  style={{ width: `${Math.random() * 70 + 30}%` }}
                ></div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-6">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-4">
            {quickActions.map((action, index) => (
              <button
                key={index}
                className="flex flex-col items-center justify-center p-4 bg-gray-50 rounded-xl hover:bg-blue-50 hover:border-blue-200 border-2 border-transparent transition-all duration-300 group"
                onClick={() => console.log(`Navigate to: ${action.path}`)}
              >
                <span className="text-2xl mb-2 group-hover:scale-110 transition-transform duration-300">
                  {action.icon}
                </span>
                <span className="text-sm font-medium text-gray-700 group-hover:text-blue-600">
                  {action.name}
                </span>
              </button>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-6">Recent Activity</h2>
          <div className="space-y-4">
            {recentActivity.length === 0 && <p className="text-gray-500">No recent activity</p>}
            {recentActivity.map((activity, index) => (
              <div
                key={index}
                className="flex items-center space-x-4 p-3 rounded-lg hover:bg-gray-50 transition-colors duration-200"
              >
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    activity.type === "booking"
                      ? "bg-green-100 text-green-600"
                      : "bg-blue-100 text-blue-600"
                  }`}
                >
                  {activity.type === "booking" && "📅"}
                  {activity.type === "table" && "🍽️"}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-800">{activity.action}</p>
                  <p className="text-xs text-gray-500">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Welcome Banner */}
      <div className="mt-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl p-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold mb-2">Ready to manage your restaurant?</h2>
            <p className="text-blue-100">
              Use the navigation to view tables, bookings, or access the admin panel.
            </p>
          </div>
          <div className="text-4xl">🎯</div>
        </div>
      </div>

      {error && (
        <div className="mt-6 bg-red-50 border border-red-200 rounded-xl p-4 text-red-800">
          {error}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
