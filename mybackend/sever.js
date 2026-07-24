const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const { exec } = require("child_process"); // Call COBOL
const path = require("path"); // for Path
const bcrypt=require ("bcrypt");

const app = express();
app.use(cors());
app.use(express.json());

// Connect to MySQL
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "auto_assurance_db",
  timezone:  "local",
});

const seedAdmin=require("./seedAdmin");
const authController = require("./controllers/authController");
const passwordController=require("./ChangePassword")
const adminClaims=require("./Admin/AdminDashboardClaim");
const adminRisks=require("./Admin/AdminDashboardRisk");
const newCoverageRouter = require("./Admin/NewCoverage");
const coverageTypesRouter = require("./Admin/CoverageTypes");
const coverageUpdateRouter = require("./Admin/CoverageUpdate");
const addUser=require("./Admin/AddUser");
const updateUser=require("./Admin/UpdateUser");
const checkPolicy=require("./Admin/checkPolicy");
const checkVehicle=require("./Admin/checkVehicle");
const checkLicense=require("./Admin/checkLicense");
const checkDuplicate=require("./Admin/checkDuplicate");
const claimStatusAction=require("./Admin/ClaimStatusAction");
const userLists=require("./Admin/UserList");
const userDetails=require("./Admin/UserDetail");
const PendingRouter=require("./Admin/Pending");
const getStaffLists=require("./Admin/getStaffLists");
const addStaff=require("./Admin/AddStaff");
const deleteStaff=require("./Admin/DeleteStaff");


const profileUser=require("./User/Profile");
const getPolicy=require("./User/GetPolicy");
const getCoverageByPolicy=require("./User/GetCoverageByPolicy");
const submitClaim=require("./User/SubmitClaim");
const userClaim=require("./User/UserClaim");
const userClaimDetail=require("./User/UserClaimDetail");
const getActiveCoverageType=require("./User/GetActiveCoverageType");
const { get } = require("http");
app.use(newCoverageRouter);
app.use(coverageTypesRouter);
app.use(coverageUpdateRouter);
app.use(PendingRouter);









seedAdmin(db);
// Login API

// ✅ Check Pending Claim (Duplicate Check)
// =============================================
app.get("/api/claims/check-pending", (req, res) => {
  const { policy_id, accident_type, user_id } = req.query;

  // Parameter အကုန်ပါမပါ စစ်ဆေးခြင်း
  if (!policy_id  || !accident_type || !user_id) {
    return res.status(400).json({ error: "Missing required parameters" });
  }

  const sql = `
    SELECT COUNT(*) AS count
    FROM claims
    WHERE user_id = ?
      AND policy_id = ?
      AND accident_type = ?
      AND status = 'PENDING'
  `;

  db.query(sql, [user_id, policy_id, accident_type], (err, results) => {
    if (err) {
      console.error("Check pending error:", err);
      return res.status(500).json({ message: "Database Error" });
    }

    const hasPending = results[0].count > 0;
    res.json({ hasPending });
  });

});

//myo code end

app.post("/api/login",authController.login(db));

// Change Password API
app.put("/api/change-password",passwordController.changePassword(db));

//Adduser 
app.post("/api/add-user", addUser.addUser(db));

// Preview Next Policy Number
app.get("/api/policy-number", addUser.getNextPolicyNumber(db));

//update
app.put('/api/update-user/:id', updateUser.updateUser(db));

// Policy Number တူမတူ စစ်ဆေးရန် API
app.get("/api/check-policy",checkPolicy.checkPolicy(db));
 
// Vehicle Number တူမတူ စစ်ဆေးရန် API
app.get("/api/check-vehicle",checkVehicle.checkVehicle(db));

// License Number တူမတူ စစ်ဆေးရန် API
app.get("/api/check-driverlicense", checkLicense.checkLicense(db));

app.get("/api/check-duplicate", checkDuplicate.checkDuplicate(db));

/* ================= [ထည့်ရမည့်နေရာ] GET ALL CLAIMS FOR ADMIN DASHBOARD ================= */
app.get("/api/admin/claims", adminClaims.adminClaims(db));

app.get("/api/admin/risk-stats",adminRisks.adminRisks(db));

// ✅ NEW: Get all claims from the database
app.get('/api/admin/ClaimStatus/:id',claimStatusAction.claimStatusAction(db));

/* ================= GET USER PROFILE FULL DETAILS ================= */
app.get("/api/user/profile/:userId",profileUser.profile(db));


// Admin all user(userlists)(kmz)
app.get('/api/users',userLists.userLists(db));


// Admin User Detail 
app.get('/api/users/:id',userDetails.userDetails(db));


/* ================= GET POLICIES BY USER ================= */
app.get("/api/policies/:userId",getPolicy.getPolicy(db));

/* ================= GET COVERAGES BY POLICY USER================= */
app.get("/api/coverages/:policyId", getCoverageByPolicy.getCoverageByPolicy(db)
);
// Submit New Claim
app.post("/api/claims",submitClaim.submitClaim(db));

// User Claim API
app.get("/api/claims/user/:userId",userClaim.userClaim(db));


// Claim Details User API
app.get("/api/claims/:id", userClaimDetail.userClaimDetail(db));


//Active Coverage types
app.get("/api/coverage_types",getActiveCoverageType.getActiveCoverageType(db));


//Get Staff Lists
app.get("/api/staff_lists",getStaffLists.getStaffLists(db));
//myo code start
 
app.post("/api/add_staff",addStaff.addStaff(db));
  // =============================================

app.put("/api/staff_status/:id",deleteStaff.updateStaffStatus(db));


app.listen(3000, () => console.log("Backend running on http://localhost:3000"));