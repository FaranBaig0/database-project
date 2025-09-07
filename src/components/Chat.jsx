import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import "./css/Chat.css";

const Chat = ({ friendId }) => {
  const [messages, setMessages] = useState([]);
  const token = localStorage.getItem("token");
  const bottomRef = useRef(null);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/api/messages/${friendId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setMessages(res.data);
      } catch (err) {
        console.error("Fetch failed", err);
      }
    };
    fetchMessages();
  }, [friendId]);

  // ✅ Scroll to bottom whenever messages update
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="chat-container">
      <div className="chat-box">
        {messages.map((m) => (
          <div
            key={m.Message_ID}
            className={`chat-message ${m.isSender ? "sent" : "received"}`}
          >
            <div className="message-header">
              <span className="sender">{m.SenderName}</span>
              <span className="time">
                {new Date(m.Sent_At).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            </div>
            <div className="message-content">{m.Content}</div>
          </div>
        ))}
        <div ref={bottomRef} /> {/* 👈 keeps chat scrolled to latest */}
      </div>
    </div>
  );
};

export default Chat;
