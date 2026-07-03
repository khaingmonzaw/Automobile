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

// 1. FIXED GET ROUTE: Added '/api/coverage' prefix to match frontend fetch URL
router.get('/api/coverage/:id', (req, res) => {
  const { id } = req.params;
  const query = 'SELECT coverage_type, description, status, base_rate, coverage_limit FROM coverage_types WHERE coverage_type_id = ?';
  
  db.query(query, [id], (err, results) => {
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

// 2. PUT ROUTE: Matches your frontend form submission URL perfectly
router.put('/api/coverage/:id', (req, res) => {
  const { id } = req.params;
  const { coverageType, description, baseRate, coverageLimit, status } = req.body;
  
  const query = `
    UPDATE coverage_types 
    SET coverage_type = ?, description = ?, base_rate = ?, coverage_limit = ?, status = ? 
    WHERE coverage_type_id = ?
  `;
  
  db.query(query, [coverageType, description, baseRate, coverageLimit, status, id], (err, result) => {
    if (err) {
      console.error('MySQL update error:', err);
      return res.status(500).json({ error: 'Failed to update database record' });
    }
    return res.status(200).json({ message: 'Updated successfully' });
  });
});

module.exports = router;