const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");

// Change app to router so it can be combined with server.js
const router = express.Router();

// Reuse your MySQL connection parameters
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "auto_assurance_db",
});

// --- ADD THIS GET ROUTE HANDLER ---
router.get('/api/coverages', (req, res) => {
  const query = 'SELECT coverage_type_id, coverage_type, description, coverage_limit, status FROM coverage_types';
  
  db.query(query, (err, results) => {
    if (err) {
      console.error('MySQL retrieval error:', err);
      return res.status(500).json({ error: 'Failed to retrieve coverage data' });
    }
    return res.status(200).json(results);
  });
});
module.exports = router;