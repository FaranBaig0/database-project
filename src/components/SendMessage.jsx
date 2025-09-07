import React, { useState } from "react";
import axios from "axios";
import "./css/SendMessage.css";

const SendMessage = ({ receiverId }) => {
  const [text, setText] = useState("");
  const token = localStorage.getItem("token");

  const handleSend = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;

    try {
      await axios.post(
        "http://localhost:5000/api/messages",
        { Receiver_ID: receiverId, Content: text },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setText("");
    } catch (err) {
      alert("Failed: " + (err.response?.data?.message || "Error"));
    }
  };

  return (
    <form className="send-message-form" onSubmit={handleSend}>
      <input
        type="text"
        className="message-input"
        placeholder="Type your message..."
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <button type="submit" className="send-btn">➤</button>
    </form>
  );
};

export default SendMessage;
