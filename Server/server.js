
const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bcrypt= require('bcrypt')
const jwt= require('jsonwebtoken')


require('dotenv').config();
const JWT_SECRET = process.env.JWT_SECRET;

// JWT auth middleware
function auth(req, res, next) {
  const token = req.header("Authorization")?.replace("Bearer ", "");

  if (!token) {
    return res.status(401).json({ message: "No token, authorization denied" });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded; 
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
}

const saltRounds=10;

const app = express();
app.use(cors());
app.use(express.json());

//db attach krnay kai liay
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'dbproject'
});
// agar db mei error ay3e us kai liay hai 
db.connect(err => {
  if (err) throw err;
  console.log('Connected ');
});

// ye deekhne kai liay hai 
app.get('/api/users', (req, res) => {
  db.query('SELECT * FROM Users', (err, result) => {
    if (err) return res.status(500).send(err);
    res.json(result);
  });
});
//ye register kai liay code ha i
// app.post('/users',async (req,res)=>{
//     const{Username,Email,PasswordHash,Phone} =req.body;
//     const hashedPassword = await bcrypt.hash(PasswordHash, saltRounds);

//     db.query('INSERT INTO Users (Username,Email,PasswordHash,Phone) VALUES(?,?,?,?)',[Username,Email,hashedPassword,Phone],(err,result)=>{
//         if(err) return res.status(500).json(err);
//         res.json({message:'User Created',id:result.insertId})
//     } )
    
// });

