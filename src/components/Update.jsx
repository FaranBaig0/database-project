import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "./css/UpdateUser.css"; // 👈 Import CSS file

export default function UpdateUser() {
  const { User_ID } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    Username: "",
    Email: "",
    Phone: "",
    PasswordHash: ""
  });
  const [message, setMessage] = useState("");

  useEffect(() => {
    axios
      .get(`http://localhost:5000/api/users`)
      .then((res) => {
        const user = res.data.find((u) => u.User_ID == User_ID);
        if (user) {
          setFormData({
            Username: user.Username,
            Email: user.Email,
            Phone: user.Phone || "",
            PasswordHash: ""
          });
        }
      })
      .catch((err) => console.error(err));
  }, [User_ID]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:5000/api/users/${User_ID}`, formData);
      setMessage("updated ");
      setTimeout(() => navigate("/users"), 1500);
    } catch (err) {
      console.error(err);
      setMessage(" Error ");
    }
  };

  return (
    <div className="update-container">
      <h2>Update User</h2>
      <form onSubmit={handleSubmit} className="update-form">
        <label>Username</label>
        <input
          type="text"
          name="Username"
          value={formData.Username}
          onChange={handleChange}
          required
        />

        <label>Email</label>
        <input
          type="email"
          name="Email"
          value={formData.Email}
          onChange={handleChange}
          required
        />

        <label>Phone</label>
        <input
          type="text"
          name="Phone"
          value={formData.Phone}
          onChange={handleChange}
        />

        <label>New Password</label>
        <input
          type="password"
          name="PasswordHash"
          value={formData.PasswordHash}
          onChange={handleChange}
          placeholder="Enter new password"
        />

        <button type="submit" className="update-btn">
          Update
        </button>
      </form>
      {message && <p className="message">{message}</p>}
    </div>
  );
}
