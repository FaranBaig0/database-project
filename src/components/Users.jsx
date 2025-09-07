import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "./css/Users.css"; // <-- Create a CSS file for styling

export default function Users() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/users")
      .then((res) => setUsers(res.data))
      .catch((err) => console.error(err));
  }, []);

  const deleteUser = async (userId) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;

    try {
      await axios.delete(`http://localhost:5000/api/users/${userId}`);
      setUsers(users.filter((u) => u.User_ID !== userId)); 
    } catch (err) {
      alert("Delete failed: " + (err.response?.data?.message || "Unknown error"));
    }
  };

  return (
    <div className="users-container">
      <h2>All Users</h2>
      {users.length === 0 ? (
        <p>No users found.</p>
      ) : (
        <ul className="user-list">
          {users.map((user) => (
            <li key={user.User_ID} className="user-item">
              <div>
                <strong>{user.Username}</strong>  
                <br />
                <span>{user.Email}</span>
              </div>
              <div className="actions">
                <Link to={`/update/${user.User_ID}`} className="update-btn">
                  Update
                </Link>
                <button
                  onClick={() => deleteUser(user.User_ID)}
                  className="delete-btn"
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