app.post('/api/users', async (req, res) => {
  try {
    const { Username, Email, PasswordHash, Phone } = req.body;

    if (!Username || !Email || !PasswordHash) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const hashedPassword = await bcrypt.hash(PasswordHash, saltRounds);

    db.query(
      'INSERT INTO users (Username, Email, PasswordHash, Phone) VALUES (?, ?, ?, ?)',
      [Username, Email, hashedPassword, Phone],
      (err, result) => {
        if (err) {
          console.error('Insert error:', err);
          return res.status(500).json({ message: 'Insert failed' });
        }

        res.status(201).json({ message: 'User Created', id: result.insertId });
      }
    );

  } catch (error) {
    console.error('Server error:', error.message);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// yahan pe login ka code hai sara kai kis trh kia hai 
app.post('/login',(req,res)=>{
    const {Email,PasswordHash}=req.body;

    db.query('SELECT * FROM Users WHERE Email=?',
        [Email],
        async(err,result)=>{
            if(err) return res.status(500).json(err);
            if(result.length === 0) return res.status(401).json({message:'User Not Found'});

            const user = result[0];
            const isMatch = await bcrypt.compare(PasswordHash,user.PasswordHash);
            if(!isMatch) return res.status(401).json({message:'Invalid credentials'});

            const token = jwt.sign({id:user.User_ID,Email:user.Email},JWT_SECRET,{expiresIn:'1h'});

            res.json({
                message:'Login Successful',
                token,
                User_ID: user.User_ID,   
                Username: user.Username  
            });
        }
    );
});


// app.put('/api/users/:User_ID', (req,res)=>{
//     const {Username,Email,Phone}= req.body;
//     const {User_ID} = req.params;
// db.query('UPDATE Users SET Username=?,Email=?,PasswordHash=?,Phone=? WHERE User_ID=?',[Username,Email,PasswordHash,Phone,User_ID], (err,result)=>{
// if(err) return res.status(500).json({Message:' User Not Found 404'})
//     res.json({ User_ID, Username, Email });
// })

// });
// ye user ko edit karnay kai liay hai 
app.put('/api/users/:User_ID', async (req, res) => {
  try {
    const { Username, Email, Phone, PasswordHash } = req.body;
    const { User_ID } = req.params;

    let query = 'UPDATE Users SET Username=?, Email=?, Phone=?';
    let values = [Username, Email, Phone];

    if (PasswordHash && PasswordHash.trim() !== "") {
      
      const bcrypt = require("bcrypt");
      const hashed = await bcrypt.hash(PasswordHash, 10);
      query += ', PasswordHash=?';
      values.push(hashed);
    }

    query += ' WHERE User_ID=?';
    values.push(User_ID);

    db.query(query, values, (err, result) => {
      if (err) return res.status(500).json({ message: 'Update failed' });

      if (result.affectedRows === 0) return res.status(404).json({ message: 'User not found' });

      res.json({ message: 'User updated successfully' });
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

//  user ko delete karna
app.delete('/api/users/:User_ID', (req, res) => {
  const { User_ID } = req.params;

  db.query(
    "DELETE FROM Users WHERE User_ID = ?",
    [User_ID],
    (err, result) => {
      if (err) {
        console.error("Delete error:", err);
        return res.status(500).json({ message: "Failed to delete user" });
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({ message: "User not found" });
      }

      res.json({ message: "User deleted successfully" });
    }
  );
});
//constacts add krna 
// POST /api/contacts
// app.post("/api/contacts", auth, (req, res) => {
//   const userId = req.user.id; // comes from JWT middleware
//   const { Friend_Email } = req.body;

//   if (!Friend_Email) {
//     return res.status(400).json({ message: "Friend email is required" });
//   }

//   // 1. Find friend by email
//   const findFriendSql = "SELECT User_ID FROM users WHERE Email = ?";
//   db.query(findFriendSql, [Friend_Email], (err, rows) => {
//     if (err) return res.status(500).json({ message: "Database error" });
//     if (rows.length === 0) return res.status(404).json({ message: "Friend not found" });

//     const friendId = rows[0].User_ID;

//     if (friendId === userId) {
//       return res.status(400).json({ message: "You cannot add yourself as a contact" });
//     }

//     // 2. Insert into contacts table (prevent duplicates)
//     const insertSql = `
//       INSERT INTO contacts (User_ID, Contact_User_ID)
//       SELECT ?, ? FROM DUAL
//       WHERE NOT EXISTS (
//         SELECT 1 FROM contacts WHERE User_ID = ? AND Contact_User_ID = ?
//       )
//     `;

//     db.query(insertSql, [userId, friendId, userId, friendId], (err2, result) => {
//       if (err2) return res.status(500).json({ message: "Database error" });

//       if (result.affectedRows === 0) {
//         return res.status(400).json({ message: "Contact already exists" });
//       }

//       res.json({ message: "Contact added successfully" });
//     });
//   });
// });

//contact delete karnay kai liay 
// delete a contact
app.delete('/api/contacts/:userId/:friendId', (req, res) => {
  const { userId, friendId } = req.params;

  db.query(
    'DELETE FROM contacts WHERE (User_ID = ? AND Contact_User_ID = ?)    OR (User_ID = ? AND Contact_User_ID = ?);',
    [userId, friendId,friendId,userId],
    (err, result) => {
      if (err) {
        console.error(" SQL Delete Error:", err); // log full error
        return res.status(500).json({ message: "Failed to remove contact", error: err.sqlMessage });
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({ message: "Contact not found" });
      }

      res.json({ message: " Contact removed" });
    }
  );
});



//show contacts
app.get('/api/contacts/:User_ID', (req, res) => {
  const{User_ID}=req.params;
  db.query(
    `SELECT c.Contact_ID, u.User_ID, u.Username, u.Email, u.Phone
     FROM contacts c
     JOIN users u ON c.Contact_User_ID = u.User_ID
     WHERE c.User_ID = ?`,
    [User_ID],
    (err, rows) => {
      if (err) {
        console.error("Fetch contacts error:", err.sqlMessage);
        return res.status(500).json({ message: "Failed to fetch contacts" });
      }
      res.json(rows);
    }
  );
});
// Get all accepted friends
// app.get("/api/friends", auth, (req, res) => {
//   const userId = req.user.id;

//   const sql = `
//     SELECT u.User_ID, u.Username, u.Email
//     FROM friendrequests fr
//     JOIN users u 
//       ON (u.User_ID = fr.Sender_ID OR u.User_ID = fr.Receiver_ID)
//     WHERE (fr.Sender_ID = ? OR fr.Receiver_ID = ?)
//       AND fr.Status = 'accepted'
//       AND u.User_ID != ?
//   `;

//   db.query(sql, [userId, userId, userId], (err, rows) => {
//     if (err) return res.status(500).json({ message: "Failed to load friends" });
//     res.json(rows);
//   });
// });

// Send message


// app.post('/api/messages', auth, (req, res) => {
//   const { Receiver_ID, Content } = req.body;
//   const Sender_ID = req.user.id; 

//   if (!Receiver_ID || !Content) {
//     return res.status(400).json({ message: "Receiver and content required" });
//   }

//   db.query(
//     "INSERT INTO messages (User_ID, Receiver_ID, Content) VALUES (?, ?, ?)",
//     [Sender_ID, Receiver_ID, Content],
//     (err, result) => {
//       if (err) {
//         console.error(" Message insert error:", err.sqlMessage);
//         return res.status(500).json({ message: "Failed to send message" });
//       }
//       res.json({ message: "Message sent", id: result.insertId });
//     }
//   );
// });

app.post("/api/messages", auth, (req, res) => {
  const { Receiver_ID, Content } = req.body;
  const Sender_ID = req.user.id;

  if (!Receiver_ID || !Content) {
    return res.status(400).json({ message: "Receiver and content required" });
  }

  // ✅ Check if sender or receiver has blocked each other
  const blockCheck = `
    SELECT 1 FROM blockedusers
    WHERE (Blocker_ID = ? AND Blocked_ID = ?)
       OR (Blocker_ID = ? AND Blocked_ID = ?)
  `;

  db.query(blockCheck, [Sender_ID, Receiver_ID, Receiver_ID, Sender_ID], (err, rows) => {
    if (err) {
      console.error("Block check error:", err.sqlMessage);
      return res.status(500).json({ message: "Database error" });
    }

    if (rows.length > 0) {
      return res.status(403).json({ message: "You cannot send messages (user is blocked)" });
    }

    // ✅ If not blocked, insert message
    db.query(
      "INSERT INTO messages (User_ID, Receiver_ID, Content) VALUES (?, ?, ?)",
      [Sender_ID, Receiver_ID, Content],
      (err2, result) => {
        if (err2) {
          console.error("Message insert error:", err2.sqlMessage);
          return res.status(500).json({ message: "Failed to send message" });
        }
        res.json({ message: "Message sent", id: result.insertId });
      }
    );
  });
});


// Get conversation between logged-in user and a friend
app.get('/api/messages/:friendId', auth, (req, res) => {
  const userId = req.user.id;
  const { friendId } = req.params;

  db.query(
    `SELECT m.*, u.Username AS SenderName
     FROM messages m
     JOIN users u ON m.User_ID = u.User_ID
     WHERE (m.User_ID=? AND m.Receiver_ID=?)
        OR (m.User_ID=? AND m.Receiver_ID=?)
     ORDER BY m.Sent_At ASC`,
    [userId, friendId, friendId, userId],
    (err, rows) => {
      if (err) {
        console.error(" Fetch messages error:", err.sqlMessage);
        return res.status(500).json({ message: "Failed to fetch messages" });
      }
      res.json(rows);
    }
  );
});
//group bananay kai liay
app.post('/api/groups', auth, (req, res) => {
  const { Group_Name } = req.body;
  const Created_By = req.user.id;

  if (!Group_Name) return res.status(400).json({ message: "Group name required" });

  db.query(
    "INSERT INTO groups (Group_Name, Created_By) VALUES (?, ?)",
    [Group_Name, Created_By],
    (err, result) => {
      if (err) return res.status(500).json({ message: "Failed to create group" });

      // Add creator as member
      db.query("INSERT INTO groupmembers (Group_ID, User_ID) VALUES (?, ?)",
        [result.insertId, Created_By],
        (err2) => {
          if (err2) return res.status(500).json({ message: "Group created but failed to add creator" });
          res.json({ message: "Group created", Group_ID: result.insertId });
        }
      );
    }
  );
});

// ====== GROUP HELPERS ======
function isGroupCreator(groupId, userId) {
  return new Promise((resolve, reject) => {
    db.query(
      "SELECT Created_By FROM groups WHERE Group_ID=?",
      [groupId],
      (err, rows) => {
        if (err) return reject(err);
        if (rows.length === 0) return resolve(false);
        resolve(rows[0].Created_By === Number(userId));
      }
    );
  });
}

function isGroupMember(groupId, userId) {
  return new Promise((resolve, reject) => {
    db.query(
      "SELECT 1 FROM groupmembers WHERE Group_ID=? AND User_ID=?",
      [groupId, userId],
      (err, rows) => {
        if (err) return reject(err);
        resolve(rows.length > 0);
      }
    );
  });
}

//grp member add karnay kai liay
app.post("/api/groups/:groupId/members", auth, async (req, res) => {
  try {
    const { groupId } = req.params;
    const { userId } = req.body; 
    const requester = req.user.id;

    if (!userId) return res.status(400).json({ message: "userId required" });
    if (!(await isGroupCreator(groupId, requester))) {
      return res.status(403).json({ message: "Only creator can add members" });
    }

    // Prevent duplicates
    db.query(
      "SELECT 1 FROM groupmembers WHERE Group_ID=? AND User_ID=?",
      [groupId, userId],
      (err, rows) => {
        if (err) return res.status(500).json({ message: "Lookup failed" });
        if (rows.length) return res.status(400).json({ message: "Already a member" });

        db.query(
          "INSERT INTO groupmembers (Group_ID, User_ID) VALUES (?, ?)",
          [groupId, userId],
          (err2) => {
            if (err2) return res.status(500).json({ message: "Add member failed" });
            res.json({ message: "Member added" });
          }
        );
      }
    );
  } catch (e) {
    res.status(500).json({ message: "Server error", error: e.message });
  }
});

// ====== REMOVE MEMBER FROM GROUP ======
// Creator can remove any member; a user can remove themself (leave group)
app.delete("/api/groups/:groupId/members/:memberId", auth, async (req, res) => {
  try {
    const { groupId, memberId } = req.params;
    const requester = req.user.id;

    const creator = await isGroupCreator(groupId, requester);
    const selfRemoving = Number(memberId) === Number(requester);

    if (!creator && !selfRemoving) {
      return res.status(403).json({ message: "Not allowed to remove this member" });
    }

    db.query(
      "DELETE FROM groupmembers WHERE Group_ID=? AND User_ID=?",
      [groupId, memberId],
      (err, result) => {
        if (err) return res.status(500).json({ message: "Remove failed" });
        if (result.affectedRows === 0) return res.status(404).json({ message: "Member not found in group" });
        res.json({ message: selfRemoving ? "You left the group" : "Member removed" });
      }
    );
  } catch (e) {
    res.status(500).json({ message: "Server error", error: e.message });
  }
});

//msg send karnay kai liay grp meui
app.post("/api/groups/:groupId/messages", auth, async (req, res) => {
  try {
    const { groupId } = req.params;
    const { Content } = req.body;
    const senderId = req.user.id;

    if (!Content || !Content.trim()) return res.status(400).json({ message: "Content required" });
    if (!(await isGroupMember(groupId, senderId))) {
      return res.status(403).json({ message: "Join group to send messages" });
    }

    db.query(
      "INSERT INTO groupmessages (Group_ID, User_ID, Content) VALUES (?, ?, ?)",
      [groupId, senderId, Content],
      (err, result) => {
        if (err) return res.status(500).json({ message: "Failed to send group message" });
        res.json({ message: "Message sent", id: result.insertId });
      }
    );
  } catch (e) {
    res.status(500).json({ message: "Server error", error: e.message });
  }
});

//message deekhne kai liay
app.get("/api/groups/:groupId/messages", auth, async (req, res) => {
  try {
    const { groupId } = req.params;
    const userId = req.user.id;

    if (!(await isGroupMember(groupId, userId))) {
      return res.status(403).json({ message: "Join group to view messages" });
    }

    db.query(
      `SELECT gm.Group_Message_ID, gm.Group_ID, gm.User_ID, u.Username, gm.Content, gm.Sent_At
       FROM groupmessages gm
       JOIN users u ON gm.User_ID = u.User_ID
       WHERE gm.Group_ID=?
       ORDER BY gm.Sent_At ASC`,
      [groupId],
      (err, rows) => {
        if (err) return res.status(500).json({ message: "Fetch failed" });
        res.json(rows);
      }
    );
  } catch (e) {
    res.status(500).json({ message: "Server error", error: e.message });
  }
});

//grp mei msg delete karnay kai liay
app.delete("/api/groups/:groupId/messages/:messageId", auth, async (req, res) => {
  try {
    const { groupId, messageId } = req.params;
    const requester = req.user.id;

    db.query(
      "SELECT User_ID FROM groupmessages WHERE Group_Message_ID=? AND Group_ID=?",
      [messageId, groupId],
      async (err, rows) => {
        if (err) return res.status(500).json({ message: "Lookup failed" });
        if (!rows.length) return res.status(404).json({ message: "Message not found" });

        const authorId = rows[0].User_ID;
        const creator = await isGroupCreator(groupId, requester);
        if (Number(authorId) !== Number(requester) && !creator) {
          return res.status(403).json({ message: "Not allowed to delete this message" });
        }

        db.query(
          "DELETE FROM groupmessages WHERE Group_Message_ID=?",
          [messageId],
          (err2, result) => {
            if (err2) return res.status(500).json({ message: "Delete failed" });
            res.json({ message: "Message deleted" });
          }
        );
      }
    );
  } catch (e) {
    res.status(500).json({ message: "Server error", error: e.message });
  }
});

//member deekhne kai liay
app.get("/api/groups/:groupId/members", auth, async (req, res) => {
  try {
    const { groupId } = req.params;
    if (!(await isGroupMember(groupId, req.user.id)) && !(await isGroupCreator(groupId, req.user.id))) {
      return res.status(403).json({ message: "Not allowed" });
    }
    db.query(
      `SELECT gm.User_ID, u.Username, u.Email
       FROM groupmembers gm
       JOIN users u ON gm.User_ID = u.User_ID
       WHERE gm.Group_ID=?`,
      [groupId],
      (err, rows) => {
        if (err) return res.status(500).json({ message: "Fetch members failed" });
        res.json(rows);
      }
    );
  } catch (e) {
    res.status(500).json({ message: "Server error", error: e.message });
  }
});
//groups deekhne kai liay
app.get("/api/my-groups", auth, (req, res) => {
  const userId = req.user.id;
  db.query(
    "SELECT * FROM groups WHERE Created_By=?",
    [userId],
    (err, rows) => {
      if (err) return res.status(500).json({ message: "Failed to fetch groups" });
      res.json(rows);
    }
  );
});

// Get all groups where the user is a member (including ones they created)
app.get("/api/groups", auth, (req, res) => {
  const userId = req.user.id;
  db.query(
    `SELECT g.Group_ID, g.Group_Name, g.Created_By, u.Username AS CreatorName
     FROM groupmembers gm
     JOIN groups g ON gm.Group_ID = g.Group_ID
     JOIN users u ON g.Created_By = u.User_ID
     WHERE gm.User_ID=?`,
    [userId],
    (err, rows) => {
      if (err) return res.status(500).json({ message: "Failed to fetch groups" });
      res.json(rows);
    }
  );
});





//files bheejne kai liay
const multer = require("multer");
const path = require("path");

// File upload setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
});
const upload = multer({ storage });




//media add karnay kai liay
app.post("/api/messages/:messageId/media", auth, upload.single("file"), (req, res) => {
  const { messageId } = req.params;
  const file = req.file;

  if (!file) return res.status(400).json({ message: "No file uploaded" });

  db.query(
    "INSERT INTO mediafiles (Message_ID, File_Type, File_URL) VALUES (?, ?, ?)",
    [messageId, file.mimetype, file.path],
    (err, result) => {
      if (err) return res.status(500).json({ message: "Failed to save media" });
      res.json({ message: "Media uploaded", id: result.insertId, file: file.path });
    }
  );
});
//send friend req

app.post("/api/friend-requests", auth, (req, res) => {
  const senderId = req.user.id;
  const { Friend_Email } = req.body;

  db.query("SELECT User_ID FROM users WHERE Email=?", [Friend_Email], (err, rows) => {
    if (err) return res.status(500).json({ message: "Database error" });
    if (rows.length === 0) return res.status(404).json({ message: "Friend not found" });

    const receiverId = rows[0].User_ID;
    if (receiverId === senderId) return res.status(400).json({ message: "Cannot add yourself" });

    // 🚫 Block check
    const blockCheck = `
      SELECT 1 FROM blockedusers
      WHERE (Blocker_ID = ? AND Blocked_ID = ?)
         OR (Blocker_ID = ? AND Blocked_ID = ?)
    `;
    db.query(blockCheck, [senderId, receiverId, receiverId, senderId], (errBlock, blockRows) => {
      if (errBlock) return res.status(500).json({ message: "Database error" });
      if (blockRows.length > 0) {
        return res.status(403).json({ message: "Cannot send request (user is blocked)" });
      }

      // ✅ Check if they are already friends
      const checkContactSql = `
        SELECT 1 FROM contacts 
        WHERE (User_ID = ? AND Contact_User_ID = ?) 
           OR (User_ID = ? AND Contact_User_ID = ?)
      `;
      db.query(checkContactSql, [senderId, receiverId, receiverId, senderId], (err2, contactRows) => {
        if (err2) return res.status(500).json({ message: "Database error" });
        if (contactRows.length > 0) {
          return res.status(400).json({ message: "You are already friends" });
        }

        // ✅ Check if there is a pending request only
        const checkRequestSql = `
          SELECT 1 FROM friendrequests
          WHERE ((Sender_ID = ? AND Receiver_ID = ?) 
              OR (Sender_ID = ? AND Receiver_ID = ?))
            AND Status = 'pending'
        `;
        db.query(checkRequestSql, [senderId, receiverId, receiverId, senderId], (err3, reqRows) => {
          if (err3) return res.status(500).json({ message: "Database error" });
          if (reqRows.length > 0) {
            return res.status(400).json({ message: "A friend request is already pending" });
          }

          // ✅ Insert new request
          const sql = `INSERT INTO friendrequests (Sender_ID, Receiver_ID, Status) VALUES (?, ?, 'pending')`;
          db.query(sql, [senderId, receiverId], (err4) => {
            if (err4) return res.status(500).json({ message: "Database error" });
            res.json({ message: "Friend request sent" });
          });
        });
      });
    });
  });
});


// 1. Send Friend Request
// app.post("/api/friend-requests", auth, (req, res) => {
//   const senderId = req.user.id;
//   const { Friend_Email } = req.body;

//   db.query("SELECT User_ID FROM users WHERE Email=?", [Friend_Email], (err, rows) => {
//     if (err) return res.status(500).json({ message: "Database error" });
//     if (rows.length === 0) return res.status(404).json({ message: "Friend not found" });

//     const receiverId = rows[0].User_ID;
//     if (receiverId === senderId) return res.status(400).json({ message: "Cannot add yourself" });

//     // ✅ Check if they are already friends
//     const checkContactSql = `
//       SELECT 1 FROM contacts 
//       WHERE (User_ID = ? AND Contact_User_ID = ?) 
//          OR (User_ID = ? AND Contact_User_ID = ?)
//     `;
//     db.query(checkContactSql, [senderId, receiverId, receiverId, senderId], (err2, contactRows) => {
//       if (err2) return res.status(500).json({ message: "Database error" });
//       if (contactRows.length > 0) {
//         return res.status(400).json({ message: "You are already friends" });
//       }

//       // ✅ Check if there is a pending request only
//       const checkRequestSql = `
//         SELECT 1 FROM friendrequests
//         WHERE ((Sender_ID = ? AND Receiver_ID = ?) 
//             OR (Sender_ID = ? AND Receiver_ID = ?))
//           AND Status = 'pending'
//       `;
//       db.query(checkRequestSql, [senderId, receiverId, receiverId, senderId], (err3, reqRows) => {
//         if (err3) return res.status(500).json({ message: "Database error" });
//         if (reqRows.length > 0) {
//           return res.status(400).json({ message: "A friend request is already pending" });
//         }

//         // ✅ Insert new request
//         const sql = `INSERT INTO friendrequests (Sender_ID, Receiver_ID, Status) VALUES (?, ?, 'pending')`;
//         db.query(sql, [senderId, receiverId], (err4) => {
//           if (err4) return res.status(500).json({ message: "Database error" });
//           res.json({ message: "Friend request sent" });
//         });
//       });
//     });
//   });
// });

// 2. Get Pending Requests for Logged-in User
app.get("/api/friend-requests", auth, (req, res) => {
  const userId = req.user.id;
  const sql = `
    SELECT fr.Request_ID, u.Username, u.Email
    FROM friendrequests fr
    JOIN users u ON fr.Sender_ID = u.User_ID
    WHERE fr.Receiver_ID = ? AND fr.Status = 'pending'
  `;
  db.query(sql, [userId], (err, rows) => {
    if (err) return res.status(500).json({ message: "Database error" });
    res.json(rows);
  });
});

// 3. Accept / Reject Friend Request
app.post("/api/friend-requests/:id/respond", auth, (req, res) => {
  const userId = req.user.id;
  const requestId = req.params.id;
  const { action } = req.body; // "accept" or "reject"

  const sql = "SELECT * FROM friendrequests WHERE Request_ID=? AND Receiver_ID=?";
  db.query(sql, [requestId, userId], (err, rows) => {
    if (err) return res.status(500).json({ message: "Database error" });
    if (rows.length === 0) return res.status(404).json({ message: "Request not found" });

    const { Sender_ID, Receiver_ID } = rows[0];
    const newStatus = action === "accept" ? "accepted" : "rejected";

    db.query("UPDATE friendrequests SET Status=? WHERE Request_ID=?", [newStatus, requestId], (err2) => {
      if (err2) return res.status(500).json({ message: "Database error" });

      if (newStatus === "accepted") {
        // Add to contacts (both ways)
        const addContacts = `
          INSERT INTO contacts (User_ID, Contact_User_ID) VALUES (?, ?), (?, ?)
        `;
        db.query(addContacts, [Sender_ID, Receiver_ID, Receiver_ID, Sender_ID], (err3) => {
          if (err3) return res.status(500).json({ message: "Database error" });
          res.json({ message: "Friend request accepted, contact added" });
        });
      } else {
        res.json({ message: "Friend request rejected" });
      }
    });
  });
});

// 🚫 Block a user by email
// 🚫 Block a user by email (also unfriend + prevent requests)
app.post("/api/block", auth, (req, res) => {
  const blockerId = req.user.id;
  const { Blocked_Email } = req.body;

  // 1. Find the user by email
  db.query("SELECT User_ID FROM users WHERE Email=?", [Blocked_Email], (err, rows) => {
    if (err) return res.status(500).json({ message: "Database error" });
    if (rows.length === 0) return res.status(404).json({ message: "User not found" });

    const blockedId = rows[0].User_ID;
    if (blockedId === blockerId) return res.status(400).json({ message: "You cannot block yourself" });

    // 2. Insert into blockedusers (if not already blocked)
    const insertBlock = `
      INSERT INTO blockedusers (Blocker_ID, Blocked_ID)
      SELECT ?, ? FROM DUAL
      WHERE NOT EXISTS (
        SELECT 1 FROM blockedusers WHERE Blocker_ID=? AND Blocked_ID=?
      )
    `;
    db.query(insertBlock, [blockerId, blockedId, blockerId, blockedId], (err2, result) => {
      if (err2) return res.status(500).json({ message: "Database error" });
      if (result.affectedRows === 0) return res.status(400).json({ message: "Already blocked" });

      // 3. Remove friendship if exists
      const deleteContacts = `
        DELETE FROM contacts
        WHERE (User_ID=? AND Contact_User_ID=?) 
           OR (User_ID=? AND Contact_User_ID=?)
      `;
      db.query(deleteContacts, [blockerId, blockedId, blockedId, blockerId], (err3) => {
        if (err3) return res.status(500).json({ message: "Error removing from contacts" });

        // 4. Also reject any pending friend requests
        const deleteRequests = `
          UPDATE friendrequests 
          SET Status='rejected'
          WHERE (Sender_ID=? AND Receiver_ID=?) 
             OR (Sender_ID=? AND Receiver_ID=?)
        `;
        db.query(deleteRequests, [blockerId, blockedId, blockedId, blockerId], (err4) => {
          if (err4) return res.status(500).json({ message: "Error updating requests" });

          res.json({ message: "User blocked, unfriended, and requests rejected" });
        });
      });
    });
  });
});


// ✅ Get blocked users for logged-in user
app.get("/api/blocked", auth, (req, res) => {
  const blockerId = req.user.id;
  const sql = `
    SELECT b.Block_ID, u.Username, u.Email, b.Created_At
    FROM blockedusers b
    JOIN users u ON b.Blocked_ID = u.User_ID
    WHERE b.Blocker_ID = ?
  `;
  db.query(sql, [blockerId], (err, rows) => {
    if (err) return res.status(500).json({ message: "Database error" });
    res.json(rows);
  });
});

//  Unblock user
app.delete("/api/block/:id", auth, (req, res) => {
  const blockerId = req.user.id;
  const blockId = req.params.id;

  const sql = "DELETE FROM blockedusers WHERE Block_ID=? AND Blocker_ID=?";
  db.query(sql, [blockId, blockerId], (err, result) => {
    if (err) return res.status(500).json({ message: "Database error" });
    if (result.affectedRows === 0) return res.status(404).json({ message: "Block not found" });

    res.json({ message: "User unblocked successfully" });
  });
});


app.listen(5000, () => {
  console.log('Is Pe Chal rha hai  http://localhost:5000');
});
