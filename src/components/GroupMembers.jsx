import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, Link } from "react-router-dom";
import "./css/GroupMembers.css"; // add this line

export default function GroupMembers() {
  const { groupId } = useParams();
  const token = localStorage.getItem("token");
  const myId = localStorage.getItem("User_ID");
  const [members, setMembers] = useState([]);
  const [newMemberId, setNewMemberId] = useState("");
  const [isCreator, setIsCreator] = useState(false);

  const api = axios.create({
    baseURL: "http://localhost:5000",
    headers: { Authorization: `Bearer ${token}` }
  });

  const loadMembers = async () => {
    const res = await api.get(`/api/groups/${groupId}/members`);
    setMembers(res.data);
  };

  const checkCreator = async () => {
    try {
      await api.post(`/api/groups/${groupId}/members`, { userId: myId });
      setIsCreator(true);
    } catch (e) {
      setIsCreator(e?.response?.status !== 403 ? true : false);
    }
  };

  useEffect(() => {
    loadMembers();
    checkCreator();
    
  }, [groupId]);

  const addMember = async (e) => {
    e.preventDefault();
    if (!newMemberId) return alert("Enter a user ID");
    try {
      await api.post(`/api/groups/${groupId}/members`, {
        userId: Number(newMemberId)
      });
      setNewMemberId("");
      loadMembers();
      alert("Member added");
    } catch (err) {
      alert(err.response?.data?.message || "Failed to add");
    }
  };

  const removeMember = async (uid) => {
    if (!window.confirm("Remove this member?")) return;
    try {
      await api.delete(`/api/groups/${groupId}/members/${uid}`);
      loadMembers();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to remove");
    }
  };

  const leaveGroup = async () => {
    if (!window.confirm("Leave this group?")) return;
    try {
      await api.delete(`/api/groups/${groupId}/members/${myId}`);
      window.history.back();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to leave");
    }
  };

  return (
    <div className="group-container">
      <h2>Group Members</h2>
      <div className="link-box">
        <Link to={`/groups/${groupId}/chat`} className="link-btn">
          Go to Group Chat
        </Link>
      </div>

      {isCreator && (
        <form onSubmit={addMember} className="add-member-form">
          <input
            type="number"
            placeholder="Enter User ID"
            value={newMemberId}
            onChange={(e) => setNewMemberId(e.target.value)}
          />
          <button type="submit">+</button>
        </form>
      )}

      <ul className="member-list">
        {members.map((m) => (
          <li key={m.User_ID}>
            <span>
              {m.Username} <small>(ID {m.User_ID})</small>
            </span>
            {isCreator && Number(m.User_ID) !== Number(myId) && (
              <button className="remove-btn" onClick={() => removeMember(m.User_ID)}>
                ✕
              </button>
            )}
          </li>
        ))}
      </ul>

      <hr />
      <button className="leave-btn" onClick={leaveGroup}>
        Leave Group
      </button>
    </div>
  );
}
