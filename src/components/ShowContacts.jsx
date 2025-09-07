import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "./css/ShowContacts.css";

export default function ShowContacts() {
  const [contacts, setContacts] = useState([]);
  const User_ID = localStorage.getItem("User_ID");
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!User_ID) return;
    axios
      .get(`http://localhost:5000/api/contacts/${User_ID}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setContacts(res.data))
      .catch((err) => console.error("Fetch error:", err));
  }, [User_ID, token]);

  const handleDelete = async (friendId) => {
    if (!window.confirm("Delete this contact?")) return;

    try {
      await axios.delete(
        `http://localhost:5000/api/contacts/${User_ID}/${friendId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setContacts((prev) =>
        prev.filter((c) => Number(c.User_ID) !== Number(friendId))
      );
    } catch (err) {
      console.error("Delete error:", err);
      alert(err.response?.data?.message || "Failed to delete contact");
    }
  };

  return (
    <div className="contacts-container">
      <div className="contacts-header">
        <h2>{localStorage.getItem("username")}'s Contacts</h2>
        <div className="btn-group">
          <Link to={`/addContact`} className="add-btn">Add Contact</Link>
          <Link to={`/requests`} className="add-btn">Request</Link>
          <Link to={`/blockedlist`} className="add-btn">Blocked Users</Link>
          <Link to={`/blockuser`} className="add-btn">Block</Link>
        </div>
      </div>

      {contacts.length === 0 ? (
        <p className="no-contacts">No contacts found.</p>
      ) : (
        <ul className="contacts-list">
          {contacts.map((c) => (
            <li key={c.Contact_ID} className="contact-card">
              <div className="contact-info">
                <h3>{c.Username}</h3>
                <p>{c.Email}</p>
                <p>{c.Phone}</p>
              </div>
              <div className="contact-actions">
                <Link to={`/chat/${c.User_ID}`} className="chat-btn">
                  Chat
                </Link>
                <button onClick={() => handleDelete(c.User_ID)}>Delete</button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
