import { useContext } from "react";
import { AuthContext } from "../context/AuthContext.jsx";

const Dashboard = () => {
  const { user } = useContext(AuthContext);

  // Sample stats data - you can replace with real data
  const stats = [
    { label: "Total Bookings", value: "24", color: "bg-blue-500" },
    { label: "Pending Requests", value: "8", color: "bg-yellow-500" },
    { label: "Available Tables", value: "12", color: "bg-green-500" },
    { label: "Revenue", value: "$2,847", color: "bg-purple-500" },
  ];

  const quickActions = [
    { name: "View Tables", icon: "🍽️", path: "/tables" },
    { name: "Manage Bookings", icon: "📅", path: "/bookings" },
    { name: "Admin Panel", icon: "⚙️", path: "/admin" },
    { name: "Reports", icon: "📊", path: "/reports" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-gray-800 mb-2">
              Welcome back, {user?.name}!
            </h1>
            <p className="text-gray-600 text-lg">
              Here's what's happening today
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
          </div>
        </div>
        
        {/* Role Badge */}
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
                <p className="text-gray-600 text-sm font-medium mb-1">
                  {stat.label}
                </p>
                <p className="text-3xl font-bold text-gray-800">{stat.value}</p>
              </div>
              <div
                className={`w-12 h-12 ${stat.color} rounded-xl flex items-center justify-center text-white`}
              >
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

      {/* Quick Actions */}
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

        {/* Recent Activity */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-6">
            Recent Activity
          </h2>
          <div className="space-y-4">
            {[
              { action: "New booking received", time: "2 min ago", type: "booking" },
              { action: "Table #4 became available", time: "1 hour ago", type: "table" },
              { action: "Monthly report generated", time: "3 hours ago", type: "report" },
              { action: "System updated", time: "1 day ago", type: "system" },
            ].map((activity, index) => (
              <div
                key={index}
                className="flex items-center space-x-4 p-3 rounded-lg hover:bg-gray-50 transition-colors duration-200"
              >
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    activity.type === "booking"
                      ? "bg-green-100 text-green-600"
                      : activity.type === "table"
                      ? "bg-blue-100 text-blue-600"
                      : activity.type === "report"
                      ? "bg-purple-100 text-purple-600"
                      : "bg-gray-100 text-gray-600"
                  }`}
                >
                  {activity.type === "booking" && "📅"}
                  {activity.type === "table" && "🍽️"}
                  {activity.type === "report" && "📊"}
                  {activity.type === "system" && "⚙️"}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-800">
                    {activity.action}
                  </p>
                  <p className="text-xs text-gray-500">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Welcome Message */}
      <div className="mt-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl p-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold mb-2">
              Ready to manage your restaurant?
            </h2>
            <p className="text-blue-100">
              Use the navigation to view tables, bookings, or access the admin panel.
            </p>
          </div>
          <div className="text-4xl">🎯</div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;