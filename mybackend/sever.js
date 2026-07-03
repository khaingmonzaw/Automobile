const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const { exec } = require('child_process'); // Call COBOL
const path = require('path'); // for Path 

const app = express();
app.use(cors());
app.use(express.json());

// Connect to MySQL
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',      
  password: '',    
  database: 'auto_assurance_db' 
});

// Login API
app.post('/api/login', (req, res) => {
  const { username, password } = req.body;
  const sql = "SELECT * FROM users WHERE username = ? AND password = ?";
  
  db.query(sql, [username, password], (err, results) => {
    if (err) return res.status(500).json({ message: "Database Error" });
    if (results.length > 0) {
      res.status(200).json({ message: "Login Successful", user: results[0] });
    } else {
      res.status(401).json({ message: "Invalid credentials" });
    }
  });
});

// Add Claim API 
app.post('/api/add-claim', (req, res) => {
  console.log("Frontend မှ ရရှိသော Data:", req.body);
  const { customer_id, claim_details } = req.body;

  // SQL Insert 
  const sql = "INSERT INTO claims (customer_id, claim_details, status) VALUES (?, ?, 'PENDING')";
  
  db.query(sql, [customer_id, claim_details], (err, result) => {
    if (err) {
      console.error("FULL ERROR DETAILS:", err);
      return res.status(500).json({ message: "Error saving claim to DB" });
    }

    // call COBOL program 
    const cobolProg = path.join(__dirname, 'test.exe');
    const command = `"${cobolProg}" "${customer_id}" "${claim_details}"`;
    exec(command, (error, stdout, stderr) => {
      if (error) {
        console.error(`COBOL Execution Error: ${error}`);
        return res.status(500).json({ message: "Claim saved, but COBOL processing failed" });
      }
    });
  });
});
app.get('/api/db-to-cobol', (req, res) => {
  
  // select data from db(first person)
  const sql = "SELECT * FROM users LIMIT 1";
  
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ message: "Database Error", error: err });
    
    // no data in db
    if (results.length === 0) {
      return res.status(404).json({ message: "No Data in DB" });
    }

    // take id from db
    const db_customer_id = results[0].customer_id;// results = all data from database.
    const db_claim_details = "Data Taken from MySQL Database";

    // sent data to cobol
    const cobolProg = path.join(__dirname, 'test.exe');// add cobol file path
    const command = `"${cobolProg}" "${db_customer_id}" "${db_claim_details}"`;// add data from db
    // "G:\automobile\mybackend\test.exe" "ID-001" "Data Taken from MySQL Database"

    exec(command, (error, stdout, stderr) => {
      if (error) {
        console.error(`COBOL Error: ${error}`);
        return res.status(500).json({ message: "COBOL processing failed" });
      }

      // return output from cobol
      console.log(stdout.trim());
      res.status(200).json({ 
        message: "Successful",
        database_data: db_customer_id,
        cobol_response: stdout.trim() 
      });
    });
  });
});

// Admin all user(userlists)
app.get('/api/users', (req, res) => {
  const sql = `
    SELECT 
        u.id AS User_ID, 
        u.name AS User_Name, 
        p.policy_number AS Policy_Number, 
        u.claimed_frequency AS Claimed_Freq, 
        u.status 
    FROM users u
    LEFT JOIN policies p ON u.id = p.user_id
    WHERE u.role = 'user'  -- <--- Move Admin 
  `;
  
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json(err);
    res.json(results);
  });
});

// Admin User Detail 
app.get('/api/users/:id', (req, res) => {
  const userId = req.params.id;
  if (!userId || userId === 'undefined') {
    return res.status(400).json({ message: "Invalid User ID" });
  }

  const sql = `
    SELECT 
        u.id, 
        u.name, 
        u.email, 
        u.phone, 
        p.policy_number AS policyNumber, 
        p.status AS policyStatus, 
        p.start_date AS startDate, 
        p.end_date AS endDate,
        v.vehicle_number AS vehicleNumber, 
        v.vehicle_model AS vehicleModel,
        GROUP_CONCAT(ct.coverage_type SEPARATOR ', ') AS coverageType
    FROM users u
    LEFT JOIN policies p ON u.id = p.user_id
    LEFT JOIN vehicles v ON p.vehicle_id = v.vehicle_id
    LEFT JOIN coverage_policies cp ON p.policy_id = cp.policy_id
    LEFT JOIN coverage_types ct ON cp.coverage_type_id = ct.coverage_type_id
    WHERE u.id = ?
    GROUP BY u.id, p.policy_id
  `;
  
  db.query(sql, [userId], (err, results) => {
    if (err) {
        console.error("SQL Error:" ,err);
        return res.status(500).json(err);
    }
    if (results.length === 0) return res.status(404).json({ message: "User not found" });
    res.json(results[0]); 
  });
});

app.listen(3000, () => console.log("Backend running on http://localhost:3000"));