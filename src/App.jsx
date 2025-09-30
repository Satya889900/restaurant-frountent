// App.jsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Bookings from "./pages/Bookings";
import AdminPanel from "./pages/AdminPanel";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import PrivateRoute from "./pages/PrivateRoute";

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected Routes */}
        <Route path="/dashboard" element={
          <PrivateRoute>
            <Dashboard />
          </PrivateRoute>
        } />
        <Route path="/bookings" element={
          <PrivateRoute>
            <Bookings />
          </PrivateRoute>
        } />

        {/* Admin Only Route */}
        <Route path="/admin" element={
          <PrivateRoute role="admin">
            <AdminPanel />
          </PrivateRoute>
        } />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
