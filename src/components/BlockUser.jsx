import { useState, useEffect } from "react";
import axios from "axios";
import "./css/BlockUser.css";

export default function BlockUser() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [blockedUsers, setBlockedUsers] = useState([]);
  const token = localStorage.getItem("token");

  // Fetch blocked users
  useEffect(() => {
    axios
      .get("http://localhost:5000/api/blocked-users", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setBlockedUsers(res.data))
      .catch((err) => console.error(err));
  }, [token]);

  // Handle blocking
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        "http://localhost:5000/api/block",
        { Blocked_Email: email },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessage(res.data.message);
      setEmail("");
      // refresh blocked list
      setBlockedUsers([...blockedUsers, { Email: email }]);
    } catch (err) {
      setMessage(err.response?.data?.message || "Error blocking user");
    }
  };

  // Handle unblocking
  const unblockUser = async (blockedEmail) => {
    try {
      const res = await axios.post(
        "http://localhost:5000/api/unblock",
        { Blocked_Email: blockedEmail },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessage(res.data.message);
      setBlockedUsers(blockedUsers.filter((u) => u.Email !== blockedEmail));
    } catch (err) {
      setMessage(err.response?.data?.message || "Error unblocking user");
    }
  };

  return (
    <div className="block-container">
      <div className="block-card">
        <h2 className="title">Block a User</h2>
        <p className="subtitle">
          Use this feature to block users who are disturbing you. They will no longer be able to send you messages or requests.
        </p>

        <form onSubmit={handleSubmit} className="block-form">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter user's email"
            required
          />
          <button type="submit" className="block-btn">Block</button>
        </form>

        {message && <p className="message">{message}</p>}

        {/* List of blocked users */}
        
        {/* Safety tips */}
        <div className="tips">
          <h4>Safety Tips</h4>
          <ul>
            <li>Blocked users cannot message you or send friend requests.</li>
            <li>Unblock only when you feel safe.</li>
            <li>Report abusive users to the support team.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
