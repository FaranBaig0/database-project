import React from "react";
import { useLocation, Link } from "react-router-dom";
import "./css/Home.css";

const Home = () => {
  const location = useLocation();
  const { name } = location.state || {};

  return (
    <div className="home-container">
      <div className="home-card">

        {/* Hero Section */}
        <section className="hero-section">
          <div className="hero-content">
            <h1 className="hero-title">Welcome {name ? name : "User"} 👋</h1>
            <p className="hero-subtitle">
              Connect instantly with your friends, teams, and communities.  
              A fast, secure and simple way to stay in touch. 🚀
            </p>
            <div className="hero-actions">
              <Link to="/showContact" className="home-btn big-btn">Contacts</Link>
              <Link to="/addContact" className="home-btn big-btn">Add Contact</Link>
              <Link to="/groups" className="home-btn big-btn">Groups</Link>
            </div>
          </div>
          <div className="hero-image">
            <img src="https://img.freepik.com/free-vector/chatbot-concept-illustration_114360-5522.jpg
" alt="Chat App" />
          </div>
        </section>

        <hr className="home-divider" />

        {/* Features */}
        <section className="features-section">
          <h2 className="section-title">✨ What You Can Do</h2>
          <div className="features-grid">
            <div className="feature-card">
              <img src="https://img.icons8.com/color/96/000000/contacts.png" alt="Contacts" />
              <h3>📞 Manage Contacts</h3>
              <p>Easily add, edit, or remove contacts and keep your list organized.</p>
            </div>
            <div className="feature-card">
              <img src="https://cdn-icons-png.flaticon.com/512/134/134914.png" alt="Chat" />
              <h3>💬 Chat in Real-Time</h3>
              <p>Stay connected with instant messaging designed for simplicity.</p>
            </div>
            <div className="feature-card">
              <img src="https://img.icons8.com/color/96/000000/conference.png" alt="Groups" />
              <h3>👥 Create Groups</h3>
              <p>Start group conversations and bring people together in one place.</p>
            </div>
          </div>
        </section>

        <hr className="home-divider" />

        {/* How It Works */}
        <section className="how-it-works">
          <h2 className="section-title">⚡ How It Works</h2>
          <div className="steps-grid">
            <div className="step-card">
              <span className="step-number">1</span>
              <h3>Sign Up</h3>
              <p>Create your account and set up your profile in seconds.</p>
            </div>
            <div className="step-card">
              <span className="step-number">2</span>
              <h3>Add Contacts</h3>
              <p>Import or add your friends, colleagues, and groups.</p>
            </div>
            <div className="step-card">
              <span className="step-number">3</span>
              <h3>Start Chatting</h3>
              <p>Send messages, create groups, and stay connected 24/7.</p>
            </div>
          </div>
        </section>

        <hr className="home-divider" />

        {/* Testimonials */}
        <section className="testimonials">
          <h2 className="section-title">🌟 Loved by Users</h2>
          <div className="testimonials-grid">
            <div className="testimonial-card">
              <p>"This platform made team communication effortless!"</p>
              <img src="https://randomuser.me/api/portraits/women/68.jpg" alt="User 1" className="avatar"/>
              <h4>- Sarah K.</h4>
            </div>
            <div className="testimonial-card">
              <p>"I stay connected with my family every day. Super easy!"</p>
              <img src="https://randomuser.me/api/portraits/men/33.jpg" alt="User 2" className="avatar"/>
              <h4>- Ali R.</h4>
            </div>
            <div className="testimonial-card">
              <p>"Best group chat experience I've ever had 💯"</p>
              <img src="https://randomuser.me/api/portraits/men/15.jpg" alt="User 3" className="avatar"/>
              <h4>- John D.</h4>
            </div>
          </div>
        </section>

        <hr className="home-divider" />

        {/* CTA */}
        <section className="cta-section">
          <h2 className="cta-title">🚀 Ready to Connect?</h2>
          <p className="cta-subtitle">Join thousands already using our platform to stay connected.</p>
          <Link to="/addContact" className="home-btn big-btn">Get Started</Link>
        </section>

      </div>
    </div>
  );
};

export default Home;
