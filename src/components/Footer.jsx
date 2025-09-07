import React from "react";
import "./css/Footer.css";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        
        {/* About Section */}
        <div className="footer-about">
          <h2 className="footer-logo">VERVAX</h2>
          <p>
            VERVAX is your go-to platform for seamless communication.  
            Manage contacts, chat with friends, and stay connected anytime, anywhere.
          </p>
        </div>

        {/* Quick Links */}
        <div className="footer-links">
          <h3>Quick Links</h3>
          <ul>
            <li><a href="/about">About</a></li>
            <li><a href="/privacy">Privacy Policy</a></li>
            <li><a href="/contact">Contact</a></li>
            <li><a href="/help">Help & Support</a></li>
          </ul>
        </div>

        {/* Contact Info */}
        <div className="footer-contact">
          <h3>Contact Us</h3>
          <p>Email: support@vervax.com</p>
          <p>Phone: +92 309 5013000</p>
          <p>Lahore, Pakistan</p>
        </div>

        {/* Newsletter */}
        <div className="footer-newsletter">
          <h3>Stay Updated</h3>
          <p>Subscribe to get the latest updates and news.</p>
          <form>
            <input type="email" placeholder="Enter your email" required />
            <button type="submit">Subscribe</button>
          </form>
        </div>
      </div>

      {/* Social Icons + Bottom Bar */}
      <div className="footer-bottom">
        <div className="footer-socials">
          <a href="#"><i className="fab fa-facebook-f"></i></a>
          <a href="#"><i className="fab fa-twitter"></i></a>
          <a href="#"><i className="fab fa-instagram"></i></a>
          <a href="#"><i className="fab fa-linkedin-in"></i></a>
        </div>
        <p>© {new Date().getFullYear()} VERVAX. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
