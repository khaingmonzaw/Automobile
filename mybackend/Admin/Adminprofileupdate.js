const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");

const router = express.Router();

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "auto_assurance_db",
});

// 1. GET ROUTE: Admin Profile အချက်အလက်များကို ID ဖြင့် ဆွဲထုတ်ရန်
router.get("/api/admin/users/:id", (req, res) => {
  const { id } = req.params;
  console.log("Backend received a request for Admin ID:", id);

  const query = "SELECT id, name, email, phone, role, nrc, dob, address FROM users WHERE id = ?";

  db.query(query, [id], (err, results) => {
    if (err) {
      console.error("MySQL retrieval error:", err);
      return res.status(500).json({ error: "Failed to retrieve admin profile data" });
    }

    console.log("SQL Results:", results);

    if (results.length === 0) {
      return res.status(404).json({ error: "Admin not found in database" });
    }
    return res.status(200).json(results[0]);
  });
});

// 2. PUT ROUTE: Admin Profile အချက်အလက်များကို Update လုပ်ရန်
router.put("/api/admin/users/:id", (req, res) => {
  const { id } = req.params;
  const { name, email, phone, role, nrc, dob, address } = req.body;

  const query = `
    UPDATE users 
    SET name = ?, email = ?, phone = ?, role = ?, nrc = ?, dob = ?, address = ? 
    WHERE id = ?
  `;

  db.query(
    query,
    [name, email, phone, role, nrc, dob, address, id],
    (err, result) => {
      if (err) {
        console.error("MySQL update error:", err);
        return res.status(500).json({ error: "Failed to update database record" });
      }
      return res.status(200).json({ message: "Profile updated successfully" });
    }
  );
});

module.exports = router;