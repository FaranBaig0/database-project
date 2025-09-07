import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "./css/Groups.css";

export default function Groups() {
  const [groups, setGroups] = useState([]);
  const token = localStorage.getItem("token");

  const api = axios.create({
    baseURL: "http://localhost:5000",
    headers: { Authorization: `Bearer ${token}` },
  });

  useEffect(() => {
    const loadGroups = async () => {
      try {
        const res = await api.get("/api/groups");
        setGroups(res.data);
      } catch (err) {
        alert(err.response?.data?.message || "Failed to load groups");
      }
    };
    loadGroups();
  }, []);

  return (
    <div className="groups-container">
      <div className="groups-header">
        <h2>My Groups</h2>
        <Link to="/create-group" className="create-btn">
          + Create Group
        </Link>
      </div>

      <ul className="groups-list">
        {groups.map((g) => (
          <li key={g.Group_ID} className="group-item">
            <div className="group-info">
              <h3 className="group-name">{g.Group_Name}</h3>
              <p className="group-creator">Created by {g.CreatorName}</p>
              <p className="latest-msg">
                Latest: {g.LatestMessage || "No messages yet"}
              </p>
            </div>

            <div className="group-meta">
              <div className="members">
                {g.Members?.slice(0, 4).map((m, idx) => (
                  <div
                    key={idx}
                    className="avatar"
                    title={m.Username}
                    style={{ backgroundImage: `url(${m.Avatar || '/default-avatar.png'})` }}
                  ></div>
                ))}
                {g.Members?.length > 4 && (
                  <span className="more-members">+{g.Members.length - 4}</span>
                )}
              </div>

              <div className="group-actions">
                <Link to={`/groups/${g.Group_ID}/chat`} className="group-link">
                  Chat
                </Link>
                <Link
                  to={`/groups/${g.Group_ID}/members`}
                  className="group-link"
                >
                  Members
                </Link>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
