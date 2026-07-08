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
//
router.get('/api/coverage/:type', (req, res) => {
  const { type } = req.params;
  // Use LOWER to guarantee case-insensitive duplicate validation checks
  const query = 'SELECT coverage_type FROM coverage_types WHERE LOWER(coverage_type) = LOWER(?)';
  
  db.query(query, [type.trim()], (err, results) => {
    if (err) {
      console.error('MySQL retrieval error:', err);
      return res.status(500).json({ error: 'Failed to retrieve coverage data' });
    }
    if (results.length === 0) {
      return res.status(404).json({ error: 'Coverage not found' });
    }
    return res.status(200).json(results[0]);
  });
});

// Change app.post to router.post
router.post('/api/coverage', (req, res) => {
 const { coverageType, coverageLimit, description } = req.body;
  
  // FIX: Cleaned up duplicate 'description' column inside the parentheses
  const query = `
    INSERT INTO coverage_types (coverage_type, coverage_limit, description) 
    VALUES (?, ?, ?)
  `;
  
  const values = [coverageType, coverageLimit, description];

  db.query(query, values, (err, result) => {
    if (err) {
      console.error('MySQL insertion error:', err);
      return res.status(500).json({ error: 'Database saving process failed' });
    }
    return res.status(201).json({ message: 'Success', id: result.insertId });
  });
});

// Export the router so server.js can see it
module.exports = router;