import { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext.jsx";
import Navbar from "./components/Navbar/Navbar.jsx";
import Footer from "./components/footer/Footer.jsx";
import Home from "./pages/Home.jsx";
import Login from "./pages/login/Login.jsx";
import Register from "./pages/login/Register.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import AdminPanel from "./pages/Admin/AdminPanel.jsx";
import AdminAddTable from "./pages/Admin/AdminAddTable.jsx"; // 1. Import the new component
import AdminEditTable from "./pages/Admin/AdminEditTable.jsx";
import Bookings from "./pages/Bookings.jsx";
import ForgotPassword from "./pages/login/ForgotPassword.jsx";
import ResetPassword from "./pages/login/ResetPassword.jsx";
import PrivateRoute from "./pages/PrivateRoute.jsx";
import UserProfile from "./pages/user/UserProfile.jsx"; 
import PrivacyPolicy from "./components/footer/PrivacyPolicy.jsx";
import TermsOfService from "./components/footer/TermsOfService.jsx";
import HelpCenter from "./components/footer/HelpCenter.jsx";
import ContactUs from "./components/footer/ContactUs.jsx";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";



function App() {
  useEffect(() => {
    document.title = "FineDine - Premium Restaurant Booking";
  }, []);

  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/terms-of-service" element={<TermsOfService />} />
            <Route path="/help" element={<HelpCenter />} />
            <Route path="/contact" element={<ContactUs />} />
            
            {/* Protected Routes */}
            <Route
              path="/dashboard"
              element={<PrivateRoute><Dashboard /></PrivateRoute>}
            />
            <Route
              path="/bookings"
              element={<PrivateRoute><Bookings /></PrivateRoute>}
            />
            <Route
              path="/profile"
              element={<PrivateRoute><UserProfile /></PrivateRoute>}
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
        <Footer />
      </Router>
    </AuthProvider>
  );
}

export default App;