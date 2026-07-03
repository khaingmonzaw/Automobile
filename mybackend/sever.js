const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const { exec } = require("child_process"); // Call COBOL
const path = require("path"); // for Path

const app = express();
app.use(cors());
app.use(express.json());

// Connect to MySQL
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "auto_assurance_db",
});

//"Added this for new coverage"
const coverageRouter = require("./Admin/NewCoverage"); 
app.use(coverageRouter);
//"Added this for coverage types"
const coverageTypesRouter = require("./Admin/CoverageTypes");
app.use(coverageTypesRouter);
//"Added this for coverage update"
const coverageUpdateRouter = require("./Admin/CoverageUpdate");
app.use(coverageUpdateRouter);

// Login API
app.post("/api/login", (req, res) => {
  const { email, password } = req.body;

  const sql = "SELECT * FROM users WHERE email = ?";

  db.query(sql, [email], (err, results) => {
    if (err) {
      return res.status(500).json({ message: "Database Error" });
    }

    if (results.length === 0) {
      return res.status(401).json({
        message: "*Invalid credentials",
      });
    }

    const user = results[0];

    // Password incorrect
    if (user.password !== password) {
      return res.status(401).json({
        message: "*Invalid credentials",
      });
    }

    if (results.length > 0) {
      res.json({
        message: "Login Successful",
        token: "login-token",
        user,
      });
    }
  });
});

/* ================= GET POLICIES BY USER ================= */
app.get("/api/policies/:userId", (req, res) => {
  const userId = req.params.userId;

  const updateSql = `
  
  update policies set status = "inactive "where end_date < CURDATE() and status="active";
  
  `;

  db.query(updateSql,(err)=>{
    if(err) return res.status(500).json({message : "DB error"})
  
  const sql = `
        SELECT p.policy_id, p.policy_number, v.vehicle_number, v.vehicle_model
        FROM policies p
        JOIN vehicles v ON p.vehicle_id = v.vehicle_id
        WHERE p.user_id = ? and p.status="active"
    `;

  db.query(sql, [userId], (err, results) => {
    if (err) return res.status(500).json({ message: "DB Error" });

    res.json(results);
  });
  })
});

/* ================= GET COVERAGES BY POLICY USER================= */
app.get("/api/coverages/:policyId", (req, res) => {
 const policyId = req.params.policyId;

  const sql = `
    SELECT ct.coverage_type_id, ct.coverage_type
    FROM coverage_policies cp
    JOIN coverage_types ct ON cp.coverage_type_id = ct.coverage_type_id
    WHERE cp.policy_id = ?
  `;

  db.query(sql, [policyId], (err, results) => {
    if (err) {
      console.log(err);
      return res.status(500).json({ message: "DB Error" });
    }

   
    res.json(results);
  });
});



app.post("/api/claims", (req, res) => {
  const {
    user_id,
    policy_id,
    accident_type,
    accident_date,
    claimed_amount,
    description,
    location
  } = req.body;


  // GET COVERAGES
  const sql = `
    SELECT ct.coverage_type_id, ct.coverage_type
    FROM coverage_policies cp
    JOIN coverage_types ct ON cp.coverage_type_id = ct.coverage_type_id
    WHERE cp.policy_id = ?
  `;

  db.query(sql, [policy_id], (err, results) => {
    if (err) {
      return res.status(500).json({ message: "DB Error" });
    }

    const allowed = results.map(r => r.coverage_type);

    // CHECK COVERAGE
    if (!allowed.includes(accident_type)) {
      return res.status(400).json({
        message: " This accident type is NOT covered by your policy"
      });
    }

    // INSERT CLAIM (NO COBOL)
    const insertSql = `
      INSERT INTO claims
      (user_id, policy_id, accident_type, accident_date,
       claimed_amount, description, location, status)
      VALUES (?, ?, ?, ?, ?, ?, ?, 'PENDING')
    `;

    db.query(insertSql, [
      user_id,
      policy_id,
      accident_type,
      accident_date,
      claimed_amount,
      description,
      location
    ], (err) => {
      if (err) {
        return res.status(500).json({ message: "Insert Error" });
      }

      res.json({
        message: "Claim submitted successfully"
      });
    });
  });
});


