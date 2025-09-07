import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";
import { FaApple } from "react-icons/fa";
import "./css/Register.css";
import RegisterImg from "../assets/register.jpg"; // your image

const Register = () => {
  const navigate = useNavigate();
  const [formdata, setFormdata] = useState({
    Username: "",
    Email: "",
    PasswordHash: "",
    Phone: "",
  });

  const handleChange = (e) => {
    setFormdata({ ...formdata, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/api/users", formdata);
      alert("Account registered successfully! " + res.data.message);
      navigate("/login");
    } catch (err) {
      console.error("Error submitting form:", err);
      alert("Registration failed");
    }
  };

  return (
    <div className="register-container">
      <div className="register-card">
        {/* Left Image */}
        <div className="register-image">
          <img src={RegisterImg} alt="Register" />
        </div>

        {/* Right Form */}
        <div className="register-form-container">
          <h1>Create Account</h1>
          <p className="welcome-text">
            Join <span className="brand">VERVAX</span> and start chatting instantly!
          </p>

          <form onSubmit={handleSubmit} className="register-form">
            <input
              type="text"
              name="Username"
              placeholder="Full Name"
              onChange={handleChange}
              value={formdata.Username}
              required
            />
            <input
              type="email"
              name="Email"
              placeholder="Email Address"
              onChange={handleChange}
              value={formdata.Email}
              required
            />
            <input
              type="password"
              name="PasswordHash"
              placeholder="Password"
              onChange={handleChange}
              value={formdata.PasswordHash}
              required
            />
            <input
              type="number"
              name="Phone"
              placeholder="Phone Number"
              onChange={handleChange}
              value={formdata.Phone}
              required
            />
            <button type="submit" className="submit-btn">
              Register
            </button>
          </form>

          {/* Social Login */}
          <div className="social-login">
            <button className="google-btn">
              <FcGoogle size={20} /> Google
            </button>
            <button className="apple-btn">
              <FaApple size={20} /> Apple
            </button>
          </div>

          {/* Links */}
          <div className="link-text">
            Already have an account? <Link to="/login">Login</Link>
          </div>
          <div className="extra-info">
            <p>
              By signing up, you agree to our{" "}
              <Link to="/terms">Terms</Link> &{" "}
              <Link to="/privacy">Privacy Policy</Link>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
