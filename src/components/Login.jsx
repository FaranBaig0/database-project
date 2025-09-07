import axios from "axios";
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./css/Login.css";

const Login = () => {
  const navigate = useNavigate();
  const [logindata, setLoginData] = useState({
    Email: "",
    PasswordHash: "",
  });

  const handleChange = (e) => {
    setLoginData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/login", logindata);

      localStorage.setItem("User_ID", res.data.User_ID);
      localStorage.setItem("username", res.data.Username);
      localStorage.setItem("token", res.data.token);

      alert("Login Successful!");
      window.dispatchEvent(new Event("storage"));
      navigate("/home", { state: { name: res.data.Username } });
    } catch (err) {
      alert(
        "Login failed: " + (err.response?.data?.message || "Unknown Error")
      );
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        {/* Left Image */}
        <div className="login-image">
          <img
            src="https://images.unsplash.com/photo-1477346611705-65d1883cee1e?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTh8fGRhcmslMjBhZXN0aGV0aWN8ZW58MHx8MHx8fDA%3D"
            alt="Login Visual"
          />
        </div>

        {/* Right Form */}
        <div className="login-form-container">
          <h1>
            Welcome Back to <span className="brand">VERVAX</span>
          </h1>
          <p className="welcome-text">Log in to continue your journey 🚀</p>

          <form className="login-form" onSubmit={handleSubmit}>
            <input
              type="email"
              name="Email"
              placeholder="Enter your email"
              value={logindata.Email}
              onChange={handleChange}
              required
            />
            <input
              type="password"
              name="PasswordHash"
              placeholder="Enter your password"
              value={logindata.PasswordHash}
              onChange={handleChange}
              required
            />
            <button type="submit">Login</button>
          </form>

          <p className="signup-text">
            Don’t have an account? <Link to={"/register"}>Sign Up</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
