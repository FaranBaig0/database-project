import { useEffect, useState } from "react";
import axios from "axios";
import "./css/FriendRequests.css";

export default function FriendRequests() {
  const [requests, setRequests] = useState([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/friend-requests", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setRequests(res.data))
      .catch((err) => console.error(err));
  }, [token]);

  const respond = async (id, action) => {
    try {
      const res = await axios.post(
        `http://localhost:5000/api/friend-requests/${id}/respond`,
        { action },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert(res.data.message);
      setRequests(requests.filter((r) => r.Request_ID !== id));
    } catch (err) {
      alert("Error responding to request");
    }
  };

  return (
    <div className="requests-container">
      <div className="requests-card">
        <h2 className="title">Pending Friend Requests</h2>
        <p className="subtitle">
          Here you can see all the friend requests sent to you. Accept to start chatting or reject if you don’t want to connect.
        </p>

        {requests.length === 0 ? (
          <p className="no-requests">You have no pending requests.</p>
        ) : (
          <ul className="requests-list">
            {requests.map((req) => (
              <li key={req.Request_ID} className="request-item">
                <div className="request-info">
                  <h3>{req.Username}</h3>
                  <p>{req.Email}</p>
                </div>
                <div className="request-actions">
                  <button
                    className="accept-btn"
                    onClick={() => respond(req.Request_ID, "accept")}
                  >
                    Accept
                  </button>
                  <button
                    className="reject-btn"
                    onClick={() => respond(req.Request_ID, "reject")}
                  >
                    Reject
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}

        <div className="tips">
          <h4>Note:</h4>
          <ul>
            <li>You can only have one pending request per user.</li>
            <li>Accepting a request will allow instant chat access.</li>
            <li>Rejected requests can be sent again later if needed.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
