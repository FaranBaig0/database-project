import React, { useState } from "react";
import axios from "axios";
import "./css/CreateGroup.css"; // import CSS file

export default function CreateGroup() {
  const [groupName, setGroupName] = useState("");
  const token = localStorage.getItem("token");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        "http://localhost:5000/api/groups",
        { Group_Name: groupName },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Group ban gaya hai  " + res.data.Group_ID);
      setGroupName("");
    } catch (err) {
      alert(" Error: " + (err.response?.data?.message || "Failed"));
    }
  };

  return (
    <div className="create-group-container">
      <div className="create-group-card">
        <h2>Create New Group</h2>

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
            placeholder="Enter group name"
          />

          <button type="submit">Create Group</button>
        </form>
      </div>
    </div>
  );
}
