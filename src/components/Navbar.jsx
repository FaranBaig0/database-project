import React, { useState, useEffect } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import "./css/navbar.css";

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isLoggedIn, setIsLogedIn] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const checkLoginStatus = () => {
    const token = localStorage.getItem("token");
    setIsLogedIn(!!token);
  };

  useEffect(() => {
    checkLoginStatus();
    window.addEventListener("storage", checkLoginStatus);

    return () => {
      window.removeEventListener("storage", checkLoginStatus);
    };
  }, [location]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLogedIn(!!token);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLogedIn(false);
    window.dispatchEvent(new Event("storage"));
    navigate("/login");
  };

  return (
    <header>
      <nav className="navbar">
        <div className="logo">
          <Link to="/home">VERVAX<span>.</span></Link>
        </div>

        {/* Hamburger for mobile */}
        <div 
          className={`hamburger ${menuOpen ? "active" : ""}`} 
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <span></span>
          <span></span>
          <span></span>
        </div>

        <div className={`nav-links ${menuOpen ? "active" : ""}`}>
          <ol>
            <li><Link to="/home" onClick={() => setMenuOpen(false)}>Home</Link></li>
            <li><Link to="/showContact" onClick={() => setMenuOpen(false)}>Contacts</Link></li>
            <li><Link to="/groups" onClick={() => setMenuOpen(false)}>Groups</Link></li>
            <li><Link to="/users" onClick={() => setMenuOpen(false)}>Users</Link></li>
            {isLoggedIn ? (
              <li className="btn">
                <button onClick={() => { handleLogout(); setMenuOpen(false); }}>Log Out</button>
              </li>
            ) : (
              <>
                <li className="btn"><Link to="/login" onClick={() => setMenuOpen(false)}>Sign In</Link></li>
                <li className="btn"><Link to="/register" onClick={() => setMenuOpen(false)}>Sign Up</Link></li>
              </>
            )}
          </ol>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
