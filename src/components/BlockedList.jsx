import { useEffect, useState } from "react";
import axios from "axios";
import "./css/BlockedList.css";

export default function BlockedList() {
  const [blocked, setBlocked] = useState([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/blocked", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setBlocked(res.data))
      .catch((err) => console.error(err));
  }, [token]);

  const unblock = async (id) => {
    try {
      const res = await axios.delete(`http://localhost:5000/api/block/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert(res.data.message);
      setBlocked(blocked.filter((b) => b.Block_ID !== id));
    } catch {
      alert("Error unblocking user");
    }
  };

  return (
    <div className="blocked-container">
      <div className="blocked-card">
        <h2 className="title">Blocked Users</h2>
        <p className="subtitle">
          Users you have blocked will appear here. You can unblock them to reconnect.
        </p>

        {blocked.length === 0 ? (
          <p className="no-blocked">You haven't blocked any users yet.</p>
        ) : (
          <ul className="blocked-list">
            {blocked.map((b) => (
              <li key={b.Block_ID} className="blocked-item">
                <div className="blocked-info">
                  <h3>{b.Username}</h3>
                  <p>{b.Email}</p>
                </div>
                <button
                  className="unblock-btn"
                  onClick={() => unblock(b.Block_ID)}
                >
                  Unblock
                </button>
              </li>
            ))}
          </ul>
        )}

        <div className="tips">
          <h4>Tip:</h4>
          <ul>
            <li>Blocked users cannot send you messages or friend requests.</li>
            <li>You can unblock users anytime to reconnect.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
