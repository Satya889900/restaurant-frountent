import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext.jsx";
import Navbar from "./components/Navbar.jsx";
import Home from "./pages/Home.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import AdminPanel from "./pages/AdminPanel.jsx";
import AdminAddTable from "./pages/AdminAddTable.jsx"; // 1. Import the new component
import AdminEditTable from "./pages/AdminEditTable.jsx";
import Bookings from "./pages/Bookings.jsx";
import ForgotPassword from "./pages/ForgotPassword.jsx";
import ResetPassword from "./pages/ResetPassword.jsx";
import PrivateRoute from "./pages/PrivateRoute.jsx";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";


function App() {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <main className="pt-20">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            
            {/* Protected Routes */}
            <Route
              path="/dashboard"
              element={<PrivateRoute><Dashboard /></PrivateRoute>}
            />
            <Route
              path="/bookings"
              element={<PrivateRoute><Bookings /></PrivateRoute>}
            />
            
            {/* Admin Routes */}
            <Route
              path="/admin"
              element={<PrivateRoute roles={['admin']}><AdminPanel /></PrivateRoute>}
            />
            <Route
              path="/admin/add-table"
              element={
                <PrivateRoute roles={['admin']}><AdminAddTable /></PrivateRoute>
              }
            />
            <Route
              path="/admin/edit-table/:id"
              element={<PrivateRoute roles={['admin']}><AdminEditTable /></PrivateRoute>}
            />
          </Routes>
        </main>
      </Router>
    </AuthProvider>
  );
}

export default App;