import { useState, useContext, useEffect } from "react";
import { login as loginUser } from "../services/authService.js";
import { AuthContext } from "../context/AuthContext.jsx";
import { useNavigate, Link } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { user, login } = useContext(AuthContext);
  const navigate = useNavigate();

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      if (user.role === "admin") navigate("/admin");
      else navigate("/");
    }
  }, [user, navigate]);
const handleSubmit = async (e) => {
  e.preventDefault();
  if (!email || !password) return alert("All fields are required");

 try {
    const data = await loginUser({ email, password });
    login(data.user, data.token); // pass both user and token
  } catch (err) {
    console.error(err.response?.data || err);
    alert(err.response?.data?.message || "Login failed");
  }
};


  return (
    <div className="max-w-md mx-auto mt-10 p-6 border rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Login</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-2 border rounded"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-2 border rounded"
        />
        <button className="w-full bg-blue-500 text-white py-2 rounded">Login</button>
      </form>
      <p className="mt-4 text-center">
        Don't have an account? <Link to="/register" className="text-blue-600">Register</Link>
      </p>
    </div>
  );
};

export default Login;