// User Claim API
app.get("/api/claims/user/:userId", (req, res) => {
  const userId = req.params.userId;

  const sql = `
    SELECT *
    FROM claims
    WHERE user_id = ?
    ORDER BY claim_id DESC
  `;

  db.query(sql, [userId], (err, results) => {
    if (err) {
      console.log(err);
      return res.status(500).json({ message: "DB Error" });
    }

    res.json(results);
  });
});


// Claim Details User API

app.get("/api/claims/:id", (req, res) => {
  const id = req.params.id;

  const sql =
  
  
  `
SELECT 
  c.claim_id,
  c.created_at,
  c.accident_date,
  c.description,
  c.claimed_amount,
  c.compensation_amount,
  c.status,
  c.location,
  c.remark,
  ct.coverage_type AS accident_type,
  v.vehicle_number AS v_number,
  v.vehicle_model AS v_model
FROM claims c
JOIN policies p ON c.policy_id = p.policy_id
JOIN vehicles v ON p.vehicle_id = v.vehicle_id
JOIN coverage_policies cp ON p.policy_id = cp.policy_id
JOIN coverage_types ct ON cp.coverage_type_id = ct.coverage_type_id
WHERE c.claim_id = ?;
`
  db.query(sql, [id], (err, result) => {
    if (err) 
      
      return res.status(500).json(err);
    if (result.length === 0) return res.status(404).json({ message: "Not found" });

    res.json(result[0]);
  });
});
// Add Claim API
// app.post('/api/add-claim', (req, res) => {
//   console.log("Frontend မှ ရရှိသော Data:", req.body);
//   const { customer_id, claim_details } = req.body;

//   // SQL Insert
//   const sql = "INSERT INTO claims (customer_id, claim_details, status) VALUES (?, ?, 'PENDING')";

//   db.query(sql, [customer_id, claim_details], (err, result) => {
//     if (err) {
//       console.error("FULL ERROR DETAILS:", err);
//       return res.status(500).json({ message: "Error saving claim to DB" });
//     }

//     // call COBOL program
//     const cobolProg = path.join(__dirname, 'test.exe');
//     const command = `"${cobolProg}" "${customer_id}" "${claim_details}"`;
//     exec(command, (error, stdout, stderr) => {
//       if (error) {
//         console.error(`COBOL Execution Error: ${error}`);
//         return res.status(500).json({ message: "Claim saved, but COBOL processing failed" });
//       }
//     });
//   });
// });
// app.get('/api/db-to-cobol', (req, res) => {

//   // select data from db(first person)
//   const sql = "SELECT * FROM users LIMIT 1";

//   db.query(sql, (err, results) => {
//     if (err) return res.status(500).json({ message: "Database Error", error: err });

//     // no data in db
//     if (results.length === 0) {
//       return res.status(404).json({ message: "No Data in DB" });
//     }

//     // take id from db
//     const db_customer_id = results[0].customer_id;// results = all data from database.
//     const db_claim_details = "Data Taken from MySQL Database";

//     // sent data to cobol
//     const cobolProg = path.join(__dirname, 'test.exe');// add cobol file path
//     const command = `"${cobolProg}" "${db_customer_id}" "${db_claim_details}"`;// add data from db
//     // "G:\automobile\mybackend\test.exe" "ID-001" "Data Taken from MySQL Database"

//     exec(command, (error, stdout, stderr) => {
//       if (error) {
//         console.error(`COBOL Error: ${error}`);
//         return res.status(500).json({ message: "COBOL processing failed" });
//       }

//       // return output from cobol
//       console.log(stdout.trim());
//       res.status(200).json({
//         message: "Successful",
//         database_data: db_customer_id,
//         cobol_response: stdout.trim()
//       });
//     });
//   });
// });

app.listen(3000, () => console.log("Backend running on http://localhost:3000"));
