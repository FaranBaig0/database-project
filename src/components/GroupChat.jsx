import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useParams, Link } from "react-router-dom";
import "./css/GroupChat.css";

export default function GroupChat() {
  const { groupId } = useParams();
  const token = localStorage.getItem("token");
  const myId = localStorage.getItem("User_ID");
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const bottomRef = useRef(null);

  const api = axios.create({
    baseURL: "http://localhost:5000",
    headers: { Authorization: `Bearer ${token}` },
  });

  const loadMessages = async () => {
    try {
      const res = await api.get(`/api/groups/${groupId}/messages`);
      setMessages(res.data);
      setTimeout(
        () => bottomRef.current?.scrollIntoView({ behavior: "smooth" }),
        50
      );
    } catch (err) {
      alert(err.response?.data?.message || "Failed to fetch messages");
    }
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    try {
      await api.post(`/api/groups/${groupId}/messages`, { Content: text });
      setText("");
      loadMessages();
    } catch (err) {
      alert(err.response?.data?.message || "Send failed");
    }
  };

  const deleteMessage = async (id) => {
    if (!window.confirm("Delete this message?")) return;
    try {
      await api.delete(`/api/groups/${groupId}/messages/${id}`);
      setMessages((prev) =>
        prev.filter((m) => m.Group_Message_ID !== id)
      );
    } catch (err) {
      alert(err.response?.data?.message || "Delete failed");
    }
  };

  useEffect(() => {
    loadMessages();
    const t = setInterval(loadMessages, 5000); 
    return () => clearInterval(t);
   
  }, [groupId]);

  return (
    <div className="chat-wrapper">
      <header className="chat-header">
        <h2>Group Chat</h2>
        <Link to={`/groups/${groupId}/members`} className="members-link">
          Manage Members
        </Link>
      </header>

      <div className="chat-box">
        {messages.map((m) => {
          const mine = Number(m.User_ID) === Number(myId);
          return (
            <div
              key={m.Group_Message_ID}
              className={`chat-message ${mine ? "sent" : "received"}`}
            >
              <div className="message-meta">
                {m.Username} • {new Date(m.Sent_At).toLocaleString()}
              </div>
              <div className="message-bubble">{m.Content}</div>
              {mine && (
                <button
                  className="delete-btn"
                  onClick={() => deleteMessage(m.Group_Message_ID)}
                >
                  Delete
                </button>
              )}
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      <form className="chat-input" onSubmit={sendMessage}>
        <input
          type="text"
          value={text}
          placeholder="Type a message..."
          onChange={(e) => setText(e.target.value)}
        />
        <button type="submit">Send</button>
      </form>
    </div>
  );
}
