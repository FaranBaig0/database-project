import { useState } from "react";
import axios from "axios";
import "./css/AddContact.css";

export default function AddContact() {
  const [friendEmail, setFriendEmail] = useState("");
  const [message, setMessage] = useState("");
  const token = localStorage.getItem("token");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        "http://localhost:5000/api/friend-requests",
        { Friend_Email: friendEmail },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessage("✅ " + res.data.message);
      setFriendEmail("");
    } catch (err) {
      setMessage("❌ " + (err.response?.data?.message || "Error sending request"));
    }
  };

  return (
    <div className="add-contact-container">
      <div className="add-contact-card">
        <h2 className="title">Send a Friend Request 🤝</h2>
        <p className="subtitle">
          Enter your friend’s email and start chatting instantly.
        </p>

        <form className="contact-form" onSubmit={handleSubmit}>
          <div className="input-group">
            <span className="icon">📧</span>
            <input
              type="email"
              value={friendEmail}
              onChange={(e) => setFriendEmail(e.target.value)}
              placeholder="Friend's Email"
              required
            />
          </div>
          <button type="submit" className="send-btn">
            Send Request
          </button>
        </form>

        {message && <p className={`message ${message.includes("✅") ? "success" : "error"}`}>{message}</p>}

        <div className="tips">
          <h4>💡 Tips</h4>
          <ul>
            <li>Make sure the email is registered with our app.</li>
            <li>You can only send one request per user at a time.</li>
            <li>Check your requests page to see pending invites.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
