const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const { exec } = require("child_process"); // Call COBOL
const path = require("path"); // for Path

const app = express();
app.use(cors());
app.use(express.json());

// Connect to MySQL
const db = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "",
  database: "auto_assurance_db",
  waitForConnections: true,
  connectionLimit: 10, 
  queueLimit: 0
});

const newCoverageRouter = require("./Admin/NewCoverage");
const coverageTypesRouter = require("./Admin/CoverageTypes");
const coverageUpdateRouter = require("./Admin/CoverageUpdate");

app.use(newCoverageRouter);
app.use(coverageTypesRouter);
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


//Admin Cliaim
app.get("/api/claims",(req,res)=>{
  const sql=
  `select * from claims`;

  db.query(sql,(err,result)=>{
   return res.status(500).json(err);
    if (result.length === 0) return res.status(404).json({ message: "Not found" });

    res.json(result[0]);
  });
})
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

// Admin all user(userlists)(kmz)
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
        u.dob,               
        u.driver_license,     
        u.driver_year,       
        u.nrc,                
        u.address,            
        p.policy_number AS policyNumber, 
        p.status AS policyStatus, 
        p.start_date AS startDate, 
        p.end_date AS endDate,
        v.vehicle_number AS vehicleNumber, 
        v.vehicle_model AS vehicleModel,
        v.model_year,
        GROUP_CONCAT(ct.coverage_type SEPARATOR ', ') AS coverageType,
        GROUP_CONCAT(ct.coverage_limit SEPARATOR ', ') AS coverageLimit
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
//Coverage types
app.get("/api/coverage_types", (req, res) => {
    db.query("SELECT coverage_type_id, coverage_type FROM coverage_types WHERE status = 'active'", (err, results) => {
        if (err){
          console.error("Database Error:", err);
         return res.status(500).json(err);
        }
        res.json(results);
    });
});
//Adduser 
app.post("/api/add-user", (req, res) => {
    const { 
        fullName, email, phone, dob, nrc,
        address, driverLicense, drivingYear, vehicleModel, vehicleNumber, 
        modelYear, policyNumber, coverage, startDate, endDate 
    } = req.body;

    
    console.log("NRC Value to save:", nrc);
    // Adduser
   const userSql = `INSERT INTO users (name, phone, email, nrc, address, dob, driver_license, driver_year, role, password) 
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'user', 'password123')`;
    
   db.query(userSql, [
    fullName,    // name
    phone,       // phone
    email,       // email
    nrc,         // nrc
    address,     // address
    dob,         // dob
    driverLicense,// driver_license
    drivingYear   // driver_year
], (err, userResult) => {
    if (err) {
        console.error("Database Error:", err); // Error ကို console မှာ ကြည့်ပါ
        return res.status(500).json(err.sqlMessage);
    }
    const userId = userResult.insertId;

        // Vehicle 
        const vehicleSql = "INSERT INTO vehicles (vehicle_number, vehicle_model, model_year) VALUES (?, ?, ?)";
        db.query(vehicleSql, [vehicleNumber, vehicleModel, modelYear], (err, vResult) => {
            if (err) return res.status(500).json(err);
            const vehicleId = vResult.insertId;

            // Policy 
            const policySql = "INSERT INTO policies (policy_number, user_id, vehicle_id, start_date, end_date) VALUES (?, ?, ?, ?, ?)";
            db.query(policySql, [policyNumber, userId, vehicleId, startDate, endDate], (err, pResult) => {
                if (err) return res.status(500).json(err);
                const policyId = pResult.insertId;

                // Coverage Policies 
                let count = 0;
                if (coverage.length === 0) {
                     res.json({ message: "User and Policy successfully created!" });
                } else {
                    coverage.forEach(cTypeId => {
                        db.query("INSERT INTO coverage_policies (coverage_type_id, policy_id) VALUES (?, ?)", [cTypeId, policyId], (err) => {
                            count++;
                            if (count === coverage.length) {
                                res.json({ message: "User and all data saved successfully!" });
                            }
                        });
                    });
                }
            });
        });
    });
});

//update
app.put('/api/update-user/:id', (req, res) => {
    const userId = req.params.id;
    const { 
        fullName, phone, email, nrc, address, dob, driverLicense, drivingYear, 
        vehicleNumber, vehicleModel, modelYear, 
        policyNumber, startDate, endDate, coverage 
    } = req.body;

    // ၁။ User အချက်အလက်များကို Update လုပ်ခြင်း
    const userSql = `UPDATE users SET name=?, phone=?, email=?, nrc=?, address=?, dob=?, driver_license=?, driver_year=? WHERE id=?`;
    db.query(userSql, [fullName, phone, email, nrc, address, dob, driverLicense, drivingYear, userId], (err) => {
        if (err) return res.status(500).json({ message: "Update User Error", error: err });

        // ၂။ User နဲ့ ဆက်စပ်နေတဲ့ Policy နှင့် Vehicle ID များကို ရှာဖွေခြင်း
        db.query("SELECT policy_id, vehicle_id FROM policies WHERE user_id = ?", [userId], (err, pResult) => {
            if (err || pResult.length === 0) return res.status(500).json({ message: "Policy not found" });
            
            const { policy_id, vehicle_id } = pResult[0];

            // ၃။ Vehicle Update လုပ်ခြင်း
            const vehicleSql = "UPDATE vehicles SET vehicle_number=?, vehicle_model=?, model_year=? WHERE vehicle_id=?";
            db.query(vehicleSql, [vehicleNumber, vehicleModel, modelYear, vehicle_id], (err) => {
                if (err) return res.status(500).json({ message: "Update Vehicle Error", error: err });

                // ၄။ Policy Update လုပ်ခြင်း
                const policySql = "UPDATE policies SET policy_number=?, start_date=?, end_date=? WHERE policy_id=?";
                db.query(policySql, [policyNumber, startDate, endDate, policy_id], (err) => {
                    if (err) return res.status(500).json({ message: "Update Policy Error", error: err });

                    // ၅။ Coverage Policies ကို အရင် Delete လုပ်ပြီး အသစ်ပြန်ထည့်ခြင်း (အလွယ်ဆုံးနည်းလမ်း)
                    db.query("DELETE FROM coverage_policies WHERE policy_id = ?", [policy_id], (err) => {
                        if (err) return res.status(500).json({ message: "Coverage Cleanup Error", error: err });

                        if (!coverage || coverage.length === 0) {
                            return res.json({ message: "User data updated successfully!" });
                        }

                        // Coverage အသစ်များ ထည့်ခြင်း
                        const coverageSql = "INSERT INTO coverage_policies (coverage_type_id, policy_id) VALUES (?, ?)";
                        let count = 0;
                        coverage.forEach(cTypeId => {
                            db.query(coverageSql, [cTypeId, policy_id], () => {
                                count++;
                                if (count === coverage.length) {
                                    res.json({ message: "User data and coverage updated successfully!" });
                                }
                            });
                        });
                    });
                });
            });
        });
    });
});
app.listen(3000, () => console.log("Backend running on http://localhost:3000"));
